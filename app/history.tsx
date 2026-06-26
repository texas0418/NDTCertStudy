import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "../lib/store";
import { blockLabels, mono, readinessColor, theme } from "../lib/theme";

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${date} \u00b7 ${time}`;
  } catch {
    return iso;
  }
}

export default function History() {
  const router = useRouter();
  const exams = useStore((s) => s.exams);

  if (exams.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21 }}>
          No exams taken yet. Finish a mock exam and it will appear here.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginBottom: 12 }}>
          {exams.length} EXAM{exams.length === 1 ? "" : "S"}
        </Text>
        <View style={{ gap: 10 }}>
          {exams.map((e) => {
            const pct = e.total ? Math.round((e.score / e.total) * 100) : 0;
            const color = readinessColor(pct, true);
            const blockName = e.blockKey === "all" ? "All topics" : blockLabels[e.blockKey] ?? e.blockKey;
            const missedCount = e.missed?.length ?? 0;
            return (
              <Pressable
                key={e.id}
                onPress={() => router.push({ pathname: "/results", params: { exam: e.id } })}
                style={{
                  backgroundColor: theme.bgPanel,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 11,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: theme.ink, fontWeight: "600" }}>{blockName}</Text>
                  <Text style={{ fontFamily: mono, fontSize: 10, color: theme.muted, marginTop: 3, letterSpacing: 0.3 }}>
                    {fmtDate(e.dateISO)} {"\u00b7"} {e.score}/{e.total}
                    {missedCount > 0 ? `  \u00b7  ${missedCount} MISSED` : ""}
                  </Text>
                </View>
                <Text style={{ fontFamily: mono, fontSize: 22, fontWeight: "700", color, marginLeft: 12 }}>
                  {pct}
                  <Text style={{ fontSize: 12 }}>%</Text>
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
