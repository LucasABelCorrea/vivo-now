import React from "react";
import "../ConfirmModal/ConfirmModal.css"; 

interface InfoModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title = "Confirmação", message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions" style={{ justifyContent: "center" }}>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
