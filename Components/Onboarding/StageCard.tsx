// StageCard.tsx
import React, { useEffect, useState } from "react";
import { TaskDTO } from "../../src/types/onboardingTypes";
import { FaLock } from "react-icons/fa";
import { Checkbox } from "@telefonica/mistica";
import "./Onboarding.css";

interface StepDTO {
  id: number;
  name: string;
  description: string;
  orderStep: number;
  // compatibilidade: backend pode enviar "task" ou "tasks"
  task?: TaskDTO[];
  tasks?: TaskDTO[];
}

interface Props {
  step: StepDTO;
  status: "active" | "locked" | "completed";
  // opcional: callback para informar o pai sobre atualização de task
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
  // pega tasks vindo do step (suporta step.task ou step.tasks)
  const initialTasks: TaskDTO[] = (step.tasks ?? step.task ?? []).map((t) => ({
    ...t,
    // garantir types: completed sempre boolean
    completed: !!t.completed,
  }));

  const [localChecklist, setLocalChecklist] = useState<TaskDTO[]>(initialTasks);
  const [expanded, setExpanded] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]); // ids em atualização

  // sincroniza quando o prop step muda
  useEffect(() => {
    const tasks = (step.tasks ?? step.task ?? []).map((t) => ({
      ...t,
      completed: !!t.completed,
    }));
    setLocalChecklist(tasks);
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

      // sincroniza com o state final (garante valores vindos do backend)
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
      // opcional: pode notificar usuário via toast ou setar state de erro
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  return (
    <div className="stage-wrapper">
      <div className={`stage-card ${status}`}>
        <div>
          <span className="etapa-numero">Etapa {step.orderStep}</span>
          <h3 className="etapa-titulo">{step.name}</h3>
          <p className="etapa-descricao">{step.description}</p>

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
