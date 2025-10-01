import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TelaTarefas.css";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const TOKEN = localStorage.getItem("token") || "";
const TelaVisualizacaoOnboarding: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [onboarding, setOnboarding] = useState<any>(null);
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            const resOnboarding = await fetch(`${API_BASE}/onboardings/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            const data = await resOnboarding.json();
            setOnboarding(data);
        };
        fetchData();
    }, [id]);
    if (!onboarding) return <div className="tela-wrapper"><p>Carregando...</p></div>;
    return (
        <div className="tela-wrapper">
            <div className="tela-card">
                <h3 className="subtitulo">Visualização de Onboarding</h3>
                <div className="bloco-roxo full-width">
                    <div className="bloco-header">
                        <span className="bloco-title">
                            Onboarding de {onboarding.collaborator?.name}
                        </span>
                    </div>
                    <div className="bloco-conteudo">
                        <p>Data de início: {onboarding.dt_begin}</p>
                        <p>Data de fim: {onboarding.dt_end}</p>
                        <p>Status: {onboarding.active ? "ativo" : "inativo"}</p>
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
                            </div>
                            <div className="tarefa-actions">
                                {step.tasks.map((task: any) => (
                                    <div key={task.id} className="tarefa-item">
                                        <span>{task.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default TelaVisualizacaoOnboarding;