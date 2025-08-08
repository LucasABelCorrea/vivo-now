// StageCard.tsx
import React, { useEffect, useState } from "react";
import { StepDTO, TaskDTO } from "../../src/types/onboardingTypes";
import { FaLock } from "react-icons/fa";
import { Checkbox } from "@telefonica/mistica";
import "./Onboarding.css";

interface Props {
  step: StepDTO;
  status: "active" | "locked" | "completed";
  onTaskUpdated?: (task: TaskDTO) => void;
}

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const StageCard: React.FC<Props> = ({ step, status, onTaskUpdated }) => {
  // suporta tanto step.task quanto step.tasks, e normaliza os campos essenciais
  const normalizeTasks = (raw: any[] | undefined): TaskDTO[] => {
    if (!Array.isArray(raw)) return [];
    return raw.map((t: any) => ({
      id: Number(t?.id),
      name: t?.name ?? t?.title ?? "Tarefa",
      completed: !!t?.completed,
      standard: !!t?.standard,
      ...t,
    }));
  };

  const initialTasks: TaskDTO[] = normalizeTasks(
    (step.tasks ?? step.task) as any[]
  );
  const [localChecklist, setLocalChecklist] = useState<TaskDTO[]>(initialTasks);
  const [expanded, setExpanded] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    setLocalChecklist(normalizeTasks((step.tasks ?? step.task) as any[]));
  }, [step]);

  const total = localChecklist.length;
  const done = localChecklist.filter((item) => item.completed).length;
  const progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggleItem = async (taskId: number) => {
    const token = localStorage.getItem("token");
    const task = localChecklist.find((t) => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;

    // optimistic update
    setLocalChecklist((prev) =>
      prev.map((it) =>
        it.id === taskId ? { ...it, completed: newCompleted } : it
      )
    );
    setUpdatingIds((prev) => [...prev, taskId]);

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
        const errBody = await safeJson(res);
        throw new Error(errBody?.message || "Erro ao atualizar tarefa.");
      }

      const updated = await safeJson(res);
      const updatedTask: TaskDTO = updated
        ? { ...task, ...(updated as Partial<TaskDTO>) }
        : { ...task, completed: newCompleted };

      setLocalChecklist((prev) =>
        prev.map((it) => (it.id === taskId ? updatedTask : it))
      );
      if (onTaskUpdated) onTaskUpdated(updatedTask);
    } catch (err: any) {
      // rollback
      setLocalChecklist((prev) =>
        prev.map((it) =>
          it.id === taskId ? { ...it, completed: !newCompleted } : it
        )
      );
      console.error("Erro ao atualizar task:", err);
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  return (
    <div className="stage-wrapper">
      <div className={`stage-card ${status}`}>
        <div>
          <span className="etapa-numero">
            Etapa {step.orderStep ?? (step as any).order ?? "—"}
          </span>
          <h3 className="etapa-titulo">{step.name ?? "Sem título"}</h3>
          <p className="etapa-descricao">{step.description ?? ""}</p>

          {status === "active" && (
            <>
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

              {localChecklist.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <button
                    className="botao-expand-tasks"
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-expanded={expanded}
                    style={{ cursor: "pointer" }}
                  >
                    {expanded
                      ? "Ocultar tarefas"
                      : `Ver tarefas (${done}/${total})`}
                  </button>
                </div>
              )}

              {expanded && (
                <div className="stage-tasks" style={{ marginTop: 12 }}>
                  {localChecklist.map((task) => (
                    <div key={task.id} className="stage-task-item">
                      <Checkbox
                        name={`task-${task.id}`}
                        checked={!!task.completed}
                        onChange={() => toggleItem(task.id)}
                        disabled={updatingIds.includes(task.id)}
                      >
                        <span className="task-label">
                          {task.name ?? "Tarefa"}
                        </span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              )}
            </>
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
