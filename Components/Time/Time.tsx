import React, { useEffect, useState } from "react";
import { LuPhone } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import "./Time.css";

interface UserDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  position: string;
  telephone: string;
  role: string;
  teamId: number;
  onboardingIds: number[];
}

interface TeamDTO {
  id: number;
  name: string;
  department: string;
  platformIds: number[];
  users: UserDTO[];
}
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE;

const getTeamById = async (teamId: string, token: string): Promise<TeamDTO> => {
  const response = await fetch(`${API_BASE}/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar membros do time");
  }

  const teamData: TeamDTO = await response.json();
  return teamData;
};

const Time: React.FC = () => {
  const [membros, setMembros] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const teamId = localStorage.getItem("teamId");
    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("userId"));

    if (!teamId || !token || !userId) {
      setErro("TeamId, token ou userId não encontrados no localStorage");
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(teamId, token);
        const outrosMembros = teamData.users.filter(
          (user) => user.id !== userId
        );
        setMembros(outrosMembros);
        setLoading(false);
      } catch (error: any) {
        setErro(error.message || "Erro desconhecido");
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) return <p>Carregando membros do time...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (membros.length === 0) return <p>Nenhum outro membro encontrado.</p>;

  return (
    <div className="time-wrapper">
      <h1>Seu time</h1>
      {membros.map((membro) => (
        <div key={membro.id} className="card-time">
          <div className="titulo">
            <span className="name">
              {membro.name} {membro.lastName} {`- ${membro.position}`}
            </span>
          </div>

          <div className="card-content">
            <a href={`tel:${membro.telephone.replace(/\D/g, "")}`}>
              <div className="contact">
                <LuPhone className="icon" />
                <span>{membro.telephone}</span>
              </div>
            </a>
            <a
              href={`mailto:${membro.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact">
                <TfiEmail className="icon" />
                <span>{membro.email}</span>
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Time;
