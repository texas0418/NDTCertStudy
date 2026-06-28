import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedbackBlock } from "../components/FeedbackBlock";
import { OptionButton } from "../components/OptionButton";
import { QuestionDiagram } from "../components/QuestionDiagram";
import { ProgressBar } from "../components/ProgressBar";
import { activeVariant, getQuestionById } from "../lib/bank";
import { shuffledVariant } from "../lib/optionOrder";
import { useStore } from "../lib/store";
import { mono, useTheme } from "../lib/theme";

export default function Review() {
  const theme = useTheme();
  const router = useRouter();
  const { exam } = useLocalSearchParams<{ exam?: string }>();
  const unit = useStore((s) => s.unit);
  const exams = useStore((s) => s.exams);
  const rec = (exam ? exams.find((e) => e.id === exam) : undefined) ?? exams[0];
  const missed = rec?.missed ?? [];
  const [idx, setIdx] = useState(0);

  if (missed.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.muted, fontSize: 14 }}>Nothing to review. You missed none.</Text>
      </SafeAreaView>
    );
  }

  const miss = missed[idx];
  const q = getQuestionById(miss.id);
  const isLast = idx === missed.length - 1;

  if (!q) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.muted }}>Question not found.</Text>
      </SafeAreaView>
    );
  }

  const av = activeVariant(q, unit);
  const v = shuffledVariant(q.id, av);
  // map the stored canonical pick back to its display position
  const displayPick =
    miss.picked == null ? -1 : v.options.indexOf(av.options[miss.picked]);
  const skipped = miss.picked == null;

  function next() {
    if (isLast) {
      router.back();
      return;
    }
    setIdx((i) => i + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontFamily: mono, fontSize: 10, fontWeight: "700", letterSpacing: 1, color: theme.amberText }}>
            REVIEW {"\u00b7"} MISSED
          </Text>
          <Text style={{ fontFamily: mono, fontSize: 11, color: theme.muted }}>
            {idx + 1}/{missed.length}
          </Text>
        </View>
        <ProgressBar value={(idx + 1) / missed.length} color={theme.red} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {skipped && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: theme.amberBg,
              borderWidth: 1,
              borderColor: theme.amberDim,
              borderRadius: 6,
              paddingVertical: 3,
              paddingHorizontal: 9,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontFamily: mono, fontSize: 10, fontWeight: "700", letterSpacing: 0.8, color: theme.amberText }}>
              SKIPPED
            </Text>
          </View>
        )}

        {q.diagram && <QuestionDiagram spec={q.diagram} />}

        <Text style={{ fontSize: 16, lineHeight: 23, color: theme.ink, marginBottom: 18, fontWeight: "500" }}>
          {v.stem}
        </Text>

        <View style={{ gap: 9 }}>
          {v.options.map((opt, i) => (
            <OptionButton
              key={i}
              index={i}
              label={opt}
              answered={true}
              isCorrect={i === v.answer}
              isSelected={i === displayPick}
              onPress={() => {}}
            />
          ))}
        </View>

        <FeedbackBlock variant={v} selectedIndex={displayPick} />
      </ScrollView>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          onPress={next}
          style={{ backgroundColor: theme.amber, borderRadius: 10, paddingVertical: 13, paddingHorizontal: 30 }}
        >
          <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", letterSpacing: 0.5, color: theme.onAccent }}>
            {isLast ? "DONE" : "NEXT \u2192"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
