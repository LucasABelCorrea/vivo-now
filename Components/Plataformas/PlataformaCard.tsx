import React from 'react';
import { Text } from '@telefonica/mistica';
import './PlataformaCard.css';

type PlataformaCardProps = {
  title: string;
  description: string;
  url: string;
};

const PlataformaCard: React.FC<PlataformaCardProps> = ({ title, description, url }) => {
  return (
    <a href={url} className="card-link" target="_blank" rel="noopener noreferrer">
      <div className="categoria-card-novo">
        <div className="info">
          <Text color="textInverse" size={18} weight="bold">{title}</Text>
          <Text color="textInverse" size={14}>{description}</Text>
        </div>
        <div>
          <button className="custom-btn">Acessar plataforma</button>
        </div>
      </div>
    </a>
  );
};

export default PlataformaCard;
