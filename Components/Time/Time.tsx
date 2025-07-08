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
    // Dados mockados para testes
    const mockMembros: Usuario[] = [
      {
        id: 1,
        name: "Lucas Correa",
        email: "lucas.correa@empresa.com",
        telephone: "(11) 91234-5678",
      },
      {
        id: 2,
        name: "Ana Beatriz",
        email: "ana.beatriz@empresa.com",
        telephone: "(21) 99876-5432",
      },
    ];

    // Simula carregamento assíncrono
    setTimeout(() => {
      setMembros(mockMembros);
    }, 500);
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
