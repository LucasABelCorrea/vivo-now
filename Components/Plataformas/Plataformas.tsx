import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./Plataformas.css";

interface Plataforma {
  id: string;
  titulo: string;
  descricao: string,
  plataforma: string;
}

const Plataformas: React.FC = () => {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [inputBusca, setInputBusca] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const mockPlataformas: Plataforma[] = [
      {
        id: "1",
        titulo: "Plataforma ABC",
        descricao: "Descrição legal",
        plataforma: "linkA",
      },
      {
        id: "2",
        titulo: "Plataforma DEF",
        descricao: "Descrição legal",
        plataforma: "linkB",
      },
      {
        id: "3",
        titulo: "Plataforma GHI",
        descricao: "Descrição legal",
        plataforma: "linkC",
      },
    ];

    setPlataformas(mockPlataformas);

    // API real:
    /*
    fetch("https://sua-api.com/plataformas")
      .then((res) => res.json())
      .then((data) => setPlataformas(data))
      .catch((err) => console.error("Erro ao carregar plataformas:", err));
    */
  }, []);

  const plataformasFiltradas = plataformas.filter((item) =>
    item.titulo.toLowerCase().includes(filtro.toLowerCase())
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
                <h2>{item.titulo}</h2>
                <p>{item.descricao}</p>
              </div>
              <a
                href={item.plataforma}
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
