// Per-module in-app purchase adapter.
//
// Each study module (one scheme + method + level) is sold as a separate
// non-consumable product, and each scheme + method pair is also sold as a
// bundle covering both levels (see lib/bundles.ts). This adapter uses
// RevenueCat (react-native-purchases) when the native module is present (a
// dev or EAS build), and falls back to a local mock when it is not (Expo Go),
// so the app still runs and the paywall flow stays testable.

import { Platform } from "react-native";

import { bundleForProduct } from "./bundles";
import { useStore } from "./store";

declare const require: any;

// From your RevenueCat project: Apple App Store public API key (starts "appl_").
export const REVENUECAT_IOS_API_KEY = "appl_HLSuRTMQPpkapznteeUQhVrHWUZ";
// Google Play public API key (starts "goog_"), RC project dfe906c6.
export const REVENUECAT_ANDROID_API_KEY = "goog_EQjEaFEtmcjoMLKgjCHGNfUHsOv";
const REVENUECAT_API_KEY =
  Platform.OS === "android" ? REVENUECAT_ANDROID_API_KEY : REVENUECAT_IOS_API_KEY;

// Shown ONLY in mock mode (no native store). A real build never displays a
// price the store did not return: it used to fall back to a hardcoded "$4.99"
// for a $9.99 module whenever the price lookup failed, so a reader on a bad
// connection saw half the real price and then hit "Product not found" on tap.
export const MOCK_PRICE = "$9.99";
export const MOCK_BUNDLE_PRICE = "$14.99";

// module id  ->  App Store product identifier
export function productIdForModule(moduleId: string): string {
  return "unlock_" + moduleId.replace(/-/g, "_");
}

// App Store product identifier  ->  module id (single-module products only)
export function moduleIdForProduct(productId: string): string {
  return productId.replace(/^unlock_/, "").replace(/_/g, "-");
}

// Every module a product grants: two for a bundle, one for anything else.
export function moduleIdsForProduct(productId: string): string[] {
  const bundle = bundleForProduct(productId);
  return bundle ? bundle.moduleIds : [moduleIdForProduct(productId)];
}

// Try to load the native module. Absent in Expo Go -> mock mode.
let Purchases: any = null;
try {
  const name = "react-native-purchases";
  const m = require(name);
  Purchases = m?.default ?? m;
} catch {
  Purchases = null;
}
export const nativePurchasesAvailable = !!Purchases;

let configured = false;

// All non-consumable product ids the customer owns. Reads both
// allPurchasedProductIdentifiers and nonSubscriptionTransactions so the
// ownership check survives field changes across SDK versions.
function ownedProductIds(info: any): string[] {
  const a: string[] = info?.allPurchasedProductIdentifiers ?? [];
  const b: string[] = (info?.nonSubscriptionTransactions ?? [])
    .map((t: any) => t?.productIdentifier)
    .filter(Boolean);
  return Array.from(new Set([...a, ...b]));
}

function syncFromCustomerInfo(info: any): void {
  useStore.getState().setUnlocked(ownedProductIds(info).flatMap(moduleIdsForProduct));
}

export async function configure(): Promise<void> {
  if (configured || !Purchases) return;
  try {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    configured = true;
    Purchases.addCustomerInfoUpdateListener((info: any) => syncFromCustomerInfo(info));
    const info = await Purchases.getCustomerInfo();
    syncFromCustomerInfo(info);
  } catch {
    // leave unconfigured; mock paths still function
  }
}

// The price exactly as the store reports it, or null when the store did not
// answer. Callers show "price unavailable", never a guess.
export async function getPriceForProduct(productId: string): Promise<string | null> {
  if (!Purchases) return bundleForProduct(productId) ? MOCK_BUNDLE_PRICE : MOCK_PRICE;
  try {
    const products = await Purchases.getProducts([productId]);
    return products?.[0]?.priceString ?? null;
  } catch {
    return null;
  }
}

export function getPriceForModule(moduleId: string): Promise<string | null> {
  return getPriceForProduct(productIdForModule(moduleId));
}

// Thrown when the store returns nothing for a product. Worded for the reader,
// since it goes straight into an alert; the raw "Product not found: unlock_x"
// it replaces was written for the developer.
export class StoreUnreachableError extends Error {
  constructor() {
    super("The store did not answer. Check your connection and try again.");
    this.name = "StoreUnreachableError";
  }
}

// Resolves true once every module the product grants is unlocked. Throws on
// failure; a user cancellation surfaces as an error carrying userCancelled.
export async function purchaseProduct(productId: string): Promise<boolean> {
  if (!Purchases) {
    // mock: grant locally
    for (const id of moduleIdsForProduct(productId)) useStore.getState().unlockModule(id);
    return true;
  }
  const products = await Purchases.getProducts([productId]);
  if (!products || !products[0]) throw new StoreUnreachableError();
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
  syncFromCustomerInfo(customerInfo);
  return ownedProductIds(customerInfo).includes(productId);
}

export function purchaseModule(moduleId: string): Promise<boolean> {
  return purchaseProduct(productIdForModule(moduleId));
}

// Returns the number of restored purchases.
export async function restorePurchases(): Promise<number> {
  if (!Purchases) return useStore.getState().unlocked.length;
  const info = await Purchases.restorePurchases();
  syncFromCustomerInfo(info);
  return ownedProductIds(info).length;
}
