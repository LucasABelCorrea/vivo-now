// Dashboard.tsx
import React, { useEffect, useState } from "react";
import "./Onboarding.css";
import StageCard from "./StageCard";
import Card from "../Card/Card";
import { ButtonPrimary, Checkbox, Text, Box } from "@telefonica/mistica";
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
} from "@telefonica/mistica";
import { Onboarding, TaskDTO } from "../../src/types/onboardingTypes";
import MyPrimaryButton from "../Button/MyPrimaryButton";

interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  // compatibilidade: backend pode enviar "task" ou "tasks"
  task?: TaskDTO[];
  tasks?: TaskDTO[];
}

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";

const formatDate = (isoOrAny: any) => {
  if (!isoOrAny) return "?";
  try {
    const d = new Date(isoOrAny);
    if (isNaN(d.getTime())) return String(isoOrAny);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return String(isoOrAny);
  }
};

const normalizeUser = (userApi: any) => ({
  id: userApi?.id ?? userApi?.userId ?? null,
  name: userApi?.name ?? userApi?.firstName ?? "",
  lastName: userApi?.lastName ?? userApi?.surname ?? userApi?.last_name ?? "",
  email: userApi?.email ?? "",
  position: userApi?.position ?? userApi?.role ?? "",
  telephone: userApi?.telephone ?? userApi?.phone ?? "",
  role: userApi?.role ?? userApi?.roleName ?? "",
  teamId: userApi?.teamId ?? userApi?.team?.id ?? userApi?.team_id ?? null,
  onboardingIds: Array.isArray(userApi?.onboardingIds)
    ? userApi.onboardingIds
    : Array.isArray(userApi?.onboardings)
    ? userApi.onboardings
    : [],
});

const normalizeOnboarding = (api: any): Onboarding => {
  const steps: StepDTO[] =
    api?.steps ?? api?.stages ?? api?.stepList ?? api?.workflow ?? [];

  const currentStep =
    api?.currentStep ??
    api?.current_step ??
    (Array.isArray(steps) ? steps.find((s: any) => s?.current) : undefined) ??
    undefined;

  const tasks: TaskDTO[] =
    currentStep?.task ?? currentStep?.tasks ?? currentStep?.taskList ?? [];

  const collaborator =
    api?.collaborator ??
    api?.user ??
    (api?.owner ? api.owner : undefined) ??
    undefined;

  return {
    id: api?.id ?? api?.onboardingId ?? null,
    dt_begin:
      api?.dt_begin ?? api?.startDate ?? api?.start_date ?? api?.begin ?? "",
    dt_end: api?.dt_end ?? api?.endDate ?? api?.end_date ?? api?.finish ?? "",
    steps: steps as StepDTO[],
    currentStep: {
      ...(currentStep ?? {}),
      task: tasks as TaskDTO[],
      tasks: tasks as TaskDTO[],
    } as StepDTO,
    collaborator,
    active: api?.active ?? true,
    reports: api?.reports ?? [],
    ...(api ?? {}),
  } as Onboarding;
};

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Onboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<TaskDTO[]>([]);
  const [selectedHumor, setSelectedHumor] = useState("");
  const [duvida, setDuvida] = useState("");
  const [evento, setEvento] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [taskUpdatingIds, setTaskUpdatingIds] = useState<number[]>([]); // ids em atualização

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch(`${API_BASE}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          const errBody = await safeJson(userRes);
          throw new Error(
            errBody?.message || "Erro ao buscar dados do usuário."
          );
        }

        const userApi = await safeJson(userRes);
        const user = normalizeUser(userApi);

        if (user.teamId !== undefined && user.teamId !== null) {
          localStorage.setItem("teamId", String(user.teamId));
        }

        const onboardingIds: number[] = Array.isArray(user.onboardingIds)
          ? user.onboardingIds.map((v: any) =>
              typeof v === "string" ? Number(v) : v
            )
          : [];

        if (onboardingIds.length === 0) {
          setError("Nenhum onboarding encontrado para o usuário.");
          setLoading(false);
          return;
        }

        const onboardingId = onboardingIds[0];

        const onbRes = await fetch(`${API_BASE}/onboardings/${onboardingId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!onbRes.ok) {
          const errBody = await safeJson(onbRes);
          throw new Error(
            errBody?.message || `Erro ao buscar onboarding ${onboardingId}`
          );
        }

        const onbApi = await safeJson(onbRes);
        const onboardingData = normalizeOnboarding(onbApi);

        setData(onboardingData);

        const initialTasks: TaskDTO[] =
          onboardingData.currentStep?.task ??
          onboardingData.currentStep?.task ??
          [];
        setChecklist(initialTasks);

        setLoading(false);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleTask = async (taskId: number, stepId: number) => {
    if (!data || !data.steps) return;

    const token = localStorage.getItem("token");
    const step = data.steps.find((s) => s.id === stepId);
    if (!step || !step.tasks) return;

    const task = step.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ completed: newCompleted }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "Erro ao atualizar tarefa");
      }

      const updated = await res.json();
      const updatedTask: TaskDTO = {
        ...task,
        ...(updated as Partial<TaskDTO>),
      };

      const updatedSteps = data.steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              tasks: s.tasks?.map((t) => (t.id === taskId ? updatedTask : t)),
            }
          : s
      );

      setData((prev) => (prev ? { ...prev, steps: updatedSteps } : prev));
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  // Recarrega o onboarding atual (usado após next-step)
  const refreshOnboarding = async () => {
    if (!data?.id) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/onboardings/${data.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errBody = await safeJson(res);
        console.error("Falha ao recarregar onboarding:", errBody?.message);
        return;
      }
      const onbApi = await safeJson(res);
      const onboardingData = normalizeOnboarding(onbApi);
      setData(onboardingData);
      const initialTasks: TaskDTO[] =
        onboardingData.currentStep?.task ??
        onboardingData.currentStep?.task ??
        [];
      setChecklist(initialTasks);
    } catch (e) {
      console.error("Erro ao recarregar onboarding", e);
    }
  };

  // Toggle de checkbox: atualização otimista + PUT /tasks/{id}
  const handleToggleItem = async (id: number) => {
    const token = localStorage.getItem("token");

    // Atualização otimista
    setData((prev) => {
      if (!prev) return prev;

      const updatedSteps = prev.steps?.map((step) => {
        if (step.orderStep !== prev.currentStep?.orderStep) return step;

        const updatedTasks = (step.tasks ?? []).map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );

        return { ...step, tasks: updatedTasks };
      });

      return { ...prev, steps: updatedSteps };
    });

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }), // ou o valor real
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar tarefa.");
      }

      const updatedTask = await res.json();

      // Atualiza com dados do backend
      setData((prev) => {
        if (!prev) return prev;

        const updatedSteps = prev.steps?.map((step) => {
          if (step.orderStep !== prev.currentStep?.orderStep) return step;

          const updatedTasks = (step.tasks ?? []).map((task) =>
            task.id === id
              ? { ...task, completed: updatedTask.completed }
              : task
          );

          return { ...step, tasks: updatedTasks };
        });

        return { ...prev, steps: updatedSteps };
      });
    } catch (err) {
      console.error("Erro ao atualizar task:", err);
      // rollback se quiser
    }
  };

  // Concluir etapa -> chama PUT /onboardings/{id}/next-step e recarrega dados
  const handleConcluirEtapa = async () => {
    if (!data?.id) {
      setError("Onboarding inválido.");
      return;
    }
    const token = localStorage.getItem("token");
    setAdvancing(true);
    try {
      const res = await fetch(`${API_BASE}/onboardings/${data.id}/next-step`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        throw new Error("Você não tem permissão para avançar esta etapa.");
      }

      if (!res.ok) {
        const errBody = await safeJson(res);
        console.log(errBody);
        throw new Error(errBody?.message || "Erro ao avançar etapa.");
      }
      // sucesso: recarrega onboarding atualizado
      await refreshOnboarding();
    } catch (err: any) {
      console.error("Erro ao avançar etapa:", err);
      setError(err?.message ?? "Erro ao avançar etapa.");
    } finally {
      setAdvancing(false);
    }
  };

  // Envia relatório via POST /onboardings/{id}/reports
  const handleEnviarRelatorio = async () => {
    if (!data?.id) {
      setError("Onboarding inválido.");
      return;
    }
    const token = localStorage.getItem("token");
    const payload = {
      feeling: Number(selectedHumor) || null,
      question: duvida || null,
      event: evento || null,
      comment: comentario || null,
      // createdAt é gerenciado pelo backend (se necessário, pode enviar createdAt: new Date().toISOString())
    };

    try {
      const res = await fetch(`${API_BASE}/onboardings/${data.id}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await safeJson(res);
        throw new Error(errBody?.message || "Erro ao enviar relatório.");
      }

      // opcional: pegar o relatório criado
      const created = await safeJson(res);
      console.log("Relatório criado:", created);

      setEnviado(true);
      setSelectedHumor("");
      setDuvida("");
      setEvento("");
      setComentario("");
      // atualizar lista de reports no state se quiser
      await refreshOnboarding();
      setTimeout(() => setEnviado(false), 5000);
    } catch (err: any) {
      console.error("Erro ao enviar relatório:", err);
      setError(err?.message ?? "Erro ao enviar relatório.");
    }
  };

  if (loading) return <p className="loading">Carregando onboarding...</p>;
  if (error) return <p className="erro">{error}</p>;
  if (!data) return <p className="empty">Dados não encontrados.</p>;

  const dtBegin = data?.dt_begin ? new Date(data.dt_begin) : null;
  const dtEnd = data?.dt_end ? new Date(data.dt_end) : null;
  const hoje = new Date();

  const totalDias =
    dtBegin && dtEnd
      ? Math.max(
          1,
          Math.ceil(
            (dtEnd.getTime() - dtBegin.getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : null;

  const diasConcluidos = dtBegin
    ? Math.min(
        totalDias ?? 0,
        Math.ceil((hoje.getTime() - dtBegin.getTime()) / (1000 * 60 * 60 * 24))
      )
    : null;

  // Aqui o controle para habilitar/desabilitar botão
  const currentStepTasks =
    data?.steps?.find((step) => step.orderStep === data.currentStep?.orderStep)
      ?.tasks ?? [];

  const allTasksCompleted =
    currentStepTasks.length > 0 &&
    currentStepTasks.every((task) => task.completed);

  return (
    <div className="onboarding-container">
      <div className="layout-onboarding">
        <div className="coluna-central">
          <h1 className="onboarding-title">
            Olá, {data.collaborator?.name} {data.collaborator?.lastName}!
          </h1>
          <h2 className="onboarding-subtitle">Roadmap Onboarding</h2>

          <div className="cards-duplos">
            {data.steps?.map((step) => (
              <StageCard
                key={(step as any).id}
                step={step as StepDTO}
                status="active"
              />
            ))}
          </div>
          {data.steps
            ?.filter((step) => step.orderStep === data.currentStep?.orderStep)
            .map((step) =>
              step.tasks?.length ? (
                <div
                  key={`checklist-${step.id}`}
                  className="checklist-custom"
                  style={{ marginBottom: "2rem" }}
                >
                  <h4 style={{ marginBottom: "1rem" }}>
                    Tarefas da etapa {step.orderStep}
                  </h4>
                  {step.tasks.map((task) => (
                    <div key={task.id} className="checklist-item">
                      <Checkbox
                        name={`task-${task.id}`}
                        checked={!!task.completed}
                        onChange={() => handleToggleItem(task.id)}
                      >
                        <span className="checkbox-label">{task.name}</span>
                      </Checkbox>
                    </div>
                  ))}

                  <div style={{ marginTop: "2rem" }}>
                    <MyPrimaryButton
                      onPress={() => {
                        if (!data?.id || advancing) return;
                        handleConcluirEtapa();
                      }}
                      style={{ width: "100%", maxWidth: 300 }}
                      disabled={!allTasksCompleted || advancing}
                    >
                      {advancing ? "Concluindo..." : "Concluir etapa"}
                    </MyPrimaryButton>
                  </div>
                </div>
              ) : null
            )}

          <div className="categorias-grid">
            {[
              { title: "Chat", link: "/chat" },
              { title: "Cursos", link: "/cursos" },
              { title: "Plataformas", link: "/plataformas" },
              { title: "Vivo Vibe", link: "" },
            ].map(({ title, link }) => (
              <a href={link} key={title} style={{ textDecoration: "none" }}>
                <Card title={title} link={link} />
              </a>
            ))}
          </div>
        </div>

        <div className="coluna-lateral">
          <div className="jornada">
            <div className="widget-card dias-jornada">
              <h3>Dias da jornada</h3>
              <p className="dias-jornada">
                {diasConcluidos !== null && totalDias !== null
                  ? `${diasConcluidos} / ${totalDias}`
                  : "Datas da jornada não definidas"}
              </p>
            </div>

            <div className="widget-card">
              <h3>Seu nível atual</h3>
              <div className="badge-nivel">
                Nível {data.currentStep?.orderStep ?? "?"}
              </div>
            </div>
          </div>

          <div className="widget">
            <h3>Como você se sentiu essa semana?</h3>

            <div className="humor-options">
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
                    className={`humor-icon ${
                      selectedHumor === String(level) ? "selected" : ""
                    }`}
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
            </div>

            <textarea
              placeholder="Teve alguma dúvida essa semana?"
              value={duvida}
              onChange={(e) => setDuvida(e.target.value)}
            />
            <textarea
              placeholder="Participou de algum evento de integração?"
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
            />
            <textarea
              placeholder="Algum comentário extra?"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <ButtonPrimary
              onPress={handleEnviarRelatorio}
              className="botao-etapa"
              style={{ marginTop: 12 }}
            >
              Enviar relatório semanal
            </ButtonPrimary>
            {enviado && <div style={{ marginTop: 8 }}>Relatório enviado ✓</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

