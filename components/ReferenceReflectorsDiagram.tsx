import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380, VB_H = 200;

// Static reference-reflectors cross-section: side-drilled hole, flat-bottom
// hole, and surface notch. Serves SDH / FBH / notch reflector questions.
export function ReferenceReflectorsDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;
  const dim = theme.muted, ink = theme.ink;
  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,192 8,192" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />
        <SvgText x={44} y={60} fill={dim} fontFamily={mono} fontSize={10}>reference reflectors</SvgText>
        <Rect x={40} y={66} width={305} height={84} fill={theme.bgPanel} stroke={theme.borderHi} strokeWidth={1.2} />
        <Circle cx={95} cy={112} r={7} fill={theme.bgPanel} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={95} y={94} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">SDH</SvgText>
        <Rect x={198} y={104} width={8} height={46} fill={theme.bgPanel} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={202} y={98} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">FBH</SvgText>
        <Rect x={288} y={66} width={8} height={16} fill={theme.bgPanel} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={304} y={78} fill={ink} fontFamily={mono} fontSize={10}>notch</SvgText>
        <SvgText x={192} y={180} fill={dim} fontFamily={mono} fontSize={9} textAnchor="middle">
          SDH side-drilled    FBH flat-bottom    notch surface-breaking
        </SvgText>
      </Svg>
    </View>
  );
}
