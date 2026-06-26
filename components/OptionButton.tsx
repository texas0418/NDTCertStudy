import React from "react";
import { Pressable, Text, View } from "react-native";
import { mono, theme } from "../lib/theme";

const LETTERS = ["A", "B", "C", "D"];

interface Props {
  index: number;
  label: string;
  answered: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  onPress: () => void;
}

export function OptionButton({ index, label, answered, isCorrect, isSelected, onPress }: Props) {
  let borderColor = theme.border;
  let bg = theme.bgPanel;
  let badgeBg = theme.bgPanelHi;
  let badgeText = theme.muted;
  let textColor = theme.inkSoft;

  if (answered) {
    if (isCorrect) {
      borderColor = theme.green;
      bg = theme.greenBg;
      badgeBg = theme.green;
      badgeText = "#06120D";
      textColor = theme.ink;
    } else if (isSelected) {
      borderColor = theme.red;
      bg = theme.redBg;
      badgeBg = theme.red;
      badgeText = "#160605";
      textColor = theme.inkSoft;
    }
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={answered}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        paddingVertical: 13,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor,
        borderRadius: 9,
        backgroundColor: bg,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 5,
          backgroundColor: badgeBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontFamily: mono, fontSize: 12, fontWeight: "700", color: badgeText }}>
          {LETTERS[index]}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: textColor, flex: 1, lineHeight: 20 }}>{label}</Text>
    </Pressable>
  );
}
