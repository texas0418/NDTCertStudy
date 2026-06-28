import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEveryQuestion } from "../lib/bank";
import { blockReadiness, useStore } from "../lib/store";
import { restorePurchases } from "../lib/purchases";
import { mono, useTheme } from "../lib/theme";
import { ThemeMode } from "../lib/types";

declare const __DEV__: boolean;

export default function Settings() {
  const theme = useTheme();
  const router = useRouter();
  const progress = useStore((s) => s.progress);
  const bookmarks = useStore((s) => s.bookmarks);
  const exams = useStore((s) => s.exams);
  const resetStudy = useStore((s) => s.resetStudy);
  const resetProgress = useStore((s) => s.resetProgress);
  const lockAll = useStore((s) => s.lockAll);
  const themeMode = useStore((s) => s.themeMode);
  const setThemeMode = useStore((s) => s.setThemeMode);

  const allIds = getEveryQuestion().map((q) => q.id);
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

  async function onRestore() {
    try {
      const n = await restorePurchases();
      Alert.alert(
        "Restore complete",
        n > 0 ? "Your purchases have been restored." : "No previous purchases were found."
      );
    } catch (e: any) {
      Alert.alert("Restore failed", e?.message ?? "Please try again.");
    }
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
          APPEARANCE
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.bgInput,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 3,
            marginBottom: 28,
          }}
        >
          {(["light", "dark", "system"] as ThemeMode[]).map((m) => {
            const active = themeMode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setThemeMode(m)}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 6,
                  alignItems: "center",
                  backgroundColor: active ? theme.amber : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: 0.5,
                    fontWeight: active ? "700" : "500",
                    color: active ? theme.onAccent : theme.muted,
                  }}
                >
                  {m === "light" ? "LIGHT" : m === "dark" ? "DARK" : "SYSTEM"}
                </Text>
              </Pressable>
            );
          })}
        </View>

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
          PURCHASES
        </Text>
        <Pressable
          onPress={onRestore}
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
            RESTORE PURCHASES
          </Text>
        </Pressable>
        <Text style={{ fontSize: 11, color: theme.muted, lineHeight: 16, marginBottom: 24 }}>
          Restores modules you have already unlocked on this Apple ID.
        </Text>
        {__DEV__ && (
          <Pressable onPress={() => lockAll()} style={{ paddingVertical: 8, marginBottom: 20 }}>
            <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted }}>dev: reset unlocks</Text>
          </Pressable>
        )}

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
          NDT CERT STUDY {"\u00b7"} {allIds.length} QUESTIONS
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
