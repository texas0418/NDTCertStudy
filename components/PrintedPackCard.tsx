import React from "react";
import { Pressable, Text } from "react-native";
import { PrintedPack, openPrintedPack } from "../lib/printed";
import { mono, useTheme } from "../lib/theme";

export function PrintedPackCard({ pack, moduleTitle }: { pack: PrintedPack; moduleTitle: string }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => openPrintedPack(pack)}
      accessibilityRole="link"
      accessibilityLabel={`${pack.title} on Amazon, opens in your browser`}
      style={{
        marginTop: 18,
        backgroundColor: theme.bgPanel,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
    >
      <Text style={{ fontFamily: mono, fontSize: 10, letterSpacing: 1, color: theme.muted }}>PRINTED PACK</Text>
      <Text style={{ fontSize: 13, color: theme.inkSoft, marginTop: 6 }}>
        {moduleTitle} on paper: {pack.questions} questions, every one with a worked solution, plus two mock exams.
        Opens Amazon in your browser.
      </Text>
    </Pressable>
  );
}
