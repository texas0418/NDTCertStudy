import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarPicker } from "../../components/CalendarPicker";
import { TopicTile } from "../../components/TopicTile";
import { UnitToggle } from "../../components/UnitToggle";
import { Paywall } from "../../components/Paywall";
import { PrintedPackCard } from "../../components/PrintedPackCard";
import { getBlocks, getModule, getScheme } from "../../lib/bank";
import { buildExamPlan, formatDate } from "../../lib/plan";
import { printedPackFor } from "../../lib/printed";
import { blockReadiness, useStore } from "../../lib/store";
import { mono, useReadinessColor, useTheme } from "../../lib/theme";

// eslint-disable-next-line complexity -- tracked in #1
export default function ModuleScreen() {
  const theme = useTheme();
  const readinessColor = useReadinessColor();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mod = getModule(id);
  const scheme = getScheme(mod.scheme);
  const progress = useStore((s) => s.progress);
  const bookmarks = useStore((s) => s.bookmarks);
  const exams = useStore((s) => s.exams);
  const targetDates = useStore((s) => s.targetDates);
  const setTargetDate = useStore((s) => s.setTargetDate);
  const unlocked = useStore((s) => s.unlocked).includes(mod.id);
  const [picking, setPicking] = useState(false);
  const blocks = getBlocks(mod.id);
  const pack = printedPackFor(mod.baseKey);

  const allIds = blocks.flatMap((b) => b.questions.map((q) => q.id));
  const overall = blockReadiness(progress, allIds);
  const attempted = allIds.some((id) => (progress[id]?.seen ?? 0) > 0);
  const dateISO = targetDates[mod.id];
  const plan = buildExamPlan(dateISO, allIds, progress);

  const countdown = plan
    ? plan.isPast
      ? "Test date has passed"
      : plan.isToday
        ? "Test day is today"
        : `${plan.daysLeft} ${plan.daysLeft === 1 ? "day" : "days"} to go`
    : "";

  let pace = "";
  if (plan) {
    if (plan.unseenQ === 0) pace = `You've seen all ${plan.totalQ} questions. Keep drilling your weak topics.`;
    else if (plan.isPast) pace = "Pick a new date to set a fresh pace.";
    else if (plan.isToday) pace = `${plan.unseenQ} of ${plan.totalQ} questions still unseen.`;
    else
      pace = `About ${plan.perDay} new ${plan.perDay === 1 ? "question" : "questions"} a day to cover all ${plan.totalQ} by then.`;
  }

  // Whether the module has any unit-dependent (imperial/metric) questions.
  const hasUnits = blocks.some((b) => b.questions.some((q) => q.requiresUnits));

  if (!unlocked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 21, fontWeight: "700", color: theme.ink }}>{mod.title}</Text>
            <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted, marginTop: 2 }}>
              {scheme.name} {"\u00b7"} {mod.subtitle.toUpperCase()}
            </Text>
          </View>
          <Paywall moduleId={mod.id} title={mod.title} freeKey={mod.baseKey} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <View>
            <Text style={{ fontSize: 21, fontWeight: "700", color: theme.ink }}>{mod.title}</Text>
            <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted, marginTop: 2 }}>
              {scheme.name} {"\u00b7"} {mod.subtitle.toUpperCase()} {"\u00b7"}{" "}
              <Text style={{ color: readinessColor(overall, attempted) }}>{overall}% READY</Text>
            </Text>
          </View>
          {hasUnits && <UnitToggle />}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <Pressable
            onPress={() => router.push({ pathname: "/session", params: { module: mod.id, block: "all", mode: "practice" } })}
            style={{ flex: 1, backgroundColor: theme.amber, borderRadius: 10, paddingVertical: 14, alignItems: "center" }}
          >
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: theme.onAccent }}>
              PRACTICE ALL
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: "/session", params: { module: mod.id, block: "all", mode: "exam" } })}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderColor: theme.amber,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: theme.amber }}>
              MOCK EXAM
            </Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 22 }}>
          <Pressable
            onPress={() => router.push("/bookmarks")}
            style={{
              flex: 1,
              backgroundColor: theme.bgPanel,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 14,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, color: theme.inkSoft }}>Saved</Text>
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", color: bookmarks.length ? theme.amber : theme.muted }}>
              {bookmarks.length}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/history")}
            style={{
              flex: 1,
              backgroundColor: theme.bgPanel,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 14,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, color: theme.inkSoft }}>Exams</Text>
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", color: exams.length ? theme.amber : theme.muted }}>
              {exams.length}
            </Text>
          </Pressable>
        </View>

        {/* Test-date plan */}
        <View
          style={{
            backgroundColor: theme.bgPanel,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 14,
            marginBottom: 22,
          }}
        >
          {plan ? (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.8, color: theme.muted }}>
                  TEST DATE {"\u00b7"} {formatDate(plan.dateISO)}
                </Text>
                <Pressable onPress={() => setPicking((p) => !p)} hitSlop={8}>
                  <Text style={{ fontFamily: mono, fontSize: 11, fontWeight: "700", color: theme.amber }}>
                    {picking ? "DONE" : "CHANGE"}
                  </Text>
                </Pressable>
              </View>
              <Text style={{ fontSize: 20, fontWeight: "700", color: plan.isPast ? theme.muted : theme.ink, marginTop: 6 }}>
                {countdown}
              </Text>
              <Text style={{ fontSize: 13, color: theme.inkSoft, lineHeight: 19, marginTop: 3 }}>{pace}</Text>
              {plan.isPast && !picking && (
                <Pressable
                  onPress={() => setPicking(true)}
                  style={{
                    marginTop: 12,
                    backgroundColor: theme.amber,
                    borderRadius: 9,
                    paddingVertical: 11,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: theme.onAccent }}>
                    SET A NEW DATE
                  </Text>
                </Pressable>
              )}
              <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontFamily: mono, fontSize: 16, fontWeight: "700", color: readinessColor(plan.readiness, plan.seenQ > 0) }}
                  >
                    {plan.readiness}%
                  </Text>
                  <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.6, color: theme.muted, marginTop: 2 }}>
                    READY
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: mono, fontSize: 16, fontWeight: "700", color: theme.ink }}>
                    {plan.seenQ}/{plan.totalQ}
                  </Text>
                  <Text style={{ fontFamily: mono, fontSize: 9, letterSpacing: 0.6, color: theme.muted, marginTop: 2 }}>
                    SEEN
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setTargetDate(mod.id, null);
                    setPicking(false);
                  }}
                  hitSlop={8}
                >
                  <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted }}>Clear</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            !picking && (
              <Pressable
                onPress={() => setPicking(true)}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
              >
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: theme.ink }}>Set your test date</Text>
                  <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 0.4, color: theme.muted, marginTop: 2 }}>
                    GET A DAILY TARGET TO HIT IT
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.amber }}>{"\u203A"}</Text>
              </Pressable>
            )
          )}
          {picking && (
            <View style={{ marginTop: plan ? 14 : 12 }}>
              <CalendarPicker
                value={dateISO ?? null}
                onChange={(d) => {
                  setTargetDate(mod.id, d);
                  setPicking(false);
                }}
              />
            </View>
          )}
        </View>

        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginBottom: 12 }}>
          TOPICS
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {blocks.map((b) => {
            const ids = b.questions.map((q) => q.id);
            const r = blockReadiness(progress, ids);
            const att = ids.some((id) => (progress[id]?.seen ?? 0) > 0);
            return (
              <View key={b.block} style={{ width: "48%" }}>
                <TopicTile
                  blockName={b.block}
                  readiness={r}
                  count={b.count}
                  attempted={att}
                  onPress={() =>
                    router.push({ pathname: "/session", params: { module: mod.id, block: b.block, mode: "practice" } })
                  }
                />
              </View>
            );
          })}
        </View>

        {pack && <PrintedPackCard pack={pack} moduleTitle={mod.title} />}

        <Pressable
          onPress={() => router.push("/settings")}
          style={{
            marginTop: 18,
            backgroundColor: theme.bgPanel,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: theme.inkSoft }}>Settings</Text>
          <Text style={{ fontSize: 15, color: theme.muted }}>{"\u203A"}</Text>
        </Pressable>

        <Text style={{ fontFamily: mono, fontSize: 9, color: theme.muted, marginTop: 20, letterSpacing: 0.3 }}>
          {mod.bank.total_questions} QUESTIONS {"\u00b7"} SME REVIEWED
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
