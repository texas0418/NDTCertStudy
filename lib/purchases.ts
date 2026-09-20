// Per-module in-app purchase adapter.
//
// Each study module (one scheme + method + level) is sold as a separate
// non-consumable product. This adapter uses RevenueCat (react-native-purchases)
// when the native module is present (a dev or EAS build), and falls back to a
// local mock when it is not (Expo Go, or before IAP is wired), so the app still
// runs and the paywall flow stays testable.
//
// To go live:
//   1. npm install react-native-purchases
//   2. Set REVENUECAT_IOS_API_KEY below to your RevenueCat App Store key.
//   3. Create one non-consumable product per module in App Store Connect,
//      using the ids from productIdForModule (see MODULE_PRODUCT_IDS).
//   4. Build with EAS (StoreKit does not run in Expo Go).

import { Platform } from "react-native";

import { useStore } from "./store";

declare const require: any;

// From your RevenueCat project: Apple App Store public API key (starts "appl_").
export const REVENUECAT_IOS_API_KEY = "appl_HLSuRTMQPpkapznteeUQhVrHWUZ";
// Google Play public API key (starts "goog_"), RC project dfe906c6.
export const REVENUECAT_ANDROID_API_KEY = "goog_EQjEaFEtmcjoMLKgjCHGNfUHsOv";
const REVENUECAT_API_KEY =
  Platform.OS === "android" ? REVENUECAT_ANDROID_API_KEY : REVENUECAT_IOS_API_KEY;

// Shown only in mock mode. Real builds display the App Store localized price.
export const MOCK_PRICE = "$4.99";

// module id  ->  App Store product identifier
export function productIdForModule(moduleId: string): string {
  return "unlock_" + moduleId.replace(/-/g, "_");
}

// App Store product identifier  ->  module id
export function moduleIdForProduct(productId: string): string {
  return productId.replace(/^unlock_/, "").replace(/_/g, "-");
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
  useStore.getState().setUnlocked(ownedProductIds(info).map(moduleIdForProduct));
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

export async function getPriceForModule(moduleId: string): Promise<string> {
  if (!Purchases) return MOCK_PRICE;
  try {
    const products = await Purchases.getProducts([productIdForModule(moduleId)]);
    if (products && products[0]?.priceString) return products[0].priceString;
  } catch {
    // fall through
  }
  return MOCK_PRICE;
}

// Resolves true once the module is unlocked. Throws on failure; a user
// cancellation surfaces as an error carrying userCancelled === true.
export async function purchaseModule(moduleId: string): Promise<boolean> {
  if (!Purchases) {
    useStore.getState().unlockModule(moduleId); // mock: grant locally
    return true;
  }
  const pid = productIdForModule(moduleId);
  const products = await Purchases.getProducts([pid]);
  if (!products || !products[0]) throw new Error("Product not found: " + pid);
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
  syncFromCustomerInfo(customerInfo);
  return ownedProductIds(customerInfo).includes(pid);
}

// Returns the number of restored purchases.
export async function restorePurchases(): Promise<number> {
  if (!Purchases) return useStore.getState().unlocked.length;
  const info = await Purchases.restorePurchases();
  syncFromCustomerInfo(info);
  return ownedProductIds(info).length;
}
