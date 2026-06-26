import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopicTile } from "../../components/TopicTile";
import { UnitToggle } from "../../components/UnitToggle";
import { getBlocks, getModule } from "../../lib/bank";
import { blockReadiness, useStore } from "../../lib/store";
import { mono, readinessColor, theme } from "../../lib/theme";

export default function ModuleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mod = getModule(id);
  const progress = useStore((s) => s.progress);
  const bookmarks = useStore((s) => s.bookmarks);
  const exams = useStore((s) => s.exams);
  const blocks = getBlocks(mod.id);

  const allIds = blocks.flatMap((b) => b.questions.map((q) => q.id));
  const overall = blockReadiness(progress, allIds);
  const attempted = allIds.some((id) => (progress[id]?.seen ?? 0) > 0);

  // Whether the module has any unit-dependent (imperial/metric) questions.
  const hasUnits = blocks.some((b) => b.questions.some((q) => q.requiresUnits));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <View>
            <Text style={{ fontSize: 21, fontWeight: "700", color: theme.ink }}>{mod.title}</Text>
            <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted, marginTop: 2 }}>
              {mod.subtitle.toUpperCase()} {"\u00b7"}{" "}
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
            <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: "#1A1206" }}>
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
