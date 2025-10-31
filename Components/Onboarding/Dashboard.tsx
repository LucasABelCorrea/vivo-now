import React, { useEffect, useState } from "react";
import "./Onboarding.css";
import StageCard from "./StageCard";
import Card from "../Card/Card";
import { ButtonPrimary, Checkbox } from "@telefonica/mistica";
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
  IconStarFilled
} from "@telefonica/mistica";
import { Onboarding, TaskDTO } from "../../src/types/onboardingTypes";
import MyPrimaryButton from "../Button/MyPrimaryButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardEtapaInfo from "./CardEtapaInfo";

interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  task?: TaskDTO[];
  tasks?: TaskDTO[];
}

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE;

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
    (Array.isArray(steps) ? steps.find((s: any) => s?.current) : undefined);

  const tasks: TaskDTO[] =
    currentStep?.task ?? currentStep?.tasks ?? currentStep?.taskList ?? [];

  const collaborator =
    api?.collaborator ?? api?.user ?? api?.owner ?? undefined;

  return {
    id: api?.id ?? api?.onboardingId ?? null,
    dt_begin:
      api?.dt_begin ?? api?.startDate ?? api?.start_date ?? api?.begin ?? "",
    dt_end: api?.dt_end ?? api?.endDate ?? api?.end_date ?? api?.finish ?? "",
    steps: steps as StepDTO[],
    currentStep: {
      ...(currentStep ?? {}),
      task: tasks,
      tasks: tasks,
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
  const [selectedHumor, setSelectedHumor] = useState("");
  const [duvida, setDuvida] = useState("");
  const [evento, setEvento] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [advancing, setAdvancing] = useState(false);

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
        setLoading(false);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      if (!res.ok) return;
      const onbApi = await safeJson(res);
      const onboardingData = normalizeOnboarding(onbApi);
      setData(onboardingData);
    } catch (e) {
      console.error("Erro ao recarregar onboarding", e);
    }
  };

  const handleToggleItem = async (id: number) => {
    const token = localStorage.getItem("token");

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
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
    } catch (err) {
      console.error("Erro ao atualizar task:", err);
    }
  };

  // Concluir etapa -> chama PUT /onboardings/{id}/next-step e recarrega dados
  const handleConcluirEtapa = async () => {
    if (!data?.id) {
      setError("Onboarding inválido.");
      return;
    }

    // validação: só permite avançar se todas as tasks estiverem concluídas
    const currentStepTasks =
      data.steps?.find((step) => step.orderStep === data.currentStep?.orderStep)
        ?.tasks ?? [];

    const allTasksCompleted =
      currentStepTasks.length > 0 &&
      currentStepTasks.every((task) => task.completed);

    if (!allTasksCompleted) {
      toast.error("Finalize todas as tarefas antes de concluir a etapa.");
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

  const handleEnviarRelatorio = async () => {
    let hasError = false;

    if (!selectedHumor) {
      toast.error("O campo 'Como você se sentiu essa semana?' é obrigatório.");
      hasError = true;
    }
    if (!duvida.trim()) {
      toast.error("O campo 'Teve alguma dúvida essa semana?' é obrigatório.");
      hasError = true;
    }
    if (hasError) return;

    if (!data?.id) return;
    const token = localStorage.getItem("token");
    const payload = {
      feeling: Number(selectedHumor) || null,
      question: duvida || null,
      event: evento || null,
      comment: comentario || null,
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

      if (!res.ok) throw new Error("Erro ao enviar relatório.");

      setEnviado(true);
      setSelectedHumor("");
      setDuvida("");
      setEvento("");
      setComentario("");
      await refreshOnboarding();
      setTimeout(() => setEnviado(false), 5000);
      toast.success("Relatório enviado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao enviar relatório:", err);
      toast.error("Erro ao enviar relatório.");
      setError(err?.message ?? "Erro ao enviar relatório.");
    }
  };

  if (loading) return <p>Carregando onboarding...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>Dados não encontrados.</p>;

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

  const currentStepTasks =
    data?.steps?.find((step) => step.orderStep === data.currentStep?.orderStep)
      ?.tasks ?? [];

  const allTasksCompleted =
    currentStepTasks.length > 0 &&
    currentStepTasks.every((task) => task.completed);

  return (
    <div className="onboarding-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="layout-onboarding">
        <div className="coluna-central">
          <h1 className="titulo">
            Olá, {data.collaborator?.name} {data.collaborator?.lastName}!
          </h1>
          <h2>Roadmap Onboarding</h2>

          <div
            className="cards-duplos"
            style={{
              justifyContent: "center",
              display: "flex",
              gap: "2rem",
              marginBottom: "2rem",
              width: "100%",
            }}
          >
            {/* Se não há etapas ou dados */}
            {!data?.steps?.length ? <CardEtapaInfo tipo="sem-etapas" /> : null}

            {/* Se todas as etapas foram concluídas */}
            {data?.steps?.length &&
              (data?.currentStep?.orderStep ?? 0) > data.steps.length && (
                <CardEtapaInfo tipo="sem-etapas" />
              )}

            {/* Exibe apenas a etapa atual (card roxo) */}
            {data?.currentStep?.orderStep &&
              data?.steps?.[data.currentStep.orderStep - 1] && (
                <StageCard
                  key={data.steps[data.currentStep.orderStep - 1].id}
                  step={{
                    ...data.steps[data.currentStep.orderStep - 1],
                    name: data.steps[data.currentStep.orderStep - 1].name || "",
                    description:
                      data.steps[data.currentStep.orderStep - 1].description ||
                      "",
                    orderStep:
                      data.steps[data.currentStep.orderStep - 1].orderStep ?? 1,
                  }}
                  status="active"
                />
              )}

            {/* Card cinza se não houver currentStep ou etapa correspondente */}
            {(!data.currentStep ||
              !data.steps?.some(
                (step) => step.orderStep === data.currentStep?.orderStep
              )) && <CardEtapaInfo tipo="sem-etapas" />}
          </div>

          {data.steps
            ?.filter((step) => step.orderStep === data.currentStep?.orderStep)
            .map((step) =>
              step.tasks?.length ? (
                <div
                  key={`checklist-${step.id}`}
                  style={{ marginBottom: "2rem" }}
                >
                  <h4>Tarefas da etapa {step.orderStep}</h4>
                  {step.tasks.map((task) => (
                    <div key={task.id}>
                      <Checkbox
                        name={`task-${task.id}`}
                        checked={!!task.completed}
                        onChange={() => handleToggleItem(task.id)}
                      >
                        <span style={{ color: "#000" }}>{task.name}</span>
                      </Checkbox>
                    </div>
                  ))}

                  <div style={{ marginTop: "2rem" }}>
                    <MyPrimaryButton
                      onPress={handleConcluirEtapa}
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
          <div className="widget-card">
            <h3>Dias da jornada</h3>
            <p>
              {diasConcluidos !== null && totalDias !== null
                ? `${diasConcluidos} / ${totalDias}`
                : "Datas da jornada não definidas"}
            </p>
          </div>

          <div className="widget-card">
            <h3>Seu nível atual</h3>
            <div className="starIcon">
              <IconStarFilled size={80} color=" #660099" />
              <p>
                {data.currentStep?.orderStep
                  ? data.currentStep.orderStep
                  : data.steps?.length
                  ? Math.max(...data.steps.map((s) => s.orderStep ?? 0))
                  : "?"}
              </p>
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