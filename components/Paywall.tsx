import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { bundleForModule, type BundleDef } from "../lib/bundles";
import {
  getPriceForProduct,
  nativePurchasesAvailable,
  productIdForModule,
  purchaseProduct,
  restorePurchases,
} from "../lib/purchases";
import { useStore } from "../lib/store";
import { mono, useTheme } from "../lib/theme";

const INCLUDED = [
  "Every question in this module",
  "Unlimited practice, weakest topics first",
  "Timed mock exams with scoring",
  "Progress and readiness tracking",
  "Saved questions and exam history",
];

// undefined = still asking the store, null = the store did not answer.
type Price = string | null | undefined;

// The bundle to offer on this module's paywall, or undefined when the reader
// already owns the other level: selling both again would charge the bundle
// price for one level's worth of new content.
function offerableBundle(moduleId: string, unlocked: string[]): BundleDef | undefined {
  const b = bundleForModule(moduleId);
  if (!b) return undefined;
  const ownsOther = b.moduleIds.some((id) => id !== moduleId && unlocked.includes(id));
  return ownsOther ? undefined : b;
}

function UnlockButton({
  label,
  price,
  busy,
  primary,
  onPress,
}: {
  label: string;
  price: Price;
  busy: boolean;
  primary: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const ink = primary ? theme.onAccent : theme.amber;
  return (
    <Pressable
      onPress={onPress}
      disabled={busy || price === null}
      style={{
        marginTop: 10,
        backgroundColor: primary ? theme.amber : "transparent",
        borderWidth: primary ? 0 : 1.5,
        borderColor: theme.amber,
        borderRadius: 11,
        paddingVertical: 15,
        alignItems: "center",
        opacity: busy || price === null ? 0.6 : 1,
      }}
    >
      {busy ? (
        <ActivityIndicator color={ink} />
      ) : (
        <Text style={{ fontFamily: mono, fontSize: 14, fontWeight: "700", letterSpacing: 0.5, color: ink }}>
          {label}
          {price ? "  " + price : ""}
        </Text>
      )}
    </Pressable>
  );
}

function PriceNote({ onRetry }: { onRetry: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ marginTop: 10, alignItems: "center" }}>
      <Text style={{ fontSize: 12, color: theme.muted, textAlign: "center" }}>
        Could not get prices from the store. Check your connection.
      </Text>
      <Pressable onPress={onRetry} hitSlop={8} style={{ paddingVertical: 8 }}>
        <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: theme.amber }}>
          RETRY
        </Text>
      </Pressable>
    </View>
  );
}

function BundleCard({ bundle, price, busy, onPress }: {
  bundle: BundleDef;
  price: Price;
  busy: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ marginTop: 18, borderWidth: 1.5, borderColor: theme.amber, borderRadius: 12, padding: 14 }}>
      <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.amber }}>BOTH LEVELS</Text>
      <Text style={{ fontSize: 17, fontWeight: "700", color: theme.ink, marginTop: 4 }}>{bundle.title}</Text>
      <Text style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 19, marginTop: 2 }}>
        Level I and Level II of {bundle.subtitle} for this certification in one purchase.
      </Text>
      <UnlockButton label="UNLOCK BOTH" price={price} busy={busy} primary onPress={onPress} />
    </View>
  );
}

export function Paywall({
  moduleId,
  title,
  freeKey,
}: {
  moduleId: string;
  title: string;
  freeKey: string;
}) {
  const theme = useTheme();
  const router = useRouter();
  const unlocked = useStore((s) => s.unlocked);
  const bundle = offerableBundle(moduleId, unlocked);
  const singleId = productIdForModule(moduleId);
  const [price, setPrice] = useState<Price>(undefined);
  const [bundlePrice, setBundlePrice] = useState<Price>(undefined);
  const [busy, setBusy] = useState(false);

  const loadPrices = useCallback(() => {
    let alive = true;
    setPrice(undefined);
    setBundlePrice(undefined);
    getPriceForProduct(singleId).then((p) => {
      if (alive) setPrice(p);
    });
    if (bundle) {
      getPriceForProduct(bundle.productId).then((p) => {
        if (alive) setBundlePrice(p);
      });
    }
    return () => {
      alive = false;
    };
  }, [singleId, bundle]);

  useEffect(() => loadPrices(), [loadPrices]);

  async function buy(productId: string) {
    setBusy(true);
    try {
      await purchaseProduct(productId);
    } catch (e: any) {
      if (!e?.userCancelled) {
        Alert.alert("Purchase failed", e?.message ?? "Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onRestore() {
    setBusy(true);
    try {
      const n = await restorePurchases();
      Alert.alert(
        "Restore complete",
        n > 0 ? "Your purchases have been restored." : "No previous purchases were found."
      );
    } catch (e: any) {
      Alert.alert("Restore failed", e?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const unreachable = price === null || (bundle !== undefined && bundlePrice === null);

  return (
    <View
      style={{
        backgroundColor: theme.bgPanel,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        padding: 18,
      }}
    >
      <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted }}>
        LOCKED MODULE
      </Text>
      <Text style={{ fontSize: 19, fontWeight: "700", color: theme.ink, marginTop: 6 }}>
        Unlock {title}
      </Text>
      <Text style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 19, marginTop: 4 }}>
        A one-time purchase unlocks this method and level for this certification.
      </Text>

      <View style={{ marginTop: 14, gap: 8 }}>
        {INCLUDED.map((f) => (
          <View key={f} style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={{ color: theme.amber, marginRight: 8, fontSize: 13 }}>{"✓"}</Text>
            <Text style={{ flex: 1, fontSize: 13, color: theme.inkSoft, lineHeight: 18 }}>{f}</Text>
          </View>
        ))}
      </View>

      {bundle && (
        <BundleCard bundle={bundle} price={bundlePrice} busy={busy} onPress={() => buy(bundle.productId)} />
      )}

      <UnlockButton
        label={bundle ? `UNLOCK ${title.toUpperCase()} ONLY` : "UNLOCK"}
        price={price}
        busy={busy}
        primary={!bundle}
        onPress={() => buy(singleId)}
      />

      {unreachable && <PriceNote onRetry={loadPrices} />}

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/session",
            params: { module: freeKey, block: "all", mode: "practice", free: "1" },
          })
        }
        style={{ marginTop: 10, paddingVertical: 12, alignItems: "center" }}
      >
        <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: theme.amber }}>
          TRY THE FREE SAMPLE
        </Text>
      </Pressable>

      <Pressable onPress={onRestore} disabled={busy} style={{ paddingVertical: 8, alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: theme.muted }}>Restore purchases</Text>
      </Pressable>

      <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 16, marginTop: 12, textAlign: "center" }}>
        One-time purchase. An independent study aid, not affiliated with, endorsed by, or sponsored by API, ASNT,
        ISO, CGSB, BINDT/PCN, or TWI/CSWIP. All certification names and marks are the property of their respective
        owners.
      </Text>
      {!nativePurchasesAvailable && (
        <Text style={{ fontFamily: mono, fontSize: 10, color: theme.muted, marginTop: 8, textAlign: "center" }}>
          (dev build: purchases not linked, unlock is simulated)
        </Text>
      )}
    </View>
  );
}
