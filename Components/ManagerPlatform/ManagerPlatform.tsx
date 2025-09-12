import React, { useState } from "react";
import "../ManagerPlatform/ManagerPlatform.css";
import CardButton from "../CardButton/CardButton";

type Plataforma = {
  id: number;
  nome: string;
  acessoLabel: string;
  modoAcessoClass: "buddy" | "link" | "liberado";
};

const initialEquipe: Plataforma[] = [
  {
    id: 1,
    nome: "Plataforma ABC",
    acessoLabel: "Fale com o seu buddy",
    modoAcessoClass: "buddy",
  },
  {
    id: 2,
    nome: "Plataforma CCB",
    acessoLabel: "Acesse o link da plataforma",
    modoAcessoClass: "link",
  },
];

const initialDisponiveis: Plataforma[] = [
  {
    id: 3,
    nome: "Plataforma IEVC",
    acessoLabel: "Acesso já liberado",
    modoAcessoClass: "liberado",
  },
  {
    id: 4,
    nome: "Plataforma XYZ",
    acessoLabel: "Fale com o seu buddy",
    modoAcessoClass: "buddy",
  },
  {
    id: 5,
    nome: "Plataforma IEVC",
    acessoLabel: "Acesso já liberado",
    modoAcessoClass: "liberado",
  },
  {
    id: 6,
    nome: "Plataforma XYZ",
    acessoLabel: "Fale com o seu buddy",
    modoAcessoClass: "buddy",
  },
];

export default function App() {
  const [equipe, setEquipe] = useState<Plataforma[]>(initialEquipe);
  const [disponiveis, setDisponiveis] =
    useState<Plataforma[]>(initialDisponiveis);
  const [busca, setBusca] = useState<string>("");
  const [novaPlataforma, setNovaPlataforma] = useState<string>("");

  const filtradas = disponiveis.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function adicionarPlataforma() {
    if (!novaPlataforma.trim()) return;
    const nova: Plataforma = {
      id: Date.now(),
      nome: novaPlataforma.trim(),
      acessoLabel: "Fale com o seu buddy",
      modoAcessoClass: "buddy",
    };
    setDisponiveis((old) => [nova, ...old]);
    setNovaPlataforma("");
  }

  function adicionarNaEquipe(id: number) {
    const plataforma = disponiveis.find((p) => p.id === id);
    if (!plataforma) return;
    if (equipe.find((p) => p.id === id)) return;
    setEquipe((old) => [...old, plataforma]);
  }

  return (
   
      <main>
        <section>
          <h2>Plataformas da equipe</h2>
          <div className="plataformas-equipe">
            {equipe.map((p) => (
              <CardButton
                key={p.id}
                titulo={p.nome}
                descricao={p.acessoLabel}
                link="#"
              />
            ))}
          </div>
        </section>

        <section>
          <h2>Todas as plataformas disponíveis</h2>
          <div className="busca-criar">
            <input
              type="text"
              placeholder="Digite o nome da plataforma que deseja buscar"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nome da nova plataforma"
              value={novaPlataforma}
              onChange={(e) => setNovaPlataforma(e.target.value)}
            />
            <button className="btn-criar" onClick={adicionarPlataforma}>
              + Criar plataforma
            </button>
          </div>

          <div className="plataformas-disponiveis">
            {filtradas.map((p) => (
              <CardButton
                key={p.id}
                titulo={p.nome}
                descricao={p.acessoLabel}
                link="#"
              />
            ))}
          </div>
        </section>
      </main>
   
  );
}
