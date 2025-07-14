import React, { useEffect, useState } from "react";
import CursoCard from "./CursosCard";


interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
}

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);

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

  return (
    <div className="plataformas-wrapper">
      <div className="margin">
        <div className="titulo">
          <h1>Seus cursos</h1>
        </div>

        <div className="grid">
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id}
              titulo={curso.titulo}
              descricao={curso.descricao}
              link={curso.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cursos;