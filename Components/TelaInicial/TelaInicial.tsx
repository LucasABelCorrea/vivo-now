import React from 'react'
import Button from '../Button/Button'
import "./TelaInicial.css"
import { useNavigate } from "react-router-dom";
import { Logo } from "@telefonica/mistica";

const TelaInicial = () => {
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate("/login");
    }

  return (
    <div className="tela-container">
        <h1>VIVO NOW!</h1>
        <h2>Você Agora na Vivo</h2>
        <Button onClick={handleNavigateToLogin}>Entrar na Jornada</Button>
    </div>
  )
}

export default TelaInicial
