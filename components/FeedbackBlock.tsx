import React from "react";
import { Text, View } from "react-native";
import { mono, useTheme } from "../lib/theme";
import { Variant } from "../lib/types";

const LETTERS = ["A", "B", "C", "D"];

export function FeedbackBlock({ variant, selectedIndex }: { variant: Variant; selectedIndex: number }) {
  const theme = useTheme();
  const correctLetter = LETTERS[variant.answer];
  const gotItRight = selectedIndex === variant.answer;
  return (
    <View style={{ marginTop: 18 }}>
      {/* Result + explanation panel */}
      <View
        style={{
          backgroundColor: theme.bgPanel,
          borderWidth: 1,
          borderColor: theme.border,
          borderLeftWidth: 3,
          borderLeftColor: gotItRight ? theme.green : theme.amber,
          borderRadius: 9,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: mono,
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1,
            color: gotItRight ? theme.greenText : theme.amberText,
            marginBottom: 7,
          }}
        >
          {gotItRight ? `CORRECT \u00b7 ${correctLetter}` : `ANSWER \u00b7 ${correctLetter}`}
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 20, color: theme.ink }}>{variant.explanation}</Text>
      </View>

      <Text
        style={{
          fontFamily: mono,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1,
          color: theme.muted,
          marginBottom: 9,
        }}
      >
        WHY THE OTHERS MISS
      </Text>
      <View style={{ gap: 8 }}>
        {variant.distractors.map((note, i) => {
          if (!note) return null;
          const isUserPick = i === selectedIndex && i !== variant.answer;
          return (
            <View key={i} style={{ flexDirection: "row", gap: 9 }}>
              <Text
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  fontWeight: "700",
                  color: isUserPick ? theme.redText : theme.muted,
                  marginTop: 1,
                }}
              >
                {LETTERS[i]}
              </Text>
              <Text style={{ fontSize: 12, lineHeight: 18, color: isUserPick ? theme.redText : theme.muted, flex: 1 }}>
                {isUserPick ? "Your pick. " + note : note}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
