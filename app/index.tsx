import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar } from "../components/ProgressBar";
import { MODULES, getAllQuestions } from "../lib/bank";
import { blockReadiness, useStore } from "../lib/store";
import { mono, readinessColor, theme } from "../lib/theme";

export default function Shelf() {
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  // Single-open accordion. First module starts expanded so the page is not bare.
  const [openId, setOpenId] = useState<string | null>(MODULES[0]?.id ?? null);

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
          const open = openId === m.id;

          return (
            <View
              key={m.id}
              style={{
                backgroundColor: theme.bgPanel,
                borderWidth: 1,
                borderColor: open ? theme.borderHi : theme.border,
                borderRadius: 14,
                padding: 18,
                marginBottom: 12,
              }}
            >
              {/* Header row - tap to expand/collapse */}
              <Pressable
                onPress={() => setOpenId(open ? null : m.id)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 9,
                    borderWidth: 1,
                    borderColor: theme.borderHi,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontFamily: mono, fontSize: 14, fontWeight: "700", color: theme.amberText }}>
                    {m.method}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 19, fontWeight: "700", color: theme.ink }}>{m.title}</Text>
                  <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.5, color: theme.muted, marginTop: 2 }}>
                    {m.subtitle.toUpperCase()}
                  </Text>
                </View>

                <Text style={{ fontFamily: mono, fontSize: 22, fontWeight: "700", color, marginRight: 10 }}>
                  {overall}
                  <Text style={{ fontSize: 11, color: attempted ? color : theme.muted }}>%</Text>
                </Text>
                <Text style={{ fontFamily: mono, fontSize: 13, color: theme.muted, width: 16, textAlign: "center" }}>
                  {open ? "\u25BE" : "\u25B8"}
                </Text>
              </Pressable>

              {/* Expanded body */}
              {open && (
                <View>
                  <View style={{ marginTop: 16, marginBottom: 16 }}>
                    <ProgressBar value={overall / 100} color={color} />
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Stat value={String(allIds.length)} label="QUESTIONS" />
                    <Stat value={String(seenCount)} label="SEEN" />
                    <Stat value={String(masteredCount)} label="MASTERED" />
                  </View>

                  <Pressable
                    onPress={() => router.push(`/module/${m.id}`)}
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
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}

        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 17, marginTop: 4 }}>
          {MODULES.length} modules owned. Tap a module to expand it. The shelf fills in here as further certifications are added.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
