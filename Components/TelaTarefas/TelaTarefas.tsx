import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TelaTarefas.css";
import {
    IconCopyRegular,
    IconEditRegular,
    IconTrashCanRegular
} from "@telefonica/mistica";
import ModalCriarEtapa from "../ModalCriarEtapa/ModalCriarEtapa";
import ModalCriarTarefa from "../ModalCriarTarefa/ModalCriarTarefa";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import InfoModal from "../InfoModal/InfoModal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const TOKEN = localStorage.getItem("token") || "";

const TelaTarefas: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [onboarding, setOnboarding] = useState<any>(null);
    const [tarefasPadrao, setTarefasPadrao] = useState<any[]>([]);
    const [dtBegin, setDtBegin] = useState("");
    const [dtEnd, setDtEnd] = useState("");
    const [active, setActive] = useState(true);

    const [showModalEtapa, setShowModalEtapa] = useState<false | { step: any }>(false);
    const [showModalTarefa, setShowModalTarefa] = useState<number | null>(null);

    // ✅ estados separados
    const [confirmData, setConfirmData] = useState<{
        title?: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const resOnboarding = await fetch(`${API_BASE}/onboardings/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            const data = await resOnboarding.json();
            setOnboarding(data);
            setDtBegin(data.dt_begin);
            setDtEnd(data.dt_end);
            setActive(data.active);

            const resTasks = await fetch(`${API_BASE}/tasks`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            const allTasks = await resTasks.json();
            setTarefasPadrao(allTasks.filter((t: any) => t.standard));
        };
        fetchData();
    }, [id]);

    const handleSalvar = async () => {
        await fetch(`${API_BASE}/onboardings/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dt_begin: dtBegin, dt_end: dtEnd, active }),
        });
        setInfoMessage("Onboarding atualizado com sucesso!");
    };

    const handleDeletarOnboarding = async () => {
        await fetch(`${API_BASE}/onboardings/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        navigate("/homeGestor");
    };

    const handleCriarEtapa = async (etapa: any) => {
        await fetch(`${API_BASE}/onboardings/${id}/steps`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(etapa),
        });

        setInfoMessage("Etapa criada com sucesso!");
    };

    const handleCriarTarefa = async (stepId: number, name: string) => {
        await fetch(`${API_BASE}/steps/${stepId}/tasks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });
        setInfoMessage("Tarefa criada com sucesso!");
    };

    const handleDeletarEtapa = async (stepId: number) => {
        const step = onboarding.steps.find((s: any) => s.id === stepId);
        if (step?.inProgress) {
            setInfoMessage("Não é possível deletar uma etapa em progresso.");
            return;
        }
        await fetch(`${API_BASE}/onboardings/${id}/steps/${stepId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setOnboarding((prev: any) => ({
            ...prev,
            steps: prev.steps.filter((step: any) => step.id !== stepId),
        }));
        setInfoMessage("Etapa deletada com sucesso!");
    };

    const handleDeletarTarefa = async (stepId: number, taskId: number) => {
        await fetch(`${API_BASE}/steps/${stepId}/tasks/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
        });

        setOnboarding((prev: any) => ({
            ...prev,
            steps: prev.steps.map((step: any) => {
                if (step.id === stepId) {
                    return { ...step, tasks: step.tasks.filter((t: any) => t.id !== taskId) };
                }
                return step;
            }),
        }));

        setInfoMessage("Tarefa deletada com sucesso!");
    };

    const handleAtualizarEtapa = async (stepId: number, updatedStep: any) => {
        const step = onboarding.steps.find((s: any) => s.id === stepId);
        if (step?.inProgress && updatedStep.stepOrder !== step.stepOrder) {
            setInfoMessage("Não é possível alterar a ordem de uma etapa em progresso.");
            return;
        }
        await fetch(`${API_BASE}/steps/${stepId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedStep),
        });
        setOnboarding((prev: any) => ({
            ...prev,
            steps: prev.steps.map((step: any) =>
                step.id === stepId ? { ...step, ...updatedStep } : step
            ),
        }));
        setInfoMessage("Etapa atualizada com sucesso!");
    };


    if (!onboarding) return <div className="tela-wrapper"><p>Carregando...</p></div>;

    return (
        <div className="tela-wrapper">
            <div className="tela-card">
                <h2 className="titulo">Tarefas base</h2>
                <div className="tarefas-grid">
                    {tarefasPadrao.map((tarefa) => (
                        <div key={tarefa.id} className="tarefa-box">
                            <button
                                className="copiar-btn"
                                title="Copiar"
                                onClick={() => navigator.clipboard.writeText(tarefa.name)}
                            >
                                <IconCopyRegular />
                            </button>
                            <span className="tarefa-label">{tarefa.name}</span>
                        </div>
                    ))}
                </div>

                <h3 className="subtitulo">Edição de Onboarding</h3>
                <div className="bloco-roxo full-width">
                    <div className="bloco-header">
                        <span className="bloco-title">
                            Onboarding de {onboarding.collaborator?.name}
                        </span>
                        <button className="editar-btn" onClick={handleSalvar}>
                            Salvar alterações <IconEditRegular />
                        </button>
                        <button
                            className="apagar-btn"
                            onClick={() =>
                                setConfirmData({
                                    title: "Deletar onboarding",
                                    message: "Deseja realmente deletar este onboarding?",
                                    onConfirm: handleDeletarOnboarding,
                                })
                            }
                        >
                            Deletar onboarding
                        </button>
                    </div>
                    <div className="bloco-conteudo">
                        <label>Data de início:</label>
                        <input type="date" value={dtBegin} onChange={(e) => setDtBegin(e.target.value)} />
                        <label>Data de fim:</label>
                        <input type="date" value={dtEnd} onChange={(e) => setDtEnd(e.target.value)} />
                        <label>Status:</label>
                        <select value={active ? "ativo" : "inativo"} onChange={(e) => setActive(e.target.value === "ativo")}>
                            <option value="ativo">ativo</option>
                            <option value="inativo">inativo</option>
                        </select>
                        <p>Gestor: {onboarding.manager?.name}</p>
                        <p>Buddy: {onboarding.buddy?.name}</p>
                    </div>
                </div>

                {onboarding.steps
                    .sort((a: any, b: any) => a.orderStep - b.orderStep)
                    .map((step: any) => (
                        <div key={step.id} className="bloco-roxo full-width">
                            <div className="bloco-header">
                                <span className="bloco-title">{step.name}</span>
                                <div className="bloco-actions">
                                    <button
                                        className="editar-btn"
                                        onClick={() => setShowModalEtapa({ step })}
                                    >
                                        Editar <IconEditRegular />
                                    </button>
                                    <button
                                        className="apagar-btn"
                                        disabled={step.inProgress}
                                        title={step.inProgress ? "Etapa em progresso não pode ser deletada" : "Apagar etapa"}
                                        onClick={() =>
                                            setConfirmData({
                                                title: "Deletar etapa",
                                                message: "Deseja realmente deletar esta etapa?",
                                                onConfirm: () => handleDeletarEtapa(step.id),
                                            })
                                        }
                                    >
                                        Apagar etapa
                                    </button>
                                </div>
                            </div>
                            <p className="descricao-label">{step.description}</p>
                            <p className="tarefas-label">Tarefas</p>
                            <div className="tarefa-actions">
                                {step.tasks.map((task: any) => (
                                    <div key={task.id} className="tarefa-item">
                                        <span>{task.name}</span>
                                        <button
                                            className="apagar-btn"
                                            onClick={() =>
                                                setConfirmData({
                                                    title: "Deletar tarefa",
                                                    message: "Deseja realmente deletar esta tarefa?",
                                                    onConfirm: () => handleDeletarTarefa(step.id, task.id),
                                                })
                                            }
                                        >
                                            <IconTrashCanRegular size={20} color=" #e75480" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="criar-tarefa-pontilhado" onClick={() => setShowModalTarefa(step.id)}>
                                + Criar tarefa
                            </button>
                        </div>
                    ))}

                <div className="tarefa-actions">
                    <button className="criar-etapa-compacto" onClick={() => setShowModalEtapa(true)}>
                        + Criar etapa
                    </button>
                </div>
            </div>

            {showModalEtapa && showModalEtapa === true && (
                <ModalCriarEtapa
                    onClose={() => setShowModalEtapa(false)}
                    onCreate={handleCriarEtapa}
                />
            )}

            {showModalEtapa && typeof showModalEtapa === "object" && (
                <ModalCriarEtapa
                    onClose={() => setShowModalEtapa(false)}
                    onCreate={(updatedStep) => handleAtualizarEtapa(showModalEtapa.step.id, updatedStep)}
                    initialData={{
                        name: showModalEtapa.step.name,
                        description: showModalEtapa.step.description,
                        orderStep: showModalEtapa.step.orderStep,
                        inProgress: showModalEtapa.step.inProgress,
                    }}
                />
            )}

            {showModalTarefa && (
                <ModalCriarTarefa
                    onClose={() => setShowModalTarefa(null)}
                    onCreate={(name) => handleCriarTarefa(showModalTarefa, name)}
                />
            )}

            {/* Modal de confirmação */}
            {confirmData && (
                <ConfirmModal
                    isOpen={!!confirmData}
                    title={confirmData.title}
                    message={confirmData.message}
                    onConfirm={() => {
                        confirmData.onConfirm();
                        setConfirmData(null);
                    }}
                    onCancel={() => setConfirmData(null)}
                />
            )}

            {/* Modal de informação */}
            {infoMessage && (
                <InfoModal
                    message={infoMessage}
                    onClose={() => setInfoMessage(null)}
                />
            )}
        </div>
    );
};

export default TelaTarefas;
