import React, { useEffect, useState } from "react";
import { ButtonPrimary, Checkbox, Text, Box } from "@telefonica/mistica";
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
} from "@telefonica/mistica";
import emailjs from "emailjs-com";

import "./Dashboard.css";

export interface TaskDTO {
  id: number;
  name: string;
  completed: boolean;
  standard: boolean;
}

export interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  task: TaskDTO[];
}

export interface UserDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  position: string;
  telephone: string;
  role: string;
  teamId: number;
  onboardingIds: number[];
}

export interface Onboarding {
  id: number;
  dt_begin: string;
  dt_end: string;
  active: boolean;
  manager: UserDTO;
  buddy: UserDTO;
  collaborator: UserDTO;
  steps: StepDTO[];
  reports: any[];
  currentStep: StepDTO;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checklist, setChecklist] = useState<TaskDTO[]>([]);
  const [selectedHumor, setSelectedHumor] = useState("");
  const [duvida, setDuvida] = useState("");
  const [evento, setEvento] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const fetchUserAndOnboarding = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Buscar dados do usuário
        const userResponse = await fetch(
          `http://localhost:8080/users/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          const errorBody = await userResponse.json();
          throw new Error(
            errorBody.message || "Erro ao buscar dados do usuário."
          );
        }

        const userData: UserDTO = await userResponse.json();
        setUser(userData);

        if (!userData.onboardingIds || userData.onboardingIds.length === 0) {
          throw new Error("Nenhum onboarding encontrado para o usuário.");
        }

        // 2. Buscar dados do onboarding (primeiro onboardingId)
        const onboardingId = userData.onboardingIds[0];

        const onboardingResponse = await fetch(
          `http://localhost:8080/onboardings/${onboardingId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!onboardingResponse.ok) {
          const errorBody = await onboardingResponse.json();
          throw new Error(
            errorBody.message || `Erro ao buscar onboarding ${onboardingId}`
          );
        }

        const onboardingData: Onboarding = await onboardingResponse.json();
        setOnboarding(onboardingData);

        setChecklist(onboardingData.currentStep?.task || []);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados.");
        setLoading(false);
      }
    };

    fetchUserAndOnboarding();
  }, []);

  const handleToggleItem = async (id: number) => {
    if (!checklist) return;

    const item = checklist.find((task) => task.id === id);
    if (!item) return;

    const newCompleted = !item.completed;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      // Atualiza no backend
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: newCompleted }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Erro ao atualizar tarefa.");
      }

      // Atualiza localmente
      setChecklist((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: newCompleted } : task
        )
      );
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleConcluirEtapa = async () => {
    try {
      if (!onboarding) return;
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");

      // Avança para próxima etapa
      const response = await fetch(
        `http://localhost:8080/onboardings/${onboarding.id}/next-step`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.message || "Erro ao avançar para próxima etapa."
        );
      }

      // Atualiza onboarding com a resposta nova
      const updatedOnboarding: Onboarding = await response.json();
      setOnboarding(updatedOnboarding);
      setChecklist(updatedOnboarding.currentStep?.task || []);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleEnviarRelatorio = () => {
    if (!onboarding) return;

    const templateParams = {
      usuario: onboarding.collaborator.name,
      humor: selectedHumor,
      duvida,
      evento,
      comentario,
    };

    emailjs
      .send(
        "service_035axxj",
        "template_fdrw5m4",
        templateParams,
        "PoOZlvrt-Xo83H8DM"
      )
      .then(() => {
        alert("Feedback enviado com sucesso!");
        setEnviado(true);
        setSelectedHumor("");
        setDuvida("");
        setEvento("");
        setComentario("");
        setTimeout(() => setEnviado(false), 5000);
      })
      .catch((error) => {
        console.error("Erro ao enviar relatório:", error);
        alert("Erro ao enviar relatório");
      });
  };

  if (loading) return <p>Carregando onboarding...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user || !onboarding) return <p>Dados não encontrados.</p>;

  // Calcular dias decorrido e dias restantes
  const dtBegin = new Date(onboarding.dt_begin);
  const dtEnd = new Date(onboarding.dt_end);
  const today = new Date();

  const diffTimeTotal = dtEnd.getTime() - dtBegin.getTime();
  const diffTimePassed = today.getTime() - dtBegin.getTime();
  const journeyDays = Math.min(
    90,
    Math.max(0, Math.floor(diffTimePassed / (1000 * 60 * 60 * 24)))
  );
  const daysLeft = Math.max(
    0,
    Math.floor((dtEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>
        Olá, {user.name} {user.lastName}!
      </h1>
      <h2>Roadmap Onboarding</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 3 }}>
          {onboarding.steps.map((step) => {
            let status: "active" | "locked" | "completed" = "locked";
            if (step.id === onboarding.currentStep.id) status = "active";
            else if (step.orderStep < onboarding.currentStep.orderStep)
              status = "completed";

            return (
              <div
                key={step.id}
                style={{
                  border: "1px solid #ddd",
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor:
                    status === "active"
                      ? "#eef"
                      : status === "completed"
                      ? "#efe"
                      : "#f9f9f9",
                }}
              >
                <h3>
                  Etapa {step.orderStep} - {step.name} ({status})
                </h3>
                <p>{step.description}</p>
                {status === "locked" && (
                  <p style={{ color: "#888" }}>
                    <i>Etapa bloqueada</i>
                  </p>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: 20 }}>
            <h3>Checklist da etapa atual</h3>
            {checklist.length > 0 ? (
              checklist.map((item) => (
                <div key={item.id}>
                  <Checkbox
                    name={`checkbox-${item.id}`}
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                  >
                    {item.name}
                  </Checkbox>
                </div>
              ))
            ) : (
              <Text>Nenhum item disponível.</Text>
            )}

            {checklist.length > 0 && (
              <ButtonPrimary
                style={{ marginTop: 10 }}
                onPress={handleConcluirEtapa}
              >
                Concluir etapa
              </ButtonPrimary>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3>Dias da jornada</h3>
            <p>
              {journeyDays} / 90 dias
              <br />
              Restam {daysLeft} dias
            </p>
          </div>

          <div>
            <h3>Nível atual</h3>
            <p>Etapa {onboarding.currentStep.orderStep} + 1</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Como você se sentiu essa semana?</h3>
        {[1, 2, 3, 4].map((level) => {
          const Icon =
            level === 1
              ? IconFaceSadRegular
              : level === 2
              ? IconFaceNeutralRegular
              : level === 3
              ? IconFaceHappyRegular
              : IconFaceSuperHappyRegular;

          return (
            <label
              key={level}
              style={{ marginRight: 10, cursor: "pointer" }}
              onClick={() => setSelectedHumor(String(level))}
            >
              <input
                type="radio"
                name="humor"
                value={level}
                checked={selectedHumor === String(level)}
                onChange={() => setSelectedHumor(String(level))}
                style={{ display: "none" }}
              />
              <Icon size={32} color="currentColor" />
            </label>
          );
        })}

        <div style={{ marginTop: 10 }}>
          <textarea
            placeholder="Teve alguma dúvida essa semana?"
            value={duvida}
            onChange={(e) => setDuvida(e.target.value)}
            style={{ width: "100%", minHeight: 60, marginBottom: 10 }}
          />
          <textarea
            placeholder="Participou de algum evento de integração?"
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            style={{ width: "100%", minHeight: 60, marginBottom: 10 }}
          />
          <textarea
            placeholder="Algum comentário extra?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            style={{ width: "100%", minHeight: 60 }}
          />
        </div>

        <ButtonPrimary
          style={{ marginTop: 12 }}
          onPress={handleEnviarRelatorio}
          disabled={enviado}
        >
          {enviado ? "Enviado" : "Enviar relatório semanal"}
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Dashboard;
