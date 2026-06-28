import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import {
  getPriceForModule,
  nativePurchasesAvailable,
  purchaseModule,
  restorePurchases,
} from "../lib/purchases";
import { mono, useTheme } from "../lib/theme";

const INCLUDED = [
  "Every question in this module",
  "Unlimited practice, weakest topics first",
  "Timed mock exams with scoring",
  "Progress and readiness tracking",
  "Saved questions and exam history",
];

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
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    getPriceForModule(moduleId).then((p) => {
      if (alive) setPrice(p);
    });
    return () => {
      alive = false;
    };
  }, [moduleId]);

  async function onUnlock() {
    setBusy(true);
    try {
      await purchaseModule(moduleId);
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
            <Text style={{ color: theme.amber, marginRight: 8, fontSize: 13 }}>{"\u2713"}</Text>
            <Text style={{ flex: 1, fontSize: 13, color: theme.inkSoft, lineHeight: 18 }}>{f}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onUnlock}
        disabled={busy}
        style={{
          marginTop: 18,
          backgroundColor: theme.amber,
          borderRadius: 11,
          paddingVertical: 15,
          alignItems: "center",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? (
          <ActivityIndicator color={theme.onAccent} />
        ) : (
          <Text
            style={{ fontFamily: mono, fontSize: 14, fontWeight: "700", letterSpacing: 0.5, color: theme.onAccent }}
          >
            UNLOCK{price ? "  " + price : ""}
          </Text>
        )}
      </Pressable>

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
        One-time purchase. An independent study aid, not affiliated with or endorsed by API, ASNT, ISO, BINDT, or
        TWI.
      </Text>
      {!nativePurchasesAvailable && (
        <Text style={{ fontFamily: mono, fontSize: 10, color: theme.muted, marginTop: 8, textAlign: "center" }}>
          (dev build: purchases not linked, unlock is simulated)
        </Text>
      )}
    </View>
  );
}
