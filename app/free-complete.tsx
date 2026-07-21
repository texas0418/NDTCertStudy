import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PAID_FEATURES, getFreeBase } from "../lib/bank";
import { mono, useMethodColors, useTheme } from "../lib/theme";

export default function FreeComplete() {
  const theme = useTheme();
  const methodColors = useMethodColors();
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module?: string }>();
  const base = getFreeBase(module ?? "");
  const title = base?.title ?? "this method";
  const method = base?.method ?? "";
  const mc = methodColors[method] ?? { tint: theme.bgPanel, accent: theme.amber };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 22 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 11,
              backgroundColor: mc.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontFamily: mono, fontSize: 15, fontWeight: "700", color: theme.onAccent }}>{method}</Text>
          </View>
          <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.amberText }}>
            END OF FREE SAMPLE
          </Text>
          <Text style={{ fontSize: 21, fontWeight: "700", color: theme.ink, marginTop: 6, textAlign: "center" }}>
            That&apos;s the free 10 for {title}
          </Text>
          <Text style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 19, marginTop: 6, textAlign: "center" }}>
            Nothing here was scored or saved. Unlocking the full version turns this into a real study plan.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.bgPanel,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 16,
            marginBottom: 22,
          }}
        >
          <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.8, color: theme.amberText, marginBottom: 10 }}>
            WHAT THE FULL VERSION ADDS
          </Text>
          {PAID_FEATURES.map((line) => (
            <View key={line} style={{ flexDirection: "row", marginBottom: 8 }}>
              <Text style={{ fontFamily: mono, fontSize: 13, color: theme.amber, marginRight: 8, lineHeight: 19 }}>
                {"+"}
              </Text>
              <Text style={{ flex: 1, fontSize: 13, color: theme.inkSoft, lineHeight: 19 }}>{line}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.replace("/")}
          style={{ backgroundColor: theme.amber, borderRadius: 10, paddingVertical: 14, alignItems: "center" }}
        >
          <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: theme.onAccent }}>
            CHOOSE YOUR SCHEME
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
