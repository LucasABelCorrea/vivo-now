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
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn(
        "⚠️ Nenhum token encontrado. Usuário pode não estar autenticado."
      );
      return;
    }

    fetch("http://localhost:8080/platforms", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Plataformas carregadas:", data);
        setPlataformas(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar plataformas:", err);
      });
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
