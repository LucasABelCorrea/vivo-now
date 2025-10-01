import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TelaDeCarregamento.css";

const TelaDeCarregamento = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 1500); // tempo de exibição da tela (1.5s)

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="carregamento-container">
      <h1>VIVO NOW!</h1>
      <p>Carregando jornada...</p>
    </div>
  );
};

export default TelaDeCarregamento;
