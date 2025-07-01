import React from "react";
import { RoadmapStage } from "../../src/types/onboardingTypes";
import StageCard from "./StageCard";
import "./Onboarding.css";

interface RoadmapProps {
  stages: RoadmapStage[];
}

const Roadmap: React.FC<RoadmapProps> = ({ stages }) => {
  return (
    <div className="roadmap">
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
};


export default Roadmap;
