import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380;
const VB_H = 185;

// Static beam-profile reference: a straight-beam probe of diameter D, the near
// field converging to a natural focus at length N, then the far field diverging
// at the beam-spread half-angle. Generic, so no computed values are shown.
export function BeamProfileDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;

  const dim = theme.muted;
  const amber = theme.amber;
  const amberT = theme.amberText;
  const ink = theme.ink;

  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,177 8,177" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />

        <Polygon points="54,75 175,105 54,135" fill={amber} fillOpacity={0.13} />
        <Polygon points="175,105 345,68 345,142" fill={amber} fillOpacity={0.1} />

        <Line x1={54} y1={105} x2={350} y2={105} stroke={dim} strokeWidth={0.5} strokeDasharray="4,3" />
        <Line x1={175} y1={68} x2={175} y2={142} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />

        <Line x1={54} y1={75} x2={175} y2={105} stroke={amber} strokeWidth={1.5} />
        <Line x1={54} y1={135} x2={175} y2={105} stroke={amber} strokeWidth={1.5} />
        <Line x1={175} y1={105} x2={345} y2={68} stroke={amber} strokeWidth={1.5} />
        <Line x1={175} y1={105} x2={345} y2={142} stroke={amber} strokeWidth={1.5} />
        <Circle cx={175} cy={105} r={3} fill={amber} />

        <Rect x={46} y={75} width={8} height={60} fill={theme.bgInput} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={50} y={70} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">probe</SvgText>

        <Line x1={38} y1={75} x2={38} y2={135} stroke={dim} strokeWidth={0.75} />
        <Line x1={35} y1={75} x2={41} y2={75} stroke={dim} strokeWidth={0.75} />
        <Line x1={35} y1={135} x2={41} y2={135} stroke={dim} strokeWidth={0.75} />
        <SvgText x={32} y={108} fill={ink} fontFamily={mono} fontSize={11} textAnchor="end">D</SvgText>

        <Path d="M 213 105 A 38 38 0 0 0 212 97" fill="none" stroke={amber} strokeWidth={1} />
        <SvgText x={220} y={95} fill={amberT} fontFamily={mono} fontSize={11}>{"\u03B8/2"}</SvgText>

        <SvgText x={182} y={120} fill={dim} fontFamily={mono} fontSize={9}>focus</SvgText>

        <Line x1={54} y1={160} x2={175} y2={160} stroke={dim} strokeWidth={0.75} />
        <Line x1={54} y1={157} x2={54} y2={163} stroke={dim} strokeWidth={0.75} />
        <Line x1={175} y1={157} x2={175} y2={163} stroke={dim} strokeWidth={0.75} />
        <SvgText x={114} y={154} fill={ink} fontFamily={mono} fontSize={11} textAnchor="middle">near field (N)</SvgText>

        <Line x1={175} y1={160} x2={345} y2={160} stroke={dim} strokeWidth={0.75} />
        <Line x1={345} y1={157} x2={345} y2={163} stroke={dim} strokeWidth={0.75} />
        <SvgText x={260} y={154} fill={ink} fontFamily={mono} fontSize={11} textAnchor="middle">far field</SvgText>
      </Svg>
    </View>
  );
}
