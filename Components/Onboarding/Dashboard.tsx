import React, { useEffect, useState } from "react";
import WeeklyReport from "./WeeklyReport";
import JourneyDays from "./JourneyDays";
import { getDashboard } from "../../src/services/onboardingService";
import { OnboardingDashboard } from "../../src/types/onboardingTypes";
import "./Onboarding.css";
import StageCard from "./StageCard";
import Button from "../Button/Button";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<OnboardingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const mockData: OnboardingDashboard = {
      user: {
        name: "Lucas Correa",
        currentLevel: 3,
        journeyDays: 42,
      },
      stages: [
        {
          id: 1,
          title: "Bem-vindo à empresa",
          progress: 1,
          status: "completed",
          checklist: [
            { id: 1, label: "Recebeu equipamento", completed: false },
            { id: 2, label: "Criou conta nos sistemas", completed: false },
          ],
        },
        {
          id: 2,
          title: "Conhecendo o time",
          progress: 0.6,
          status: "active",
          checklist: [],
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="loading">Carregando onboarding...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (!data) return <p className="empty">Dados não encontrados.</p>;

  return (
    <div className="onboarding-container">
      <div className="coluna-central">
        <h1 className="onboarding-title">Olá, {data.user.name}!</h1>

        <div className="cards-duplos">
          <StageCard stage={data.stages[0]} showChecklist />
          <StageCard stage={data.stages[1]} showChecklist={false} />
        </div>

        <ul className="checklist checklist-independente">
          <li>
            <label>
              <input type="checkbox" />
              <span>Fez login no sistema</span>
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>Leu o manual de boas-vindas</span>
            </label>
          </li>
        </ul>
        <Button type="submit" className="botao-etapa">Concluir etapa</Button>
      </div>
    </div>
  );
};

export default Dashboard;
