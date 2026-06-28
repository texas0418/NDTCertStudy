import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380, VB_H = 200;

// Static Snell's-law reference: incident, reflected, and refracted rays at an
// interface, with both angles marked. Generic (no values), serves refraction,
// critical-angle, and mode-conversion questions.
export function SnellDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;
  const dim = theme.muted, amber = theme.amber, amberT = theme.amberText, green = theme.green, ink = theme.ink;
  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,192 8,192" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />
        <Rect x={40} y={110} width={305} height={72} fill={theme.bgPanel} />
        <Line x1={40} y1={110} x2={345} y2={110} stroke={theme.borderHi} strokeWidth={1.5} />
        <Line x1={150} y1={44} x2={150} y2={178} stroke={green} strokeWidth={1} strokeDasharray="4,3" />
        <Line x1={103} y1={43} x2={150} y2={110} stroke={amber} strokeWidth={2} />
        <Line x1={150} y1={110} x2={197} y2={43} stroke={dim} strokeWidth={1.5} strokeDasharray="5,3" />
        <Line x1={150} y1={110} x2={218} y2={158} stroke={amber} strokeWidth={2} />
        <Circle cx={150} cy={110} r={3} fill={amber} />
        <Path d="M 150 84 A 26 26 0 0 0 135 89" fill="none" stroke={amber} strokeWidth={1} />
        <SvgText x={128} y={84} fill={amberT} fontFamily={mono} fontSize={11} textAnchor="end">{"\u03B8\u2081"}</SvgText>
        <Path d="M 150 136 A 26 26 0 0 0 171 125" fill="none" stroke={amber} strokeWidth={1} />
        <SvgText x={176} y={140} fill={amberT} fontFamily={mono} fontSize={11}>{"\u03B8\u2082"}</SvgText>
        <SvgText x={156} y={50} fill={dim} fontFamily={mono} fontSize={10}>normal</SvgText>
        <SvgText x={92} y={64} fill={ink} fontFamily={mono} fontSize={10} textAnchor="end">incident</SvgText>
        <SvgText x={205} y={58} fill={dim} fontFamily={mono} fontSize={10}>reflected</SvgText>
        <SvgText x={210} y={150} fill={ink} fontFamily={mono} fontSize={10}>refracted</SvgText>
        <SvgText x={46} y={102} fill={dim} fontFamily={mono} fontSize={10}>medium 1</SvgText>
        <SvgText x={46} y={128} fill={dim} fontFamily={mono} fontSize={10}>medium 2 (faster)</SvgText>
        <SvgText x={338} y={104} fill={dim} fontFamily={mono} fontSize={9} textAnchor="end">interface</SvgText>
      </Svg>
    </View>
  );
}
