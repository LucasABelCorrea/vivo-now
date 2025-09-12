import React from "react";
import "./Onboarding.css";

interface CardEtapaInfoProps {
  tipo: "sem-etapas";
}

const CardEtapaInfo: React.FC<CardEtapaInfoProps> = () => (
  <div className="stage-card locked card-sem-etapas">
    <span>Sem mais etapas</span>
    <span style={{ marginTop: 8 }}>disponíveis</span>
  </div>
);

export default CardEtapaInfo;