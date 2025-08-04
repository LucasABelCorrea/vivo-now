import React from 'react';
import { Text } from '@telefonica/mistica';
import './CursosCard.css';

type CursoCardProps = {
  titulo: string;
  descricao: string;
  link: string;
};

const CursoCard: React.FC<CursoCardProps> = ({ titulo, descricao, link }) => {
  return (
    <div className="card-curso">
      <div className="capa-curso">
        <Text color="textInverse" textAlign="center" weight="bold" size={24}>
          {titulo}
        </Text>
      </div>
      <div className="info">
        <Text color="textInverse">{descricao}</Text>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="link-curso"
      >
        Acessar curso
      </a>
    </div>
  );
};

export default CursoCard;
