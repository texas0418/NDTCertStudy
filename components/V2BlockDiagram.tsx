import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380, VB_H = 200;

// V2 (IIW type 2) miniature block. Outline traced from a real block: horizontal
// top scanning edge with the index + 35-65 deg scale, a curved right side down to
// the bottom point, a straight lower-left diagonal carrying the 65-75 deg scale,
// and a curve into the top-left corner. Probe index over the "0", separate angle
// hole centre-left, 25 & 50 mm reference radii.
export function V2BlockDiagram() {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;
  const dim = "#79828D", amber = theme.amber, amberT = theme.amberText, ink = theme.inkSoft;
  const tick = (x: number) => <Line key={x} x1={x} y1={58} x2={x} y2={63} stroke={dim} strokeWidth={0.6} />;
  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Polygon points="8,8 372,8 372,192 8,192" fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />

        <Path
          d="M81.5,58 L298.5,58 C298.5,58 301.1,92.3 286.8,120.4 C272.4,148.5 232.6,182 232.6,182 L127.2,125.8 C127.2,125.8 78.3,106.2 81.5,58 Z"
          fill="#232A33"
          stroke="#3A4350"
          strokeWidth={1.2}
        />

        <G>{[102, 112, 122, 132, 142, 180, 202, 224, 246, 268, 288].map(tick)}</G>
        <SvgText x={151} y={74} fill={ink} fontFamily={mono} fontSize={9} textAnchor="middle">{"0\u00B0"}</SvgText>
        <SvgText x={202} y={74} fill={dim} fontFamily={mono} fontSize={8} textAnchor="middle">{"35\u00B0"}</SvgText>
        <SvgText x={246} y={74} fill={dim} fontFamily={mono} fontSize={8} textAnchor="middle">{"50\u00B0"}</SvgText>
        <SvgText x={288} y={74} fill={dim} fontFamily={mono} fontSize={8} textAnchor="middle">{"65\u00B0"}</SvgText>

        <Line x1={150} y1={57} x2={205} y2={160} stroke={amber} strokeWidth={2} />
        <Circle cx={205} cy={160} r={2.5} fill={amber} />
        <Circle cx={150} cy={57} r={2.8} fill={amber} />
        <Polygon points="120,57 178,57 170,41 112,41" fill="#2E3640" stroke="#3A4350" strokeWidth={1} />
        <SvgText x={145} y={52} fill={ink} fontFamily={mono} fontSize={9} textAnchor="middle">probe</SvgText>

        <Circle cx={150} cy={107} r={3.3} fill={theme.bg} stroke="#3A4350" strokeWidth={1} />
        <Line x1={142} y1={124} x2={148} y2={110} stroke={dim} strokeWidth={0.6} />
        <SvgText x={138} y={130} fill={ink} fontFamily={mono} fontSize={8} textAnchor="middle">{"0\u00B0"}</SvgText>

        <G stroke={dim} strokeWidth={0.6}>
          <Line x1={214} y1={168} x2={208} y2={174} />
          <Line x1={195} y1={157} x2={189} y2={163} />
          <Line x1={177} y1={147} x2={171} y2={153} />
        </G>
        <SvgText x={220} y={172} fill={dim} fontFamily={mono} fontSize={8}>{"75\u00B0"}</SvgText>
        <SvgText x={200} y={161} fill={dim} fontFamily={mono} fontSize={8}>{"70\u00B0"}</SvgText>
        <SvgText x={182} y={151} fill={dim} fontFamily={mono} fontSize={8}>{"65\u00B0"}</SvgText>

        <SvgText x={214} y={100} fill={dim} fontFamily={mono} fontSize={9}>IIW V2 BLOCK</SvgText>
        <SvgText x={214} y={114} fill={dim} fontFamily={mono} fontSize={9}>CS / 12.5 mm</SvgText>
        <SvgText x={214} y={131} fill={amberT} fontFamily={mono} fontSize={9}>{"25 & 50 mm radii"}</SvgText>
      </Svg>
    </View>
  );
}
