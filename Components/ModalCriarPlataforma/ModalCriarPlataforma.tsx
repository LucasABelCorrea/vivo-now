 import React, { useState } from "react";
 import "./ModalCriarPlataforma.css";
 interface Props {
  apiBase: string;
  token: string;
  onClose: () => void;
  onCreated: (novaPlataforma: any) => void;
 }
 const ModalCriarPlataforma: React.FC<Props> = ({ apiBase, token, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [typeAccess, setTypeAccess] = useState("buddy");
  const [url, setUrl] = useState("");
  const handleSubmit = async () => {
    if (!name.trim() || !url.trim()) return;
    try {
      const res = await fetch(`${apiBase}/platforms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type_access: typeAccess, url }),
      });
      if (!res.ok) {
        alert("Erro ao criar plataforma");
        return;
      }
      const nova = await res.json();
      onCreated(nova);
      onClose();
    } catch (err) {
      console.error("Erro ao criar plataforma:", err);
    }
  };
  return (
    <div className="modal-plataforma">
      <div className="modal-content">
        <h3>Nova Plataforma</h3>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>URL:</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        <label>Tipo de acesso:</label>
        <select value={typeAccess} onChange={(e) => setTypeAccess(e.target.value)}>
          <option value="buddy">Fale com o seu buddy</option>
          <option value="link">Acesse o link da plataforma</option>
          <option value="liberado">Acesso já liberado</option>
        </select>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Criar</button>
          <button onClick={onClose}>Cancelar</button>
 </div>
 </div>
 </div>
  );
 };
 export default ModalCriarPlataforma;