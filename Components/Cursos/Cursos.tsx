import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./Cursos.css";

interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
}

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [inputBusca, setInputBusca] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const mockCursos: Curso[] = [
      {
        id: "1",
        titulo: "Alura",
        descricao: "Aprenda no maior ecossistema tech do país",
        link: "https://exemplo.com/ui-design",
      },
      {
        id: "2",
        titulo: "EduTech",
        descricao: "Educação tecnológica de excelência",
        link: "https://exemplo.com/react-avancado",
      },
      {
        id: "3",
        titulo: "Plataforma 03",
        descricao: "A melhor plataforma 03 que existe",
        link: "https://exemplo.com/ux-writing",
      },
    ];

    setCursos(mockCursos);
  }, []);

  const cursosFiltrados = cursos.filter((curso) =>
    curso.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="plataformas-wrapper">
      <div className="margin">
        <div className="titulo">
          <h1>Seus cursos</h1>
        </div>

        <div className="grid">
          {cursosFiltrados.map((curso) => (
            <div key={curso.id} className="card-curso">
              <div className="capa-curso">
                <h2>{curso.titulo}</h2>
              </div>
              <div className="info">
                <p>{curso.descricao}</p>
              </div>
              <a
                href={curso.link}
                target="_blank"
                rel="noopener noreferrer"
                className="link-curso"
              >
                Acessar curso
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cursos;
