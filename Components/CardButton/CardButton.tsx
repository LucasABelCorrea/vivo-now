import React from 'react';
import { Text } from '@telefonica/mistica';
import './CardButton.css';

type CursoCardProps = {
  titulo: string;
  descricao: string;
  link: string;
};

const CardButton: React.FC<CursoCardProps> = ({ titulo, descricao, link }) => {
  return (
    <div className="card-button">
      <div className="capa-button">
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
        className="link-button"
      >
        Acessar curso
      </a>
    </div>
  );
};

export default CardButton;
