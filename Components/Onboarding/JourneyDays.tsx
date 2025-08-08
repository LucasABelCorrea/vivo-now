// JourneyDays.tsx
import React from "react";
import { Onboarding } from "../../src/types/onboardingTypes";
import "./Onboarding.css";

interface Props {
  onboarding: Onboarding;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const parseDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  // se já for string ISO ou "YYYY-MM-DD", tenta transformar explicitamente em Date UTC
  try {
    // Se for formato YYYY-MM-DD (LocalDate), acrescenta tempo para evitar timezone shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      return new Date(`${value}T00:00:00`);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

const JourneyDays: React.FC<Props> = ({ onboarding }) => {
  const begin = parseDate(onboarding?.dt_begin);
  const end = parseDate(onboarding?.dt_end);
  const now = new Date();

  let totalDays = 90; // fallback padrão
  if (begin && end) {
    const raw = Math.ceil((end.getTime() - begin.getTime()) / MS_PER_DAY);
    totalDays = Math.max(1, raw);
  }

  let journeyDays = 0;
  if (begin) {
    const rawPassed = Math.floor(
      (now.getTime() - begin.getTime()) / MS_PER_DAY
    );
    journeyDays = Math.max(0, rawPassed);
    journeyDays = Math.min(journeyDays, totalDays);
  }

  const daysRemaining = end
    ? Math.max(0, Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY))
    : null;

  const currentLevel =
    (onboarding?.currentStep &&
      ((onboarding.currentStep as any).orderStep ??
        (onboarding.currentStep as any).order)) ??
    "?";

  return (
    <div className="resumo">
      <p>
        Dias da jornada:{" "}
        <strong>
          {journeyDays}/{totalDays}
        </strong>
      </p>
      <p>
        Dias restantes:{" "}
        <strong>{daysRemaining !== null ? daysRemaining : "—"}</strong>
      </p>
      <p>
        Nível atual: <strong>{currentLevel}</strong>
      </p>
    </div>
  );
};

export default JourneyDays;
