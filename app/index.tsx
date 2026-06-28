import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FREE_PREVIEW_COUNT,
  PAID_FEATURES,
  SCHEMES,
  getAllQuestions,
  getFreeSets,
  modulesForScheme,
} from "../lib/bank";
import { daysUntil } from "../lib/plan";
import { blockReadiness, useStore } from "../lib/store";
import { mono, readinessColor as readinessColorFn, schemeAccent, useMethodColors, useTheme } from "../lib/theme";

const FREE_ID = "__free__";

export default function Shelf() {
  const theme = useTheme();
  const methodColors = useMethodColors();
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  const targetDates = useStore((s) => s.targetDates);
  // Single-open accordion. Everything starts collapsed.
  const [openId, setOpenId] = useState<string | null>(null);
  const freeSets = getFreeSets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.amberText, marginBottom: 16 }}>
          NDT CERT STUDY
        </Text>

        {/* Free card - scheme-agnostic sampler + paid value prop */}
        {(() => {
          const open = openId === FREE_ID;
          return (
            <View
              style={{
                backgroundColor: theme.amberBg,
                borderWidth: 1,
                borderColor: open ? theme.amber : theme.border,
                borderRadius: 14,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <Pressable onPress={() => setOpenId(open ? null : FREE_ID)} style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 9,
                    backgroundColor: theme.amber,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", color: theme.onAccent }}>FREE</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 19, fontWeight: "700", color: theme.ink }}>Free Practice</Text>
                  <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.5, color: theme.muted, marginTop: 2 }}>
                    10 QUESTIONS {"\u00b7"} EVERY METHOD
                  </Text>
                </View>
                <Text style={{ fontFamily: mono, fontSize: 13, color: theme.muted, width: 16, textAlign: "center" }}>
                  {open ? "\u25BE" : "\u25B8"}
                </Text>
              </Pressable>

              {open && (
                <View style={{ marginTop: 14, gap: 8 }}>
                  {freeSets.map((s) => {
                    const mc = methodColors[s.method] ?? { tint: theme.bgPanel, accent: theme.amber };
                    return (
                      <Pressable
                        key={s.baseKey}
                        onPress={() =>
                          router.push({
                            pathname: "/session",
                            params: { module: s.baseKey, block: "all", mode: "practice", free: "1" },
                          })
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: theme.bgPanel,
                          borderWidth: 1,
                          borderColor: theme.border,
                          borderRadius: 10,
                          paddingVertical: 11,
                          paddingHorizontal: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: mc.accent,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontFamily: mono, fontSize: 11, fontWeight: "700", color: theme.onAccent }}>
                            {s.method}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: theme.ink }}>{s.title}</Text>
                          <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.5, color: theme.muted, marginTop: 1 }}>
                            {s.questionIds.length} FREE QUESTIONS
                          </Text>
                        </View>
                        <Text style={{ fontFamily: mono, fontSize: 14, color: theme.muted }}>{"\u203A"}</Text>
                      </Pressable>
                    );
                  })}

                  <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                    <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.8, color: theme.amberText, marginBottom: 8 }}>
                      WHAT THE FULL VERSION ADDS
                    </Text>
                    {PAID_FEATURES.map((line) => (
                      <View key={line} style={{ flexDirection: "row", marginBottom: 6 }}>
                        <Text style={{ fontFamily: mono, fontSize: 13, color: theme.amber, marginRight: 8, lineHeight: 19 }}>
                          {"+"}
                        </Text>
                        <Text style={{ flex: 1, fontSize: 13, color: theme.inkSoft, lineHeight: 19 }}>{line}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.4, color: theme.muted, marginTop: 8 }}>
                    SAMPLES ARE NOT SCORED OR SAVED
                  </Text>
                </View>
              )}
            </View>
          );
        })()}

        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginTop: 6, marginBottom: 12 }}>
          CERTIFICATION SCHEMES
        </Text>

        {SCHEMES.map((scheme) => {
          const open = openId === scheme.id;
          const accent = schemeAccent[scheme.id] ?? theme.amber;
          const mods = modulesForScheme(scheme.id);
          return (
            <View
              key={scheme.id}
              style={{
                backgroundColor: theme.bgPanel,
                borderWidth: 1,
                borderColor: open ? accent : theme.border,
                borderRadius: 14,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <Pressable onPress={() => setOpenId(open ? null : scheme.id)} style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 9,
                    backgroundColor: accent,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", color: theme.onAccent }}>{scheme.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: theme.ink }}>{scheme.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{scheme.body}</Text>
                  <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.4, color: theme.muted, marginTop: 2 }}>
                    {scheme.standard.toUpperCase()} {"\u00b7"} {mods.length} MODULES
                  </Text>
                </View>
                <Text style={{ fontFamily: mono, fontSize: 13, color: theme.muted, width: 16, textAlign: "center" }}>
                  {open ? "\u25BE" : "\u25B8"}
                </Text>
              </Pressable>

              {open && (
                <View style={{ marginTop: 14, gap: 8 }}>
                  {mods.map((m) => {
                    const ids = getAllQuestions(m.id).map((q) => q.id);
                    const overall = blockReadiness(progress, ids);
                    const attempted = ids.some((id) => (progress[id]?.seen ?? 0) > 0);
                    const color = readinessColorFn(overall, attempted, theme);
                    const mc = methodColors[m.method] ?? { tint: theme.bgPanel, accent: theme.amber };
                    const tDate = targetDates[m.id];
                    const dleft = tDate ? daysUntil(tDate) : null;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => router.push(`/module/${m.id}`)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: mc.tint,
                          borderWidth: 1,
                          borderColor: theme.border,
                          borderRadius: 10,
                          paddingVertical: 11,
                          paddingHorizontal: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: mc.accent,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontFamily: mono, fontSize: 11, fontWeight: "700", color: theme.onAccent }}>
                            {m.method}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: theme.ink }}>{m.title}</Text>
                          <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.4, color: theme.muted, marginTop: 1 }}>
                            {m.bank.total_questions} Q
                          </Text>
                        </View>
                        {dleft !== null && (
                          <View
                            style={{
                              backgroundColor: theme.amberBg,
                              borderRadius: 6,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              marginRight: 8,
                            }}
                          >
                            <Text style={{ fontFamily: mono, fontSize: 9, fontWeight: "700", color: theme.amberText }}>
                              {dleft < 0 ? "PAST" : dleft === 0 ? "TODAY" : `${dleft}d`}
                            </Text>
                          </View>
                        )}
                        <Text style={{ fontFamily: mono, fontSize: 15, fontWeight: "700", color }}>
                          {overall}
                          <Text style={{ fontSize: 9, color: attempted ? color : theme.muted }}>%</Text>
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 17, marginTop: 4 }}>
          Fundamentals are shared across schemes. Codes, acceptance criteria, and certification rules are scheme-specific.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
