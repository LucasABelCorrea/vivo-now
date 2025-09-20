import React, { useEffect, useState } from "react";
import "../ManagerPlatform/ManagerPlatform.css";
import CardButton from "../CardButton/CardButton";
import ModalCriarPlataforma from "../ModalCriarPlataforma/ModalCriarPlataforma";
import { IconTrashCanRegular } from "@telefonica/mistica";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import InfoModal from "../InfoModal/InfoModal";

type Plataforma = {
  id: number;
  name: string;
  type_access: string;
  url: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const TOKEN = localStorage.getItem("token") || "";
const teamId = localStorage.getItem("teamId");

export default function ManagerPlatform() {
  const [equipe, setEquipe] = useState<Plataforma[]>([]);
  const [disponiveis, setDisponiveis] = useState<Plataforma[]>([]);
  const [busca, setBusca] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // ✅ estados para os modais
  const [confirmData, setConfirmData] = useState<{
    title?: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      console.error("teamId não encontrado no localStorage");
      return;
    }
    const fetchPlataformas = async () => {
      try {
        const teamRes = await fetch(`${API_BASE}/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const team = await teamRes.json();
        const platformIds: number[] = team.platformIds || [];

        const equipePlataformas = await Promise.all(
          platformIds.map(async (id) => {
            const res = await fetch(`${API_BASE}/platforms/${id}`, {
              headers: { Authorization: `Bearer ${TOKEN}` },
            });
            return res.ok ? await res.json() : null;
          })
        );
        setEquipe(equipePlataformas.filter(Boolean));

        const allRes = await fetch(`${API_BASE}/platforms`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const todas = await allRes.json();
        const disponiveisFiltradas = todas.filter(
          (p: Plataforma) => !platformIds.includes(p.id)
        );
        setDisponiveis(disponiveisFiltradas);
      } catch (err) {
        console.error("Erro ao carregar plataformas:", err);
        setInfoMessage("Erro ao carregar plataformas.");
      }
    };
    fetchPlataformas();
  }, []);

  const filtradas = disponiveis.filter((p) =>
    p.name.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarNaEquipe = async (id: number) => {
    if (!teamId) return;
    try {
      const res = await fetch(`${API_BASE}/teams/${teamId}/platforms/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (res.ok) {
        const plataforma = disponiveis.find((p) => p.id === id);
        if (plataforma) {
          setEquipe((old) => [...old, plataforma]);
          setDisponiveis((old) => old.filter((p) => p.id !== id));
        }
        setInfoMessage("Plataforma adicionada com sucesso!");
      } else {
        setInfoMessage("Erro ao adicionar à equipe.");
      }
    } catch (err) {
      console.error("Erro ao adicionar plataforma:", err);
      setInfoMessage("Erro inesperado ao adicionar plataforma.");
    }
  };

  const removerDaEquipe = (id: number) => {
    setConfirmData({
      title: "Remover plataforma",
      message: "Deseja remover esta plataforma da equipe?",
      onConfirm: async () => {
        if (!teamId) return;
        try {
          const res = await fetch(`${API_BASE}/teams/${teamId}/platforms/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}` },
          });
          if (res.ok) {
            const plataforma = equipe.find((p) => p.id === id);
            if (plataforma) {
              setDisponiveis((old) => [...old, plataforma]);
              setEquipe((old) => old.filter((p) => p.id !== id));
            }
            setInfoMessage("Plataforma removida com sucesso!");
          } else {
            setInfoMessage("Erro ao remover da equipe.");
          }
        } catch (err) {
          console.error("Erro ao remover plataforma:", err);
          setInfoMessage("Erro inesperado ao remover plataforma.");
        }
      },
    });
  };

  return (
    <main className="manager-platform">
      <section>
        <h2 className="manager-titulo">Plataformas da equipe</h2>
        <div className="plataformas-equipe">
          {equipe.length === 0 ? (
            <p>Nenhuma plataforma associada à equipe.</p>
          ) : (
            equipe.map((p) => (
              <div className="card-managerPlataforma-button" key={p.id}>
                <CardButton descricao={p.type_access} titulo={p.name} link={p.url} />
                <button
                  className="btn-remover-managerPlataforma"
                  onClick={() => removerDaEquipe(p.id)}
                >
                  <IconTrashCanRegular size={20} color=" #e75480" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2>Todas as plataformas disponíveis</h2>
        <div className="busca-criar">
          <input
            type="text"
            placeholder="Buscar plataforma"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            className="btn-criar-Plataformas"
            onClick={() => setShowModal(true)}
          >
            + Criar plataforma
          </button>
        </div>
        <div className="plataformas-disponiveis">
          {filtradas.length === 0 ? (
            <p>Nenhuma plataforma disponível no momento.</p>
          ) : (
            filtradas.map((p) => (
              <div className="card-managerPlataforma-button" key={p.id}>
                <CardButton descricao={p.type_access} titulo={p.name} link={p.url} />
                <button
                  className="btn-adicionar-plataforma"
                  onClick={() => adicionarNaEquipe(p.id)}
                >
                  + Adicionar à equipe
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <ModalCriarPlataforma
          apiBase={API_BASE}
          token={TOKEN}
          onClose={() => setShowModal(false)}
          onCreated={(nova) => setDisponiveis((old) => [nova, ...old])}
        />
      )}

      {/* ✅ Modais */}
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
      {infoMessage && (
        <InfoModal
          message={infoMessage}
          onClose={() => setInfoMessage(null)}
        />
      )}
    </main>
  );
}
