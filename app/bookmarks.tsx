import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedbackBlock } from "../components/FeedbackBlock";
import { OptionButton } from "../components/OptionButton";
import { QuestionDiagram } from "../components/QuestionDiagram";
import { activeVariant, getQuestionById } from "../lib/bank";
import { shuffledVariant } from "../lib/optionOrder";
import { useStore } from "../lib/store";
import { mono, useTheme } from "../lib/theme";

export default function Bookmarks() {
  const theme = useTheme();
  const bookmarks = useStore((s) => s.bookmarks);
  const unit = useStore((s) => s.unit);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, padding: 16 }}>
        <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21 }}>
          No saved questions yet. Tap the star on any question to save it for review.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {bookmarks.map((id) => {
          const q = getQuestionById(id);
          if (!q) return null;
          const v = shuffledVariant(q.id, activeVariant(q, unit));
          const show = revealed[id];
          return (
            <View
              key={id}
              style={{
                backgroundColor: theme.bgPanel,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 9 }}>
                <Text style={{ fontFamily: mono, fontSize: 9, color: theme.muted, letterSpacing: 0.5 }}>
                  {id.toUpperCase()}
                </Text>
                <Pressable onPress={() => toggleBookmark(id)} hitSlop={8}>
                  <Text style={{ fontSize: 16, color: theme.amber }}>{"\u2605"}</Text>
                </Pressable>
              </View>
              {q.diagram && <QuestionDiagram spec={q.diagram} />}
              <Text style={{ fontSize: 14, lineHeight: 21, color: theme.ink, marginBottom: 11, fontWeight: "500" }}>
                {v.stem}
              </Text>
              <View style={{ gap: 9 }}>
                {v.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    index={i}
                    label={opt}
                    answered={show}
                    isCorrect={i === v.answer}
                    isSelected={false}
                    onPress={() => setRevealed((r) => ({ ...r, [id]: true }))}
                  />
                ))}
              </View>
              {show && <FeedbackBlock variant={v} selectedIndex={-1} />}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
