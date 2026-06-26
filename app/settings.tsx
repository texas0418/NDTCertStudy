import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bank, getAllQuestions } from "../lib/bank";
import { blockReadiness, useStore } from "../lib/store";
import { mono, theme } from "../lib/theme";

export default function Settings() {
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  const bookmarks = useStore((s) => s.bookmarks);
  const exams = useStore((s) => s.exams);
  const resetStudy = useStore((s) => s.resetStudy);
  const resetProgress = useStore((s) => s.resetProgress);

  const allIds = getAllQuestions().map((q) => q.id);
  const seenCount = allIds.filter((id) => (progress[id]?.seen ?? 0) > 0).length;
  const overall = blockReadiness(progress, allIds);

  function confirmResetStudy() {
    Alert.alert(
      "Reset study & exams?",
      "This clears your progress, readiness, and exam history. Saved questions are kept. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetStudy() },
      ]
    );
  }

  function confirmResetAll() {
    Alert.alert(
      "Reset everything?",
      "This clears progress, exam history, reports, and saved questions. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset all", style: "destructive", onPress: () => resetProgress() },
      ]
    );
  }

  function Row({ k, v }: { k: string; v: string }) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 }}>
        <Text style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.5, color: theme.muted }}>{k}</Text>
        <Text style={{ fontFamily: mono, fontSize: 12, color: theme.ink }}>{v}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginBottom: 10 }}>
          YOUR DATA
        </Text>
        <View
          style={{
            backgroundColor: theme.bgPanel,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 11,
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginBottom: 28,
          }}
        >
          <Row k="OVERALL READY" v={`${overall}%`} />
          <Row k="QUESTIONS SEEN" v={`${seenCount} / ${allIds.length}`} />
          <Row k="SAVED QUESTIONS" v={String(bookmarks.length)} />
          <Row k="EXAMS TAKEN" v={String(exams.length)} />
        </View>

        <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted, marginBottom: 10 }}>
          RESET
        </Text>

        <Pressable
          onPress={confirmResetStudy}
          style={{
            borderWidth: 1.5,
            borderColor: theme.amber,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: theme.amber }}>
            RESET STUDY & EXAMS
          </Text>
        </Pressable>
        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 16, marginBottom: 24 }}>
          Clears progress, readiness, and exam history. Keeps your saved questions.
        </Text>

        <Pressable
          onPress={confirmResetAll}
          style={{
            borderWidth: 1.5,
            borderColor: theme.red,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, color: theme.redText }}>
            RESET EVERYTHING
          </Text>
        </Pressable>
        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 16, marginBottom: 24 }}>
          Clears everything including saved questions. The question bank itself is never affected.
        </Text>

        <Text style={{ fontFamily: mono, fontSize: 9, color: theme.muted, marginTop: 8, letterSpacing: 0.3 }}>
          {bank.bank.toUpperCase()} {"\u00b7"} {bank.total_questions} QUESTIONS
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
