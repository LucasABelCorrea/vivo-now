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
import emailjs from "emailjs-com";
import { Onboarding, StepDTO, TaskDTO } from "../../src/types/onboardingTypes";

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
        // Buscar dados do usuário
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
        
        const userData = await userResponse.json();
        
        const teamId: string = userData.teamId;
        localStorage.setItem ("teamId", teamId);
        
        const onboardingIds: number[] = userData.onboardingIds || [];

        if (onboardingIds.length === 0) {
          setError("Nenhum onboarding encontrado para o usuário.");
          setLoading(false);
          return;
        }

        // Para simplicidade, pegar o primeiro onboarding
        const onboardingId = onboardingIds[0];

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

        setData(onboardingData);

        // Atualiza checklist com as tasks do currentStep
        setChecklist(onboardingData.currentStep?.task || []);

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleConcluirEtapa = () => {
    setChecklist((prev) => prev.filter((item) => !item.completed));
  };

  const handleEnviarRelatorio = () => {
    const templateParams = {
      usuario: data?.collaborator?.name ?? "Anônimo",
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
  if (error) return <p className="erro">{error}</p>;
  if (!data) return <p className="empty">Dados não encontrados.</p>;

  return (
    <div className="onboarding-container">
      <div className="layout-onboarding">
        <div className="coluna-central">
          <h1 className="onboarding-title">
            Olá, {data.collaborator?.name} {data.collaborator?.lastName}!
          </h1>
          <h2 className="onboarding-subtitle">Roadmap Onboarding</h2>

          <div className="cards-duplos">
            {data.steps.map((step) => (
              <StageCard key={step.id} step={step} status="active" />
            ))}
          </div>

          <div className="checklist-wrapper">
            <Box padding={16}>
              {checklist.length > 0 ? (
                <div className="checklist-custom">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`checklist-item ${
                        item.completed ? "completed" : ""
                      }`}
                      style={{ maxWidth: "400px" }}
                    >
                      <Checkbox
                        name={`checkbox-${item.id}`}
                        checked={item.completed}
                        onChange={() => handleToggleItem(item.id)}
                      >
                        <span className="checkbox-label">{item.name}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              ) : (
                <Text> Nenhum item disponível. </Text>
              )}

              {checklist.length > 0 && (
                <ButtonPrimary
                  onPress={handleConcluirEtapa}
                  className="botao-etapa"
                  style={{ marginTop: 12 }}
                >
                  Concluir etapa
                </ButtonPrimary>
              )}
            </Box>
          </div>

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
            <div className="widget dias-jornada">
              <h3>Dias da jornada</h3>
              <p className="dias-jornada">
                {data.dt_begin} até {data.dt_end}
              </p>
            </div>

            <div className="widget">
              <h3>Seu nível atual</h3>
              {/* Aqui você pode calcular nível com base na ordem da currentStep */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
