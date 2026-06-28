import React from "react";
import { View } from "react-native";
import { AngleBeamDiagram } from "./AngleBeamDiagram";
import { AScanDiagram } from "./AScanDiagram";
import { BeamProfileDiagram } from "./BeamProfileDiagram";
import { SnellDiagram } from "./SnellDiagram";
import { IIWBlockDiagram } from "./IIWBlockDiagram";
import { ReferenceReflectorsDiagram } from "./ReferenceReflectorsDiagram";
import { V2BlockDiagram } from "./V2BlockDiagram";
import { StepWedgeDiagram } from "./StepWedgeDiagram";
import { lightTheme } from "../lib/theme";
import { DiagramSpec } from "../lib/types";

function render(spec: DiagramSpec) {
  switch (spec.type) {
    case "angle_beam":
      return <AngleBeamDiagram angle={spec.angle} thickness={spec.thickness} />;
    case "a_scan":
      return <AScanDiagram />;
    case "beam_profile":
      return <BeamProfileDiagram />;
    case "snell":
      return <SnellDiagram />;
    case "iiw_block":
      return <IIWBlockDiagram />;
    case "reference_reflectors":
      return <ReferenceReflectorsDiagram />;
    case "v2_block":
      return <V2BlockDiagram />;
    case "step_wedge":
      return <StepWedgeDiagram />;
    default:
      return null;
  }
}

// Dispatches a question's diagram spec to the right renderer. The figure always
// sits on a light inset (dark ink on light) so it stays legible in dark mode.
export function QuestionDiagram({ spec }: { spec: DiagramSpec }) {
  const el = render(spec);
  if (!el) return null;
  return (
    <View
      style={{
        backgroundColor: lightTheme.bgPanelHi,
        borderWidth: 1,
        borderColor: lightTheme.border,
        borderRadius: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        marginBottom: 14,
      }}
    >
      {el}
    </View>
  );
}
