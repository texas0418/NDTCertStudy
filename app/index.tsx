import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { MODULES, getAllQuestions } from "../lib/bank";
import { blockReadiness, useStore } from "../lib/store";
import { mono, readinessColor, theme } from "../lib/theme";

export default function Shelf() {
  const router = useRouter();
  const progress = useStore((s) => s.progress);

  function Stat({ value, label }: { value: string; label: string }) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: mono, fontSize: 18, fontWeight: "700", color: theme.ink }}>{value}</Text>
        <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.8, color: theme.muted, marginTop: 2 }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.amberText, marginBottom: 16 }}>
          NDT CERT STUDY
        </Text>

        {MODULES.map((m) => {
          const allIds = getAllQuestions(m.id).map((q) => q.id);
          const overall = blockReadiness(progress, allIds);
          const attempted = allIds.some((id) => (progress[id]?.seen ?? 0) > 0);
          const seenCount = allIds.filter((id) => (progress[id]?.seen ?? 0) > 0).length;
          const masteredCount = allIds.filter((id) => (progress[id]?.correct ?? 0) > 0).length;
          const color = readinessColor(overall, attempted);

          return (
            <Pressable
              key={m.id}
              onPress={() => router.push(`/module/${m.id}`)}
              style={{
                backgroundColor: theme.bgPanel,
                borderWidth: 1,
                borderColor: theme.borderHi,
                borderRadius: 14,
                padding: 18,
                marginBottom: 14,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: "700", color: theme.ink }}>{m.title}</Text>
                  <Text style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.5, color: theme.muted, marginTop: 3 }}>
                    {m.subtitle.toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontFamily: mono, fontSize: 34, fontWeight: "700", color }}>
                  {overall}
                  <Text style={{ fontSize: 16, color: attempted ? color : theme.muted }}>%</Text>
                </Text>
              </View>

              <View style={{ marginTop: 16, marginBottom: 16 }}>
                <ProgressBar value={overall / 100} color={color} />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Stat value={String(allIds.length)} label="QUESTIONS" />
                <Stat value={String(seenCount)} label="SEEN" />
                <Stat value={String(masteredCount)} label="MASTERED" />
              </View>

              <View
                style={{
                  marginTop: 16,
                  backgroundColor: theme.amber,
                  borderRadius: 9,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: "#1A1206" }}>
                  {attempted ? "CONTINUE \u2192" : "START STUDYING \u2192"}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 17, marginTop: 4 }}>
          {MODULES.length} modules owned. The shelf fills in here as further certifications are added.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
