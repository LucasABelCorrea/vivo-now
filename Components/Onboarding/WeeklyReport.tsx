import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Onboarding.css";
import Button from "../Button/Button";

const WeeklyReport: React.FC = () => {
  const [formData, setFormData] = useState({
    humor: "",
    progresso: "",
    dificuldades: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", formData, "SEU_PUBLIC_KEY")
      .then(
        () => {
          setStatus("Relatório enviado com sucesso!");
          setFormData({ humor: "", progresso: "", dificuldades: "" });
        },
        () => setStatus("Erro ao enviar. Tente novamente.")
      );
  };

  return (
    <div className="weekly-report">
      <h2 id="h2-relatorio-semanal">Relatório Semanal</h2>
      <form onSubmit={sendEmail}>
        <label>Como você se sentiu essa semana?</label>
        <textarea
          name="humor"
          value={formData.humor}
          onChange={handleChange}
          required
        />

        <label>O que você avançou?</label>
        <textarea
          name="progresso"
          value={formData.progresso}
          onChange={handleChange}
          required
        />

        <label>Teve algum bloqueio ou desafio?</label>
        <textarea
          name="dificuldades"
          value={formData.dificuldades}
          onChange={handleChange}
          required
        />

        <Button type="submit">Enviar relatório semanal</Button>
      </form>

      {status && <p className="mensagem">{status}</p>}
    </div>
  );
};

export default WeeklyReport;
