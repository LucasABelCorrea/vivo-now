import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RelatorioSemanal.css";
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
} from "@telefonica/mistica";
const humorLabels = ["Confuso(a)", "Ok", "Motivado(a)", "Muito motivado(a)"];
const humorIcons = [
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
];
const RelatorioSemanal: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state?.report;
  if (!report) {
    return (
      <div className="relatorio-wrapper-">
        <div className="relatorio-card">
          <p>Relatório não encontrado.</p>
          <button className="submit-button" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }
  const Icon = humorIcons[report.feeling - 1];
  return (
    <div className="relatorio-wrapper">
      <div className="relatorio-card">
        <h2>Relatório semanal - dia {report.createdAt}</h2>
        <p className="question">Como você se sentiu essa semana?</p>
        <div className="humor-options-relatorio">
          <div className="humor-item-relatorio">
            <div className="humor-button-relatorio">
              {React.createElement(Icon)}
            </div>
            <span className="humor-label-relatorio">
              {humorLabels[report.feeling - 1]}
            </span>
          </div>
        </div>
        <label>Dúvidas não sanadas:</label>
        <textarea
          value={report.question}
          readOnly
          className="relatorio-textarea"
        />

        <label>Eventos de integração:</label>
        <textarea
          value={report.event}
          readOnly
          className="relatorio-textarea"
        />

        <label>Comentário adicional:</label>
        <textarea
          value={report.comment}
          readOnly
          className="relatorio-textarea"
        />

        <button className="submit-button" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
};
export default RelatorioSemanal;
