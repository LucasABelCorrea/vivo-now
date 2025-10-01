import React, { useEffect } from "react";
import "./TelaInicial.css";
import { useNavigate } from "react-router-dom";
import MyPrimaryButton from "../Button/MyPrimaryButton";

const TelaInicial = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const triggerResize = () => {
      window.dispatchEvent(new Event("resize"));
    };

    // Força recalculo após montagem
    setTimeout(triggerResize, 100);

    // Também força ao voltar para a aba
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        triggerResize();
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", triggerResize);
    };
  }, []);

  // Recarregamento automático ao voltar para a aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Aqui você pode executar qualquer lógica de atualização
        console.log("TelaInicial reativada — pronto para atualizar.");
        // Exemplo: fetch de dados, reset de estado, etc.
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="tela-container">
      <h1>VIVO NOW!</h1>
      <h2>Você Agora na Vivo</h2>

      <MyPrimaryButton onPress={handleNavigateToLogin}>
        Entrar na jornada
      </MyPrimaryButton>
    </div>
  );
};

export default TelaInicial;
