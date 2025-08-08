import React from "react";
import { StepDTO } from "../../src/types/onboardingTypes";
import StageCard from "./StageCard";
import "./Onboarding.css";

interface OnboardingProps {
  steps: StepDTO[];
}

const Roadmap: React.FC<OnboardingProps> = ({ steps }) => {
  return (
    <div className="roadmap">
      {steps.map((step) => (
        <StageCard key={step.id} step={step} status={"active"} />
      ))}
    </div>
  );
};

export default Roadmap;
