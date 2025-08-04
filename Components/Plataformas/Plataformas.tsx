import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./Plataformas.css";
import PlataformaCard from './PlataformaCard';

interface Plataforma {
  id: string;
  name: string;
  type_access: string;
  url: string;
}

const Plataformas: React.FC = () => {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [inputBusca, setInputBusca] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // Simula carregamento de dados mockados
    const mockData: Plataforma[] = [
      {
        id: "1",
        name: "Plataforma de Cursos",
        type_access: "Acesso via SSO",
        url: "https://cursos.exemplo.com",
      },
      {
        id: "2",
        name: "Portal RH",
        type_access: "Login com email",
        url: "https://rh.exemplo.com",
      },
      {
        id: "3",
        name: "Ferramenta de Projetos",
        type_access: "Acesso direto",
        url: "https://projetos.exemplo.com",
      },
      {
        id: "4",
        name: "Intranet",
        type_access: "Acesso via VPN",
        url: "https://intranet.exemplo.com",
      },
    ];

    setTimeout(() => {
      setPlataformas(mockData);
    }, 500);
  }, []);

  const plataformasFiltradas = plataformas.filter((item) =>
    item.name?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="plataformas-wrapper">
      <div className="margin">
        <div className="titulo">
          <h1>Suas plataformas</h1>
          <div className="campo-busca">
            <input
              type="text"
              placeholder="Insira a plataforma que deseja buscar"
              value={inputBusca}
              onChange={(e) => setInputBusca(e.target.value)}
            />
            <button onClick={() => setFiltro(inputBusca)} className="lupa">
              <CiSearch />
            </button>
          </div>
        </div>

        <div className="grid">
          {plataformasFiltradas.map((item) => (
            <PlataformaCard
              key={item.id}
              title={item.name}
              description={item.type_access}
              url={item.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plataformas;
