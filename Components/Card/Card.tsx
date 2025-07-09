// Components/Card/Card.tsx
import React from 'react';
import { Text } from '@telefonica/mistica';
import './Card.css';

type MyHighlightedCardProps = {
  title: string;
  link: string;
};

const MyHighlightedCard: React.FC<MyHighlightedCardProps> = ({ title, link }) => {
  return (
    <a href={link} className="card-link">
      <div className="categoria-card">
        <Text color="textInverse" size={18} weight="bold">
          {title}
        </Text>
      </div>
    </a>
  );
};

export default MyHighlightedCard;
