import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Circle, Line, Polygon, Polyline, Text as SvgText } from "react-native-svg";
import { mono, theme } from "../lib/theme";

const VB_W = 380;
const VB_H = 250;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Static reference geometry for an angle-beam (shear-wave) probe.
// Drawn at the true refracted angle; parts are named but never given numeric
// values, so the same diagram is safe to show on questions that ask for them.
export function AngleBeamDiagram({ angle, thickness }: { angle: number; thickness?: string }) {
  const W = Dimensions.get("window").width - 32;
  const H = (W * VB_H) / VB_W;

  const rad = (angle * Math.PI) / 180;
  const tan = Math.tan(rad);
  const ySurf = 138;

  const Tpx = Math.min(70, 285 / (2 * tan));
  const backY = ySurf + Tpx;
  const fullSpan = 2 * Tpx * tan;
  const halfSpan = Tpx * tan;

  const xStart = clamp(40 + (312 - fullSpan) / 2, 48, 280);
  const bounceX = xStart + halfSpan;
  const returnX = xStart + fullSpan;

  const amber = theme.amber;
  const amberT = theme.amberText;
  const green = theme.green;
  const greenT = theme.greenText;
  const muted = theme.muted;
  const ink = theme.ink;
  const dim = "#79828D";

  const leg1Mid = { x: (xStart + bounceX) / 2, y: (ySurf + backY) / 2 };
  const leg2Mid = { x: (bounceX + returnX) / 2, y: (ySurf + backY) / 2 };

  const arcR = 26;
  const arcStart = `${xStart} ${ySurf + arcR}`;
  const arcEnd = `${xStart + arcR * Math.sin(rad)} ${ySurf + arcR * Math.cos(rad)}`;

  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        {/* panel */}
        <Line x1="0" y1="0" x2="0" y2="0" />
        <Polygon points={`8,8 372,8 372,242 8,242`} fill={theme.bgPanel} stroke={theme.border} strokeWidth={1} />

        {/* material */}
        <Polygon points={`40,${ySurf} 352,${ySurf} 352,${backY} 40,${backY}`} fill="#232A33" />
        <Line x1={40} y1={ySurf} x2={352} y2={ySurf} stroke="#3A4350" strokeWidth={1.5} />
        <Line x1={40} y1={backY} x2={352} y2={backY} stroke="#3A4350" strokeWidth={1.5} />

        {/* leaders */}
        <Line x1={xStart} y1={104} x2={xStart} y2={ySurf} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />
        <Line x1={bounceX} y1={122} x2={bounceX} y2={backY} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />
        <Line x1={returnX} y1={104} x2={returnX} y2={ySurf} stroke={dim} strokeWidth={0.5} strokeDasharray="3,3" />

        {/* full skip dim */}
        <Line x1={xStart} y1={104} x2={returnX} y2={104} stroke={dim} strokeWidth={0.75} />
        <Line x1={xStart} y1={101} x2={xStart} y2={107} stroke={dim} strokeWidth={0.75} />
        <Line x1={returnX} y1={101} x2={returnX} y2={107} stroke={dim} strokeWidth={0.75} />
        <SvgText x={(xStart + returnX) / 2} y={99} fill={ink} fontFamily={mono} fontSize={11} textAnchor="middle">full skip</SvgText>

        {/* half skip dim */}
        <Line x1={xStart} y1={122} x2={bounceX} y2={122} stroke={dim} strokeWidth={0.75} />
        <Line x1={xStart} y1={119} x2={xStart} y2={125} stroke={dim} strokeWidth={0.75} />
        <Line x1={bounceX} y1={119} x2={bounceX} y2={125} stroke={dim} strokeWidth={0.75} />
        <SvgText x={(xStart + bounceX) / 2} y={117} fill={ink} fontFamily={mono} fontSize={11} textAnchor="middle">half skip</SvgText>

        {/* probe wedge */}
        <Polygon
          points={`${xStart - 25},${ySurf} ${xStart + 29},${ySurf} ${xStart + 17},${ySurf - 21} ${xStart - 37},${ySurf - 21}`}
          fill="#2E3640"
          stroke="#3A4350"
          strokeWidth={1}
        />
        <SvgText x={xStart - 11} y={ySurf - 7} fill={theme.inkSoft} fontFamily={mono} fontSize={10} textAnchor="middle">probe</SvgText>

        {/* normal + refracted angle */}
        <Line x1={xStart} y1={ySurf - 10} x2={xStart} y2={ySurf + 34} stroke={green} strokeWidth={1} strokeDasharray="4,3" />
        <Polyline points={`${arcStart} ${arcEnd}`} fill="none" stroke={green} strokeWidth={1} />
        <SvgText x={xStart + 6} y={ySurf + 50} fill={greenT} fontFamily={mono} fontSize={12}>{`\u03B8 = ${angle}\u00B0`}</SvgText>

        {/* beam */}
        <Polyline
          points={`${xStart},${ySurf} ${bounceX},${backY} ${returnX},${ySurf}`}
          fill="none"
          stroke={amber}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <Circle cx={xStart} cy={ySurf} r={3} fill={amber} />
        <Circle cx={bounceX} cy={backY} r={3.5} fill={amber} />
        <Circle cx={returnX} cy={ySurf} r={3.5} fill={amber} />

        {/* leg labels */}
        <SvgText x={leg1Mid.x - 8} y={leg1Mid.y} fill={amberT} fontFamily={mono} fontSize={11} textAnchor="end">leg 1</SvgText>
        <SvgText x={leg2Mid.x + 8} y={leg2Mid.y} fill={amberT} fontFamily={mono} fontSize={11}>leg 2</SvgText>

        {/* thickness dim */}
        <Line x1={356} y1={ySurf} x2={356} y2={backY} stroke={dim} strokeWidth={0.75} />
        <Line x1={353} y1={ySurf} x2={359} y2={ySurf} stroke={dim} strokeWidth={0.75} />
        <Line x1={353} y1={backY} x2={359} y2={backY} stroke={dim} strokeWidth={0.75} />
        <SvgText x={349} y={(ySurf + backY) / 2 + 4} fill={ink} fontFamily={mono} fontSize={11} textAnchor="end">
          {thickness ? `T = ${thickness}` : "T"}
        </SvgText>

        {/* part labels */}
        <SvgText x={xStart + 1} y={ySurf + 15} fill={muted} fontFamily={mono} fontSize={10}>exit point</SvgText>
        <SvgText x={44} y={backY + 15} fill={muted} fontFamily={mono} fontSize={10}>back wall</SvgText>
        <SvgText x={bounceX} y={backY + 15} fill={muted} fontFamily={mono} fontSize={10} textAnchor="middle">bounce</SvgText>
      </Svg>
    </View>
  );
}
