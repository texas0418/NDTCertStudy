import React from "react";
import { Pressable, Text, View } from "react-native";
import { useStore } from "../lib/store";
import { mono, theme } from "../lib/theme";
import { Unit } from "../lib/types";

export function UnitToggle() {
  const unit = useStore((s) => s.unit);
  const setUnit = useStore((s) => s.setUnit);
  const options: Unit[] = ["imperial", "metric"];
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.bgInput,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 2,
      }}
    >
      {options.map((opt) => {
        const active = unit === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => setUnit(opt)}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 12,
              borderRadius: 5,
              backgroundColor: active ? theme.amber : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: 0.5,
                fontWeight: active ? "700" : "500",
                color: active ? "#1A1206" : theme.muted,
              }}
            >
              {opt === "imperial" ? "IMPERIAL" : "METRIC"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
