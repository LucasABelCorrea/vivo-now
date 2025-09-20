// ConfirmModal.tsx
import React from "react";
import "./ConfirmModal.css";

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirmação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {title && <h3>{title}</h3>}
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-confirmar" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
