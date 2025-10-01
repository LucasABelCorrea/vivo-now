import React, { useState, useEffect } from "react";
import "./ModalCriarEtapa.css";

interface EtapaData {
  name: string;
  description: string;
  orderStep: number;
  inProgress?: boolean;
}

interface Props {
  onClose: () => void;
  onCreate: (etapa: {
    name: string;
    description: string;
    orderStep: number;
    inProgress: boolean;
  }) => void;
  initialData?: EtapaData;
}

const ModalCriarEtapa: React.FC<Props> = ({ onClose, onCreate, initialData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [orderStep, setOrderStep] = useState(1);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setOrderStep(initialData.orderStep);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      orderStep,
      inProgress: false,
    });
    onClose(); // opcional: fechar após criar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialData ? "Editar etapa" : "Criar nova etapa"}</h3>
        <label>Nome da etapa:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da etapa"
        />
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva a etapa"
        />
        <label>Ordem da etapa:</label>
        <input
          type="number"
          value={orderStep}
          onChange={(e) => setOrderStep(Number(e.target.value))}
          min={1}
          disabled={!!initialData?.inProgress}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>
            {initialData ? "Salvar" : "Criar"}
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalCriarEtapa;
