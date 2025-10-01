import React, { useEffect, useState } from "react";
import "./HomeBuddy.css";
import { useNavigate } from "react-router-dom";

// ================== TIPOS ==================
interface User {
  id: number;
  name: string;
  lastName?: string;
  position?: string;
  teamId?: number;
}

interface Report {
  id: number;
  createdAt: string;
}

interface Step {
  id: number;
  name: string;
  orderStep: number;
}

interface Onboarding {
  id: number;
  dt_begin: string;
  dt_end: string;
  active: boolean;
  manager?: User;
  collaborator: User;
  currentStep?: Step;
  reports: Report[];
}

// ================== CONSTANTES ==================
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE;
const TOKEN = localStorage.getItem("token") || "";
const Buddy_ID = localStorage.getItem("userId") || "";

// ================== COMPONENTE ==================
const HomeBuddy: React.FC = () => {
  const navigate = useNavigate();

  const [buddy, setBuddy] = useState<User | null>(null);
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [selectedMonthMap, setSelectedMonthMap] = useState<
    Record<number, string>
  >({});
  const [isLoading, setIsLoading] = useState(true); // 👈 controle de carregamento

  const loadBuddy = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${Buddy_ID}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        const data: User = await res.json();
        setBuddy(data);
        if (data.teamId) {
          localStorage.setItem("teamId", String(data.teamId));
        }
      } else {
        console.error("Erro ao buscar buddy", res.status);
      }
    } catch (err) {
      console.error("Erro fetch buddy:", err);
    }
  };

  const loadOnboardings = async () => {
    try {
      const res = await fetch(`${API_BASE}/onboardings/buddy/${Buddy_ID}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!res.ok) {
        console.error("Erro ao buscar onboardings", res.status);
        return;
      }
      const data = await res.json();
      const onboardingsWithReports: Onboarding[] = await Promise.all(
        data.map(async (onboarding: Omit<Onboarding, "reports">) => {
          try {
            const r = await fetch(
              `${API_BASE}/onboardings/${onboarding.id}/reports`,
              {
                headers: { Authorization: `Bearer ${TOKEN}` },
              }
            );
            const reports: Report[] = r.ok ? await r.json() : [];
            return { ...onboarding, reports };
          } catch (err) {
            console.error(
              "Erro ao buscar reports para onboarding",
              onboarding.id,
              err
            );
            return { ...onboarding, reports: [] };
          }
        })
      );
      setOnboardings(onboardingsWithReports);
    } catch (err) {
      console.error("Erro fetch onboardings:", err);
    } finally {
      setIsLoading(false); // 👈 finaliza carregamento
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await loadBuddy();
      await loadOnboardings();
    };

    fetchAll();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchAll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  const filterReportsByMonth = (
    reports: Report[],
    onboardingId?: number
  ): Report[] => {
    if (!onboardingId) return reports;
    const selectedMonth = selectedMonthMap[onboardingId];
    if (!selectedMonth) return reports;
    return reports.filter((r) => r.createdAt?.startsWith(selectedMonth));
  };

  if (isLoading) {
    return (
      <div className="homebuddy-loading">
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <div className="homebuddy-container">
      <div className="homebuddy-header">
        <h2>
          Olá, {buddy?.name} {buddy?.lastName}
        </h2>
      </div>

      {onboardings.map((onboarding) => (
        <div key={onboarding.id} className="homebuddy-card">
          <h3>Onboarding do(a) {onboarding.collaborator?.name}</h3>
          <p>
            <strong>Início:</strong> {onboarding.dt_begin}
          </p>
          <p>
            <strong>Fim:</strong> {onboarding.dt_end}
          </p>
          <p>
            <strong>Status:</strong> {onboarding.active ? "Ativo" : "Inativo"}
          </p>
          <p>
            <strong>Gestor:</strong> {onboarding.manager?.name} (
            {onboarding.manager?.position})
          </p>
          <p>
            <strong>Colaborador:</strong> {onboarding.collaborator?.name} (
            {onboarding.collaborator?.position})
          </p>
          <p>
            <strong>Etapa atual:</strong> {onboarding.currentStep?.name} (#
            {onboarding.currentStep?.orderStep})
          </p>

          <div className="homebuddy-filtro-relatorio">
            <label>Filtrar relatórios por mês (este onboarding):</label>
            <input
              type="month"
              value={selectedMonthMap[onboarding.id] || ""}
              onChange={(e) =>
                setSelectedMonthMap((prev) => ({
                  ...prev,
                  [onboarding.id]: e.target.value,
                }))
              }
              className="homebuddy-dropdown"
            />
          </div>

          <div className="homebuddy-relatorios">
            {filterReportsByMonth(onboarding.reports, onboarding.id).map(
              (report) => (
                <button
                  key={report.id}
                  onClick={() => navigate("/relatorio", { state: { report } })}
                >
                  Relatório - {report.createdAt}
                </button>
              )
            )}
          </div>

          <div className="homebuddy-actions">
            <button
              className="homebuddy-editar"
              onClick={() =>
                navigate(`/visualizacaoOnboarding/${onboarding.id}`)
              }
            >
              Visualizar onboarding
            </button>
            <button
              className="homebuddy-chat"
              onClick={() =>
                navigate(
                  `/chat?senderId=${Buddy_ID}&receiverId=${onboarding.collaborator.id}`
                )
              }
            >
              Chat com o colaborador
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeBuddy;
