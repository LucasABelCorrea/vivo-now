import React, { useState } from "react";
import "./ModalCriarOnboarding.css";

interface Props {
  gestor: any;
  token: string;
  apiBase: string;
  onClose: () => void;
}

 const ModalCriarOnboarding: React.FC<Props> = ({ gestor, token, apiBase, onClose }) => {
  const [dtBegin, setDtBegin] = useState("");
  const [dtEnd, setDtEnd] = useState("");
  const [newOnboardingId, setNewOnboardingId] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [onboardingCriado, setOnboardingCriado] = useState(false);
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
        alert("Erro ao criar onboarding");
        return;
      }
      const data = await res.json();
      setNewOnboardingId(data.id);
      setOnboardingCriado(true);
      // Buscar membros do time
      setLoadingTeam(true);
      const teamRes = await fetch(`${apiBase}/teams/${gestor.teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!teamRes.ok) {
        alert("Erro ao buscar membros do time");
        return;
      }
      const team = await teamRes.json();
      setTeamMembers(team.users || []);
      setLoadingTeam(false);
    } catch (err) {
      console.error("Erro ao criar onboarding:", err);
      alert("Erro inesperado");
    }
  };
  const handleAddUser = async (user: any) => {
    const confirmAdd = window.confirm(
      `Tem certeza que deseja incluir o usuário ${user.name}, ${user.role}, ID ${user.id} no 
onboarding?`
    );
    if (!confirmAdd || !newOnboardingId) return;
    try {
      console.log("Novo Onboarding ID:", newOnboardingId);
      const res = await fetch(`${apiBase}/onboardings/${newOnboardingId}/users/${user.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Usuário adicionado com sucesso!");
      } 
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
    }
  };
  return (
    <div className="modal-onboarding">
      <div className="modal-content">
        <h3>Criar novo onboarding</h3>
        {!onboardingCriado ? (
          <>
            <label>Data de início:</label>
            <input type="date" value={dtBegin} onChange={(e) => setDtBegin(e.target.value)} />
            <label>Data de fim:</label>
            <input type="date" value={dtEnd} onChange={(e) => setDtEnd(e.target.value)} />
            <button onClick={handleCreateOnboarding}>Criar</button>
          </>
        ) : (
          <>
            <p><strong>Onboarding criado com ID:</strong> {newOnboardingId}</p>
            <h4>Membros do time</h4>
            {loadingTeam ? (
              <p>Carregando membros...</p>
            ) : teamMembers.length > 0 ? (
              <ul>
                {teamMembers.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.role}){" "}
                    <button onClick={() => handleAddUser(user)}>Adicionar</button>
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
    </div>
  );
 };

export default ModalCriarOnboarding;
