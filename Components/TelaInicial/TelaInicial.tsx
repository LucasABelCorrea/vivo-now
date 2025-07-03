import React from 'react'
import "./TelaInicial.css"
import { useNavigate } from "react-router-dom";
import { Logo, ButtonPrimary } from "@telefonica/mistica";

const TelaInicial = () => {
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate("/login");
    }

  return (
    <div className="tela-container">
        <h1>VIVO NOW!</h1>
        <h2>Você Agora na Vivo</h2>
            <ButtonPrimary onPress={handleNavigateToLogin}
             style={{ width: '100%', marginTop: 16 }}
            >
      Entrar na Jornada
    </ButtonPrimary>
    </div>
  )
}

export default TelaInicial
