import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { useStore } from "../lib/store";
import { blockLabels, mono, readinessColor, theme } from "../lib/theme";

export default function Results() {
  const router = useRouter();
  const { exam } = useLocalSearchParams<{ exam?: string }>();
  const exams = useStore((s) => s.exams);
  const rec = (exam ? exams.find((e) => e.id === exam) : undefined) ?? exams[0];

  if (!rec) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.ink }}>No exam results yet.</Text>
      </SafeAreaView>
    );
  }

  const pct = Math.round((rec.score / rec.total) * 100);
  const color = readinessColor(pct, true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: theme.bgPanel,
            borderWidth: 1,
            borderColor: theme.borderHi,
            borderRadius: 14,
            padding: 20,
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted }}>
            MOCK EXAM RESULT
          </Text>
          <Text style={{ fontFamily: mono, fontSize: 52, fontWeight: "700", color, marginVertical: 6 }}>
            {pct}
            <Text style={{ fontSize: 24 }}>%</Text>
          </Text>
          <Text style={{ fontFamily: mono, fontSize: 13, color: theme.inkSoft }}>
            {rec.score} / {rec.total} CORRECT
          </Text>
        </View>

        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginBottom: 12 }}>
          BY TOPIC
        </Text>
        <View style={{ gap: 13 }}>
          {Object.entries(rec.byBlock).map(([bk, v]) => {
            const p = v.total ? v.correct / v.total : 0;
            const c = readinessColor(Math.round(p * 100), true);
            return (
              <View key={bk}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                  <Text style={{ fontSize: 13, color: theme.inkSoft }}>{blockLabels[bk] ?? bk}</Text>
                  <Text style={{ fontFamily: mono, fontSize: 12, color: c }}>
                    {v.correct}/{v.total}
                  </Text>
                </View>
                <ProgressBar value={p} color={c} />
              </View>
            );
          })}
        </View>

        {(rec.missed?.length ?? 0) > 0 && (
          <Pressable
            onPress={() => router.push({ pathname: "/review", params: { exam: rec.id } })}
            style={{
              marginTop: 26,
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderColor: theme.red,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: theme.redText }}>
              REVIEW WHAT YOU MISSED ({(rec.missed?.length ?? 0)})
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => router.replace("/module/utii-conventional")}
          style={{ marginTop: 12, backgroundColor: theme.amber, borderRadius: 10, paddingVertical: 14, alignItems: "center" }}
        >
          <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: "#1A1206" }}>
            BACK TO TOPICS
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
