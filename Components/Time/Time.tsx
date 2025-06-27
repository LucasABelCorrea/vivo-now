import React, { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import "./Time.css";

interface Membro {
  foto: string;
  id: string;
  nome: string;
  telefone: string;
  email: string;
  linkedin: string;
  link_linkedin: string;
}

const Time: React.FC = () => {
  const [membros, setMembros] = useState<Membro[]>([]);

  useEffect(() => {
    // 🧪 Dados fictícios para exibição inicial:
    const mockMembros: Membro[] = [
      {
        foto: "/public/images/img apresentação.png",
        id: "1",
        nome: "Lucas Correa",
        telefone: "+55 (11) 94995-3231",
        email: "lucasbel.correa@gmail.com",
        linkedin: "Lucas Bel",
        link_linkedin: "https://www.linkedin.com/in/lucasbel/",
      },
      {
        foto: "/public/images/img_apresentação-removebg-preview.png",
        id: "2",
        nome: "Jhonatam Jesus",
        telefone: "+55 (11) 96946-1521",
        email: "jhowsesus@vivo.com",
        linkedin: "Jhonatam Pro",
        link_linkedin: "https://linkedin.com/in/jhonatham-jesus-724953259",
      },
    ];

    setMembros(mockMembros);

    // 🔌 Quando a API estiver disponível, substitua pela chamada real:
    /*
    fetch("https://sua-api.com/time")
      .then((res) => res.json())
      .then((data) => setMembros(data))
      .catch((err) => console.error("Erro ao buscar time:", err));
    */
  }, []);

  return (
    <div className="time-wrapper">
      <h1>Seu time</h1>
      {membros.map((membro) => (
        <div key={membro.id} className="card">
          <div className="titulo">
            <img
              className="avatar"
              src={membro.foto}
              alt={`Foto de perfil de ${membro.nome}`}
            />
            <span className="name">{membro.nome}</span>
          </div>

          <div className="card-content">
            <a href={`tel:${membro.telefone.replace(/\D/g, "")}`}>
              <div className="contact">
                <LuPhone className="icon" />
                <span>{membro.telefone}</span>
              </div>
            </a>
            <a href={`mailto:${membro.email}`} target="blank">
              <div className="contact">
                <TfiEmail className="icon" />
                <span>{membro.email}</span>
              </div>
            </a>
            <a href={membro.link_linkedin} target="blank">
              <div className="contact">
                <FaLinkedin className="icon" />
                <span>{membro.linkedin}</span>
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Time;
