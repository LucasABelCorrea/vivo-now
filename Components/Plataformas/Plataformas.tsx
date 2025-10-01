import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./Plataformas.css";
import CardButton from "../CardButton/CardButton";
import { PlataformaDTO } from "../../src/types/platformTypes";

const Plataformas: React.FC = () => {
  const [plataformas, setPlataformas] = useState<PlataformaDTO[]>([]);
  const [inputBusca, setInputBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE;
  
  useEffect(() => {
    const fetchPlataformasPorTime = async () => {
      const token = localStorage.getItem("token");
      const teamId = localStorage.getItem("teamId"); 

      if (!token || !teamId) {
        setErro("Usuário não está autenticado ou sem time definido.");
        setLoading(false);
        return;
      }

      try {
        // 1. Buscar o time
        const teamRes = await fetch(`${API_BASE}/teams/${teamId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!teamRes.ok) {
          throw new Error("Erro ao buscar dados do time.");
        }

        const teamData = await teamRes.json();
        const plataformaIds: number[] = teamData.platformIds || [];

        if (plataformaIds.length === 0) {
          setPlataformas([]);
          setLoading(false);
          return;
        }

        // 2. Buscar plataformas
        const promises = plataformaIds.map((id) =>
          fetch(`${API_BASE}/platforms/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Erro ao buscar plataforma ${id}`);
            }
            return res.json();
          })
        );

        const plataformasData = await Promise.all(promises);
        setPlataformas(plataformasData);
      } catch (error: any) {
        console.error("Erro ao buscar plataformas:", error);
        setErro(error.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchPlataformasPorTime();
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
              placeholder="Insira a plataforma"
              value={inputBusca}
              onChange={(e) => setInputBusca(e.target.value)}
            />
            <button onClick={() => setFiltro(inputBusca)} className="lupa">
              <CiSearch />
            </button>
          </div>
        </div>

        <div className="grid">
          {loading ? (
            <p>Carregando plataformas...</p>
          ) : erro ? (
            <p style={{ color: "red" }}>{erro}</p>
          ) : plataformasFiltradas.length > 0 ? (
            plataformasFiltradas.map((item) => (
              <CardButton
                key={item.id}
                titulo={item.name}
                descricao={item.type_access}
                link={item.url}
              />
            ))
          ) : (
            <p>Nenhuma plataforma encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plataformas;
