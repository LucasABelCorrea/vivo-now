import React from "react";
import "./Button.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string; // <- permite personalizar estilo externo
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => (
  <button
    className={`gradient-button ${className}`} // permite sobrescrever/estender o estilo
    onClick={onClick}
    type={type}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
