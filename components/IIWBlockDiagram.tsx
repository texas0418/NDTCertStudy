import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380, VB_H = 200;

// IIW (V1) calibration block, true 300x100 mm (3:1) proportions. The 100 mm
// radius equals the block height and is centred on the top surface at the beam
// index reference; the bottom-right corner is rounded by that arc. The probe's
// exit point sits over the centre, beam travelling one radius to the curved end.
export function IIWBlockDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;
  const dim = theme.muted, amber = theme.amber, ink = theme.ink;
  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,192 8,192" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />

        <Path d="M85,80 L295,80 A70,70 0 0 1 225,150 L85,150 Z" fill={theme.bgPanel} stroke={theme.borderHi} strokeWidth={1.2} />

        <Line x1={225} y1={80} x2={274} y2={129} stroke={amber} strokeWidth={2} />
        <Circle cx={225} cy={80} r={3} fill={amber} />

        <Polygon points="198,80 248,80 238,63 188,63" fill={theme.bgInput} stroke={theme.borderHi} strokeWidth={1} />
        <SvgText x={218} y={75} fill={theme.inkSoft} fontFamily={mono} fontSize={9} textAnchor="middle">probe</SvgText>

        <Line x1={160} y1={74} x2={223} y2={80} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />
        <SvgText x={158} y={72} fill={ink} fontFamily={mono} fontSize={10} textAnchor="end">beam index point</SvgText>
        <SvgText x={158} y={84} fill={dim} fontFamily={mono} fontSize={9} textAnchor="end">= centre of radius</SvgText>

        <Line x1={263} y1={132} x2={255} y2={166} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />
        <SvgText x={250} y={178} fill={ink} fontFamily={mono} fontSize={10} textAnchor="middle">100 mm radius</SvgText>

        <SvgText x={85} y={73} fill={dim} fontFamily={mono} fontSize={10}>IIW (V1) block</SvgText>
        <SvgText x={90} y={178} fill={dim} fontFamily={mono} fontSize={9}>{"300 \u00D7 100 mm"}</SvgText>
      </Svg>
    </View>
  );
}
