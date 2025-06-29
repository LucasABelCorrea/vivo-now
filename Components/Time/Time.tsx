import React, { useEffect, useState } from "react";
import { LuPhone } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import "./Time.css";

interface Usuario {
  id: number;
  name: string;
  email: string;
  telephone: string;
}

const Time: React.FC = () => {
  const [membros, setMembros] = useState<Usuario[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const teamId = localStorage.getItem("teamId"); // ou pegue do token, se preferir

    if (!token || !teamId) {
      console.warn("❗ Token ou teamId não encontrado.");
      return;
    }

    fetch(`http://localhost:8080/teams/${teamId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar time");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.users)) {
          setMembros(data.users);
        } else {
          console.warn("❗ Estrutura inesperada na resposta:", data);
        }
      })
      .catch((err) => console.error("Erro ao buscar membros do time:", err));
  }, []);

  return (
    <div className="time-wrapper">
      <h1>Seu time</h1>
      {membros.map((membro) => (
        <div key={membro.id} className="card">
          <div className="titulo">
            <span className="name">{membro.name}</span>
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
