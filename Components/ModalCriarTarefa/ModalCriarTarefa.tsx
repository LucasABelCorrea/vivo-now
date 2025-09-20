import React, { useState } from "react";
import "./ModalCriarTarefa.css";
interface Props {
 onClose: () => void;
 onCreate: (name: string) => void;
}
const ModalCriarTarefa: React.FC<Props> = ({ onClose, onCreate }) => {
 const [name, setName] = useState("");
 const handleSubmit = () => {
 if (!name.trim()) return;
 onCreate(name.trim());
 setName("");
 onClose();
 };
 return (
 <div className="modal-overlay">
 <div className="modal-content">
 <h3>Criar nova tarefa</h3>
 <label>Nome da tarefa:</label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Digite o nome da tarefa"
 />
 <div className="modal-actions">
 <button onClick={handleSubmit}>Criar</button>
 <button onClick={onClose}>Cancelar</button>
 </div>
 </div>
 </div>
 );
};
export default ModalCriarTarefa;