import React, { useEffect, useState } from "react";
import "./Onboarding.css";
import StageCard from "./StageCard";
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
} from "@telefonica/mistica";
import emailjs from "emailjs-com";
import MyHighlightedCard from '../Card/Card';
import MyPrimaryButton from '../Button/MyPrimaryButton';

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

type OnboardingDashboard = {
  user: {
    name: string;
    currentLevel: number;
    journeyDays: number;
  };
  stages: Step[];
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<OnboardingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const stored = localStorage.getItem("checklist");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newItem, setNewItem] = useState("");
  const [selectedHumor, setSelectedHumor] = useState("");
  const [duvida, setDuvida] = useState("");
  const [evento, setEvento] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    localStorage.setItem("checklist", JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    const mockData: OnboardingDashboard = {
      user: {
        name: "Lucas Correa",
        currentLevel: 3,
        journeyDays: 42,
      },
      stages: [
        {
          id: 1,
          title: "Bem-vindo à empresa",
          progress: 1,
          status: "active",
          checklist: [
            { id: 1, label: "Recebeu equipamento", completed: false },
            { id: 2, label: "Criou conta nos sistemas", completed: false },
          ],
        },
        {
          id: 2,
          title: "Conhecendo o time",
          progress: 0.6,
          status: "locked",
          checklist: [],
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

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
      usuario: data?.user.name ?? "Anônimo",
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

  return (
    <div className="onboarding-container">
      <div className="layout-onboarding">
        <div className="coluna-central">
          <h1 className="onboarding-title">Olá, {data.user.name}!</h1>
          <h2 className="onboarding-subtitle">Roadmap Onboarding</h2>

          <div className="cards-duplos">
            {data.stages.map((stage) => (
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

              <MyPrimaryButton
                onPress={handleAddItem}
                className="botao-etapa"
                style={{ marginTop: 1 }}
              >
                Adicionar
              </MyPrimaryButton>
            </div>

            {checklist.length > 0 && (
              <MyPrimaryButton
                onPress={handleConcluirEtapa}
                className="botao-etapa"
                style={{ marginTop: 12 }}
              >
                Concluir etapa
              </MyPrimaryButton>

            )}
          </div>

          <div className="categorias-grid">
            <MyHighlightedCard title="Chat" link="/chat" />
            <MyHighlightedCard title="Cursos" link="/cursos" />
            <MyHighlightedCard title="Plataformas" link="/plataformas" />
            <MyHighlightedCard title="Vivo Vibe" link="" />
          </div>
        </div>

        <div className="coluna-lateral">
          <div className="jornada">
            <div className="widget dias-jornada">
              <h3>Dias da jornada</h3>
              <p className="dias-jornada">{data.user.journeyDays}/90</p>
            </div>

            <div className="widget">
              <h3>Seu nível atual</h3>
              <div className="badge-nivel">Nível {data.user.currentLevel}</div>
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
                    className={`humor-icon ${selectedHumor === String(level) ? "selected" : ""
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

            <MyPrimaryButton
              onPress={handleEnviarRelatorio}
              className="botao-etapa"
              style={{ marginTop: 12 }}
            >
              Enviar relatório semanal
            </MyPrimaryButton>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;