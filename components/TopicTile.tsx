import React from "react";
import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { blockLabels, mono, readinessColor, theme } from "../lib/theme";

interface Props {
  blockName: string;
  readiness: number; // 0-100
  count: number;
  attempted: boolean;
  onPress: () => void;
}

export function TopicTile({ blockName, readiness, count, attempted, onPress }: Props) {
  const color = readinessColor(readiness, attempted);
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: theme.bgPanel,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 11,
        padding: 13,
        minHeight: 104,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
        <Text style={{ fontFamily: mono, fontSize: 24, fontWeight: "700", color }}>
          {readiness}
          <Text style={{ fontSize: 13, color: attempted ? color : theme.muted }}>%</Text>
        </Text>
        {!attempted && (
          <Text style={{ fontFamily: mono, fontSize: 8, letterSpacing: 0.8, color: theme.muted }}>NEW</Text>
        )}
      </View>
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        <ProgressBar value={readiness / 100} color={color} />
      </View>
      <View>
        <Text style={{ fontSize: 13, color: theme.ink, fontWeight: "600" }} numberOfLines={2}>
          {blockLabels[blockName] ?? blockName}
        </Text>
        <Text style={{ fontFamily: mono, fontSize: 10, color: theme.muted, marginTop: 3, letterSpacing: 0.3 }}>
          {count} Q
        </Text>
      </View>
    </Pressable>
  );
}
