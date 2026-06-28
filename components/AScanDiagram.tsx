import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Polygon, Polyline, Rect, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380;
const VB_H = 230;

// Static A-scan display reference: initial pulse, an indication, and the
// back-wall echo on a percent-screen-height grid. Generic on purpose so it
// attaches to any screen-trace question without showing a specific answer.
export function AScanDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;

  const dim = theme.muted;
  const grid = theme.border;
  const axis = theme.borderHi;
  const trace = theme.green;
  const amber = theme.amber;
  const amberT = theme.amberText;
  const ink = theme.ink;

  const pctY = [
    { p: "0", y: 180 },
    { p: "20", y: 152 },
    { p: "40", y: 124 },
    { p: "60", y: 96 },
    { p: "80", y: 68 },
    { p: "100", y: 40 },
  ];

  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,222 8,222" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />
        <Rect x={50} y={40} width={306} height={140} fill={theme.bg} stroke={grid} strokeWidth={1} />

        {pctY.map((t) => (
          <Line key={t.p} x1={50} y1={t.y} x2={356} y2={t.y} stroke={grid} strokeWidth={0.5} strokeDasharray="3,3" />
        ))}

        <Line x1={50} y1={40} x2={50} y2={180} stroke={axis} strokeWidth={1.5} />
        <Line x1={50} y1={180} x2={356} y2={180} stroke={axis} strokeWidth={1.5} />

        {pctY.map((t) => (
          <SvgText key={t.p} x={44} y={t.y + 3} fill={dim} fontFamily={mono} fontSize={9} textAnchor="end">
            {t.p}
          </SvgText>
        ))}
        <SvgText x={50} y={30} fill={dim} fontFamily={mono} fontSize={10}>% screen height</SvgText>

        <Polyline
          points="50,180 54,180 56,40 60,180 176,180 180,96 184,180 296,180 300,68 304,180 356,180"
          fill="none"
          stroke={trace}
          strokeWidth={2}
        />
        <Polyline points="176,180 180,96 184,180" fill="none" stroke={amber} strokeWidth={2} />
        <Circle cx={180} cy={96} r={3} fill={amber} />

        <SvgText x={60} y={46} fill={ink} fontFamily={mono} fontSize={10}>initial pulse</SvgText>
        <SvgText x={180} y={88} fill={amberT} fontFamily={mono} fontSize={10} textAnchor="middle">indication</SvgText>
        <SvgText x={300} y={60} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">back-wall echo</SvgText>

        <SvgText x={203} y={200} fill={dim} fontFamily={mono} fontSize={10} textAnchor="middle">distance / time</SvgText>
      </Svg>
    </View>
  );
}
