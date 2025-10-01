import React, { useEffect, useState } from "react";
import "./HomeGestor.css";
import ModalCriarOnboarding from "../ModalCriarOnboarding/ModalCriarOnboarding";
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
  buddy?: User;
  collaborator: User;
  currentStep?: Step;
  reports: Report[];
}

// ================== CONSTANTES ==================
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";
const TOKEN = localStorage.getItem("token") || "";
const GESTOR_ID = 2;

// ================== COMPONENTE ==================
const HomeGestor: React.FC = () => {
  const navigate = useNavigate();

  const [gestor, setGestor] = useState<User | null>(null);
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [selectedMonthMap, setSelectedMonthMap] = useState<
    Record<number, string>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 👈 controle de carregamento

  const loadGestor = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${GESTOR_ID}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        const data: User = await res.json();
        setGestor(data);
        if (data.teamId) {
          localStorage.setItem("teamId", String(data.teamId));
        }
      } else {
        console.error("Erro ao buscar gestor", res.status);
      }
    } catch (err) {
      console.error("Erro fetch gestor:", err);
    }
  };

  const loadOnboardings = async () => {
    try {
      const res = await fetch(`${API_BASE}/onboardings/manager/${GESTOR_ID}`, {
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
      await loadGestor();
      await loadOnboardings();
    };

    fetchAll();
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
      <div className="homegestor-loading">
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <div className="homegestor-container">
      <div className="homegestor-header">
        <h2>
          Olá, {gestor?.name} {gestor?.lastName}
        </h2>
        <button
          className="homegestor-criar-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Criar onboarding
        </button>
      </div>

      {isModalOpen && (
        <ModalCriarOnboarding
          gestor={gestor}
          token={TOKEN}
          apiBase={API_BASE}
          onClose={() => {
            setIsModalOpen(false);
            loadOnboardings();
          }}
        />
      )}

      {onboardings.map((onboarding) => (
        <div key={onboarding.id} className="homegestor-card">
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
            <strong>Buddy:</strong> {onboarding.buddy?.name} (
            {onboarding.buddy?.position})
          </p>
          <p>
            <strong>Colaborador:</strong> {onboarding.collaborator?.name} (
            {onboarding.collaborator?.position})
          </p>
          <p>
            <strong>Etapa atual:</strong> {onboarding.currentStep?.name} (#
            {onboarding.currentStep?.orderStep})
          </p>

          <div className="homegestor-filtro-relatorio">
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
              className="homegestor-dropdown"
            />
          </div>

          <div className="homegestor-relatorios">
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

          <div className="homegestor-actions">
            <button
              className="homegestor-editar"
              onClick={() => navigate(`/edicaoOnboarding/${onboarding.id}`)}
            >
              Visualizar/Editar onboarding
            </button>
            <button
              className="homegestor-chat"
              onClick={() =>
                navigate(
                  `/chat?senderId=${GESTOR_ID}&receiverId=${onboarding.collaborator.id}`
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

export default HomeGestor;
