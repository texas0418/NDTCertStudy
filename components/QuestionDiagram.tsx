import React from "react";
import { AngleBeamDiagram } from "./AngleBeamDiagram";
import { AScanDiagram } from "./AScanDiagram";
import { BeamProfileDiagram } from "./BeamProfileDiagram";
import { SnellDiagram } from "./SnellDiagram";
import { IIWBlockDiagram } from "./IIWBlockDiagram";
import { ReferenceReflectorsDiagram } from "./ReferenceReflectorsDiagram";
import { V2BlockDiagram } from "./V2BlockDiagram";
import { StepWedgeDiagram } from "./StepWedgeDiagram";
import { DiagramSpec } from "../lib/types";

// Dispatches a question's diagram spec to the right renderer.
export function QuestionDiagram({ spec }: { spec: DiagramSpec }) {
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
