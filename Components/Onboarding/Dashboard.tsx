import React, { useEffect, useState } from "react";
import "./Onboarding.css";
import StageCard from "./StageCard";
import { ButtonPrimary } from "@telefonica/mistica";
import emailjs from "emailjs-com";

type ChecklistItem = {
  id: number;
  label: string;
  completed: boolean;
};

type Step = {
  id: number;
  title: string;
  progress: number;
  status: "active" | "locked" | "completed";
  checklist: ChecklistItem[];
};

type OnboardingAPIResponse = {
  id: number;
  dt_begin: string;
  dt_end: string;
  active: boolean;
  manager: any;
  buddy: any;
  collaborator: any;
  steps: Step[];
  reports: any[];
  currentStep: Step | null;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<OnboardingAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [selectedHumor, setSelectedHumor] = useState("");
  const [duvida, setDuvida] = useState("");
  const [evento, setEvento] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const onboardingId = 1; // 🔧 você pode tornar isso dinâmico depois

    if (!token) {
      setErro("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/onboardings/${onboardingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: OnboardingAPIResponse) => {
        setData(data);
        setChecklist(data.currentStep?.checklist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do onboarding:", err);
        setErro("Erro ao carregar dados do onboarding.");
        setLoading(false);
      });
  }, []);

  const calcularDiasDeJornada = (dt_begin: string): number => {
    const inicio = new Date(dt_begin);
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleToggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setChecklist((prev) => [
        ...prev,
        { id: Date.now(), label: newItem.trim(), completed: false },
      ]);
      setNewItem("");
    }
  };

  const handleConcluirEtapa = () => {
    setChecklist((prev) => prev.filter((item) => !item.completed));
  };

  const handleEnviarRelatorio = () => {
    const templateParams = {
      usuario: "Colaborador",
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
      });
  };

  if (loading) return <p className="loading">Carregando onboarding...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (!data) return <p className="empty">Dados não encontrados.</p>;

  const diasDeJornada = calcularDiasDeJornada(data.dt_begin);

  return (
    <div className="onboarding-container">
      <div className="layout-onboarding">
        <div className="coluna-central">
          <h1 className="onboarding-title">Olá!</h1>
          <h2 className="onboarding-subtitle">Roadmap Onboarding</h2>

          <div className="cards-duplos">
            {data.steps.map((stage) => (
              <StageCard key={stage.id} stage={stage} />
            ))}
          </div>

          <div className="checklist-wrapper">
            {checklist.length > 0 ? (
              <ul className="checklist checklist-independente">
                {checklist.map((item) => (
                  <li key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleItem(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="checklist-vazia">Nenhum item adicionado ainda.</p>
            )}

            <div className="checklist-add">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Adicionar novo item"
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
              <ButtonPrimary
                onPress={handleAddItem}
                className="botao-etapa"
                style={{ marginTop: 8 }}
              >
                Adicionar
              </ButtonPrimary>
            </div>

            {checklist.length > 0 && (
              <ButtonPrimary
                onPress={handleConcluirEtapa}
                className="botao-etapa"
                style={{ marginTop: 12 }}
              >
                Concluir etapa
              </ButtonPrimary>
            )}
          </div>

          <div className="categorias-grid">
            <a href="/chat">
              <div className="categoria-card">Chat</div>
            </a>
            <a href="/cursos">
              <div className="categoria-card">Cursos</div>
            </a>
            <a href="/plataformas">
              <div className="categoria-card">Plataformas</div>
            </a>
            <a href="">
              <div className="categoria-card">Vivo Vibe</div>
            </a>
          </div>
        </div>

        <div className="coluna-lateral">
          <div className="jornada">
            <div className="widget dias-jornada">
              <h3>Dias da jornada</h3>
              <p className="dias-jornada">{diasDeJornada}/90</p>
            </div>

            <div className="widget">
              <h3>Seu nível atual</h3>
              <div className="badge-nivel">
                Nível {data.currentStep?.id ?? "--"}
              </div>
            </div>
          </div>

          <div className="widget">
            <h3>Resumo semanal</h3>

            <div className="humor-options">
              {["Confuso(a)", "Motivado(a)"].map((option) => (
                <label
                  key={option}
                  className={selectedHumor === option ? "selected" : ""}
                  onClick={() => setSelectedHumor(option)}
                >
                  <input
                    type="radio"
                    name="humor"
                    value={option}
                    checked={selectedHumor === option}
                    onChange={() => setSelectedHumor(option)}
                    style={{ display: "none" }}
                  />
                  {option}
                </label>
              ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
