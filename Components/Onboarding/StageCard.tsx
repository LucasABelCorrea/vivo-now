import React, { useState } from "react";
import { TaskDTO } from "../../src/types/onboardingTypes";
import { FaLock } from "react-icons/fa";
import "./Onboarding.css";

interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  task: TaskDTO[];
}

interface Props {
  step: StepDTO;
  status: "active" | "locked" | "completed";
}

const StageCard: React.FC<Props> = ({ step, status }) => {
  const [localChecklist, setLocalChecklist] = useState<TaskDTO[]>(step.task);

  const toggleItem = (taskId: number) => {
    setLocalChecklist((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const total = localChecklist.length;
  const done = localChecklist.filter((item) => item.completed).length;
  const progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="stage-wrapper">
      <div className={`stage-card ${status}`}>
        <div>
          <span className="etapa-numero">Etapa {step.orderStep}</span>
          <h3 className="etapa-titulo">{step.name}</h3>
          <p className="etapa-descricao">{step.description}</p>

          {status === "active" && (
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
                <text x="18" y="18" className="percentage">
                  {progressPercentage}%
                </text>
              </svg>
            </div>
          )}

          {status === "locked" && (
            <div className="card-bloqueado">
              <FaLock className="icone-bloqueado" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageCard;
