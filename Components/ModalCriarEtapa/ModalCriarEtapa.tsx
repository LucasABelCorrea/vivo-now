import React, { useState } from "react";
import "./ModalCriarEtapa.css";
interface Props {
 onClose: () => void;
 onCreate: (etapa: { name: string; description: string; orderStep: number }) => void;
}
const ModalCriarEtapa: React.FC<Props> = ({ onClose, onCreate }) => {
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [orderStep, setOrderStep] = useState(1);
 const handleSubmit = () => {
 if (!name.trim()) return;
 onCreate({
 name: name.trim(),
 description: description.trim(),
 orderStep,
 });
 setName("");
 setDescription("");
 setOrderStep(1);
 onClose();
 };
 return (
 <div className="modal-overlay">
 <div className="modal-content">
 <h3>Criar nova etapa</h3>
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
 />
 <div className="modal-actions">
 <button onClick={handleSubmit}>Criar</button>
 <button onClick={onClose}>Cancelar</button>
 </div>
 </div>
 </div>
 );
};
export default ModalCriarEtapa;