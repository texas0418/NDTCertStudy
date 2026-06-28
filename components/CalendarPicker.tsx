import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { mono, useTheme } from "../lib/theme";

const WD = ["S", "M", "T", "W", "T", "F", "S"];
const MN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Self-contained month grid. Past days are disabled. Emits "YYYY-MM-DD".
export function CalendarPicker({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (iso: string) => void;
}) {
  const theme = useTheme();
  const today = new Date();
  const floor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const parts = value ? value.split("-").map(Number) : null;

  const [vy, setVy] = useState(parts ? parts[0] : today.getFullYear());
  const [vm, setVm] = useState(parts ? parts[1] - 1 : today.getMonth());

  const firstWeekday = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const atMinMonth = vy === today.getFullYear() && vm === today.getMonth();

  function shift(delta: number) {
    let nm = vm + delta;
    let ny = vy;
    if (nm < 0) {
      nm = 11;
      ny -= 1;
    } else if (nm > 11) {
      nm = 0;
      ny += 1;
    }
    setVm(nm);
    setVy(ny);
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Pressable onPress={() => !atMinMonth && shift(-1)} hitSlop={10} disabled={atMinMonth}>
          <Text style={{ fontSize: 22, color: atMinMonth ? theme.border : theme.amber, width: 30, textAlign: "center" }}>
            {"\u2039"}
          </Text>
        </Pressable>
        <Text style={{ fontFamily: mono, fontSize: 13, fontWeight: "700", color: theme.ink }}>
          {MN[vm]} {vy}
        </Text>
        <Pressable onPress={() => shift(1)} hitSlop={10}>
          <Text style={{ fontSize: 22, color: theme.amber, width: 30, textAlign: "center" }}>{"\u203A"}</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row" }}>
        {WD.map((w, i) => (
          <Text
            key={i}
            style={{ flex: 1, textAlign: "center", fontFamily: mono, fontSize: 9, color: theme.muted, marginBottom: 6 }}
          >
            {w}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((d, i) => {
          if (d === null) return <View key={i} style={{ width: `${100 / 7}%`, height: 38 }} />;
          const past = new Date(vy, vm, d) < floor;
          const selected = value === iso(vy, vm, d);
          return (
            <Pressable
              key={i}
              disabled={past}
              onPress={() => onChange(iso(vy, vm, d))}
              style={{ width: `${100 / 7}%`, height: 38, alignItems: "center", justifyContent: "center" }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selected ? theme.amber : "transparent",
                }}
              >
                <Text style={{ fontSize: 13, color: selected ? theme.onAccent : past ? theme.border : theme.ink }}>
                  {d}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
