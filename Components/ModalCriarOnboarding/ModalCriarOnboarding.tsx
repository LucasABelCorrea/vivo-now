import React, { useState } from "react";
import "./ModalCriarOnboarding.css";
import ConfirmModal from "./ConfirmModalOnboarding";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  gestor: any;
  token: string;
  apiBase: string;
  onClose: () => void;
}

const ModalCriarOnboarding: React.FC<Props> = ({
  gestor,
  token,
  apiBase,
  onClose,
}) => {
  const [dtBegin, setDtBegin] = useState("");
  const [dtEnd, setDtEnd] = useState("");
  const [newOnboardingId, setNewOnboardingId] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [onboardingCriado, setOnboardingCriado] = useState(false);
  const [confirmUser, setConfirmUser] = useState<any | null>(null);

  const handleCreateOnboarding = async () => {
    try {
      const res = await fetch(`${apiBase}/onboardings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dt_begin: dtBegin,
          dt_end: dtEnd,
          active: true,
        }),
      });

      if (!res.ok) {
        toast.error("Erro ao criar onboarding");
        return;
      }

      const data = await res.json();
      setNewOnboardingId(data.id);
      setOnboardingCriado(true);
      setDtBegin("");
      setDtEnd("");
      toast.success("Onboarding criado com sucesso!");

      setLoadingTeam(true);
      const teamRes = await fetch(`${apiBase}/teams/${gestor.teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!teamRes.ok) {
        toast.error("Erro ao buscar membros do time");
        setLoadingTeam(false);
        return;
      }

      const team = await teamRes.json();
      setTeamMembers(team.users || []);
      setLoadingTeam(false);
    } catch (err) {
      console.error("Erro ao criar onboarding:", err);
      toast.error("Erro inesperado ao criar onboarding");
      setLoadingTeam(false);
    }
  };

  const handleAddUser = (user: any) => {
    setConfirmUser(user);
  };

  const confirmAddUser = async () => {
    if (!confirmUser || !newOnboardingId) return;
    try {
      const res = await fetch(
        `${apiBase}/onboardings/${newOnboardingId}/users/${confirmUser.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        toast.success("Usuário adicionado com sucesso!");
      } else {
        toast.error("Erro ao adicionar usuário.");
      }
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
      toast.error("Erro inesperado ao adicionar usuário");
    } finally {
      setConfirmUser(null);
    }
  };

  return (
    <div className="modal-onboarding">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="modal-content">
        <h3>Criar novo onboarding</h3>

        {!onboardingCriado ? (
          <>
            <label>Data de início:</label>
            <input
              type="date"
              value={dtBegin}
              onChange={(e) => setDtBegin(e.target.value)}
            />
            <label>Data de fim:</label>
            <input
              type="date"
              value={dtEnd}
              onChange={(e) => setDtEnd(e.target.value)}
            />
            <button onClick={handleCreateOnboarding}>Criar</button>
          </>
        ) : (
          <>
            <p>
              <strong>Onboarding criado com ID:</strong> {newOnboardingId}
            </p>
            <h4>Membros do time</h4>
            {loadingTeam ? (
              <p>Carregando membros...</p>
            ) : teamMembers.length > 0 ? (
              <ul>
                {teamMembers.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.role}){" "}
                    <button onClick={() => handleAddUser(user)}>
                      Adicionar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum membro encontrado.</p>
            )}
          </>
        )}

        <button onClick={onClose}>Fechar</button>
      </div>

      {confirmUser && (
        <ConfirmModal
          isOpen={true}
          title="Adicionar usuário"
          message={`Tem certeza que deseja incluir o usuário ${confirmUser.name}, ${confirmUser.role}, ID ${confirmUser.id} no onboarding?`}
          confirmText="Adicionar"
          cancelText="Cancelar"
          onConfirm={confirmAddUser}
          onCancel={() => setConfirmUser(null)}
        />
      )}
    </div>
  );
};

export default ModalCriarOnboarding;
