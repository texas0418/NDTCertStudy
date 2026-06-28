import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380, VB_H = 200;

// Step wedge: a staircase of known increasing thicknesses on a common base, with
// a straight-beam probe reaching the back wall. Used for thickness/range
// calibration and vertical-linearity checks. Generic (no specific dimensions).
export function StepWedgeDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;
  const dim = theme.muted, amber = theme.amber, ink = theme.ink;
  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,192 8,192" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />
        <Path
          d="M65,160 L65,138 L109,138 L109,122 L153,122 L153,106 L197,106 L197,90 L241,90 L241,74 L285,74 L285,160 Z"
          fill={theme.bgPanel}
          stroke={theme.borderHi}
          strokeWidth={1.2}
        />
        <Rect x={160} y={92} width={30} height={14} fill={theme.bgInput} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={175} y={86} fill={theme.inkSoft} fontFamily={mono} fontSize={9} textAnchor="middle">probe</SvgText>
        <Line x1={175} y1={106} x2={175} y2={160} stroke={amber} strokeWidth={2} />
        <Circle cx={175} cy={160} r={2.5} fill={amber} />
        <SvgText x={182} y={150} fill={dim} fontFamily={mono} fontSize={9}>back wall</SvgText>
        <Line x1={70} y1={176} x2={280} y2={176} stroke={dim} strokeWidth={0.75} />
        <Polygon points="280,176 273,173 273,179" fill={dim} />
        <SvgText x={150} y={172} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">increasing thickness</SvgText>
        <SvgText x={300} y={100} fill={dim} fontFamily={mono} fontSize={10}>step block</SvgText>
        <SvgText x={300} y={114} fill={dim} fontFamily={mono} fontSize={9}>known</SvgText>
        <SvgText x={300} y={126} fill={dim} fontFamily={mono} fontSize={9}>thicknesses</SvgText>
      </Svg>
    </View>
  );
}
