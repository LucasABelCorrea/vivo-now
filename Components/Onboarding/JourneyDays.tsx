import React from "react";
import { UserStatus } from "../../src/types/onboardingTypes";
import "./Onboarding.css";

interface Props {
  user: UserStatus;
}

const JourneyDays: React.FC<Props> = ({ user }) => {
  return (
    <div className="resumo">
      <p>
        Dias da jornada: <strong>{user.journeyDays}/90</strong>
      </p>
      <p>
        Nível atual: <strong>{user.currentLevel}</strong>
      </p>
    </div>
  );
};

export default JourneyDays;
