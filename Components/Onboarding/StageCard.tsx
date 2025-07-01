import React, { useState } from "react";
import { RoadmapStage, ChecklistItem } from "../../src/types/onboardingTypes";
import "./Onboarding.css";

interface Props {
  stage: RoadmapStage;
  showChecklist?: boolean; // permite esconder a checklist
}

const StageCard: React.FC<Props> = ({ stage, showChecklist = true }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(stage.checklist);

  const toggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const progressPercentage = Math.round(stage.progress * 100);

  return (
    <div className="stage-wrapper">
      <div className={`stage-card ${stage.status}`}>
        <span className="etapa-numero">Etapa {stage.id}</span>
        <h3 className="etapa-titulo">{stage.title}</h3>

        <div className="etapa-progresso">
          <svg viewBox="0 0 36 36" className="progress-circle">
            <path
              className="bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress"
              strokeDasharray={`${progressPercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">
              {progressPercentage}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StageCard;
