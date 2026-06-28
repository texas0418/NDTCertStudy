import React from "react";
import { View } from "react-native";
import { useTheme } from "../lib/theme";

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  const fill = color ?? theme.amber;
  return (
    <View style={{ height: 4, backgroundColor: theme.track, borderRadius: 2, overflow: "hidden" }}>
      <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: fill }} />
    </View>
  );
}
