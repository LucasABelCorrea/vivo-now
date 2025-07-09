import React from 'react'
import "./TelaInicial.css"
import { useNavigate } from "react-router-dom";
import MyPrimaryButton from '../Button/MyPrimaryButton';

const TelaInicial = () => {
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate("/login");
    }

  return (
    <div className="tela-container">
        <h1>VIVO NOW!</h1>
        <h2>Você Agora na Vivo</h2>
            
            <MyPrimaryButton onPress={handleNavigateToLogin}
            >Entrar na jornada</MyPrimaryButton>
    </div>
  )
}

export default TelaInicial
