import React from "react";
import { Onboarding } from "../../src/types/onboardingTypes";
import "./Onboarding.css";

interface Props {
  onboarding: Onboarding;
  journeyDays: number; // dias já percorridos
  currentLevel: number; // nível atual
}

const JourneyDays: React.FC<Props> = ({
  onboarding,
  journeyDays,
  currentLevel,
}) => {
  const dtEnd = new Date(onboarding.dt_end);
  const now = new Date();

  const diffTime = dtEnd.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="resumo">
      <p>
        Dias da jornada: <strong>{journeyDays}/90</strong>
      </p>
      <p>
        Dias restantes: <strong>{diffDays}</strong>
      </p>
      <p>
        Nível atual: <strong>{currentLevel}</strong>
      </p>
    </div>
  );
};

export default JourneyDays;
