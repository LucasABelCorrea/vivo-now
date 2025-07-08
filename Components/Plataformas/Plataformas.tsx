import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./Plataformas.css";

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
            <div key={item.id} className="card-plataforma">
              <div className="info">
                <h2>{item.name}</h2>
                <p>{item.type_access}</p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-plataforma"
              >
                Acessar plataforma
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plataformas;
