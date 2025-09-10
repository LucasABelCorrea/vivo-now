import React from 'react';
import './RelatorioSemanal.css';
import {
  IconFaceSadRegular,
  IconFaceNeutralRegular,
  IconFaceHappyRegular,
  IconFaceSuperHappyRegular,
} from '@telefonica/mistica';

const humorLabels = ['Confuso(a)', 'Ok', 'Motivado(a)', 'Muito motivado(a)'];

const RelatorioSemanal: React.FC = () => {
  return (
    <div className="relatorio-wrapper">
      <div className="relatorio-card">
        <h2>Relatório semanal - dia 06/06</h2>

        <p className="question">Como você se sentiu essa semana?</p>

        <div className="humor-options">
          {[1, 2, 3, 4].map((level) => {
            const Icon =
              level === 1
                ? IconFaceSadRegular
                : level === 2
                ? IconFaceNeutralRegular
                : level === 3
                ? IconFaceHappyRegular
                : IconFaceSuperHappyRegular;

            return (
              <div key={level} className="humor-item">
                <button className="humor-button">
                  {React.createElement(Icon)}
                </button>
                <span className="humor-label">{humorLabels[level - 1]}</span>
              </div>
            );
          })}
        </div>

        <label>Teve alguma dúvida? Se ela não foi sanada, escreva-a aqui</label>
        <input type="text" placeholder="Resposta" />

        <label>Participou de evento de integração? Se sim, qual(is)?</label>
        <input type="text" placeholder="Resposta" />

        <label>Deseja acrescentar algum comentário?</label>
        <input type="text" placeholder="Resposta" />

        <button className="submit-button">Enviar relatório</button>
      </div>
    </div>
  );
};

export default RelatorioSemanal;




