import React from "react";
import { FaLock } from "react-icons/fa";
import "./Onboarding.css";

interface CardEtapaInfoProps {
  tipo: "bloqueado" | "sem-etapas";
  proximaEtapaNome?: string;
}

const CardEtapaInfo: React.FC<CardEtapaInfoProps> = ({ tipo, proximaEtapaNome }) => {
  if (tipo === "bloqueado") {
    return (
      <div className="stage-card locked card-bloqueado">
        <div style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
          Próxima etapa: {proximaEtapaNome}
        </div>
        <div style={{ margin: "12px 0" }}>
          <FaLock size={32} color="#fff" />
        </div>
        <div>Bloqueada</div>
      </div>
    );
  }

  // tipo === "sem-etapas"
  return (
    <div className="stage-card locked card-sem-etapas">
      <span>Sem mais etapas</span>
      <span style={{ marginTop: 8 }}>disponíveis</span>
    </div>
  );
};

export default CardEtapaInfo;