import React from "react";
import { View } from "react-native";
import { theme } from "../lib/theme";

export function ProgressBar({ value, color = theme.amber }: { value: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height: 4, backgroundColor: theme.track, borderRadius: 2, overflow: "hidden" }}>
      <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: color }} />
    </View>
  );
}
