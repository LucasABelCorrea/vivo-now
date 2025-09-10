import React from 'react';
import './TelaTarefas.css';
import {
  IconCopyRegular,
  IconEditRegular,
  IconAlertRegular,
} from '@telefonica/mistica';

const tarefasBase: string[] = ['Tarefa 1', 'Tarefa 2', 'Tarefa 3'];
const tarefasEtapa: string[] = ['Curso sobre cultura da Vivo', 'Curso sobre cultura da Vivo'];

const TelaTarefas: React.FC = () => {
  return (
    <div className="tela-wrapper">
      <div className="tela-card">
        <h2 className="titulo">Tarefas base</h2>

        <div className="tarefas-grid">
          {tarefasBase.map((label, index) => (
            <div key={index} className="tarefa-box">
              <button className="copiar-btn" title="Copiar">
                <IconCopyRegular />
              </button>
              <span className="tarefa-label">{label}</span>
            </div>
          ))}
        </div>

        <h3 className="subtitulo">Edição de Onboarding</h3>

        <div className="bloco-roxo full-width">
          <div className="bloco-header">
            <span className="bloco-title">Onboarding de Eduarda Baltarino</span>
            <button className="editar-btn">
              Editar <IconEditRegular />
            </button>
          </div>
          <div className="bloco-conteudo">
            <p>Data de fim: 2023-09-25</p>
            <p>Status: <span className="ativo">ativo</span></p>
          </div>
        </div>

        <div className="bloco-roxo full-width">
          <div className="bloco-header">
            <span className="bloco-title">Etapa 1 - Nome da etapa</span>
            <div className="bloco-actions">
              <button className="editar-btn">Editar <IconEditRegular /></button>
              <button className="apagar-btn"><IconAlertRegular /></button>
            </div>
          </div>

          <p className="descricao-label">Descrição</p>
          <p className="tarefas-label">Tarefas</p>

          <div className="tarefa-actions">
            {tarefasEtapa.map((tarefa, index) => (
              <div key={index} className="tarefa-item">
                <span>{tarefa}</span>
                <IconAlertRegular />
              </div>
            ))}
          </div>

          <button className="criar-tarefa-pontilhado">+ Criar tarefa</button>
        </div>

        <div className="tarefa-actions">
          <button className="criar-etapa-compacto">+ Criar etapa</button>
        </div>
      </div>
    </div>
  );
};

export default TelaTarefas;



