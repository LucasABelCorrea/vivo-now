import React, { useState, useRef } from "react";
import { ButtonSecondary } from "@telefonica/mistica";
import "./Feedback.css";
import emailjs from "emailjs-com";
import MyPrimaryButton from "../Button/MyPrimaryButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [dificuldade, setDificuldade] = useState("");
  const [comentario, setComentario] = useState("");

  const formRef = useRef<HTMLFormElement>(null!);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação: rating obrigatório
    if (!rating) {
      toast.error("Por favor, avalie a plataforma antes de enviar.");
      return;
    }

    const templateParams = {
      rating: rating || "Sem nota",
      dificuldade,
      comentario,
    };

    emailjs
      .send(
        "service_035axxj",
        "template_aq192yd",
        templateParams,
        "PoOZlvrt-Xo83H8DM"
      )
      .then(() => {
        toast.success("Feedback enviado com sucesso!");
        setRating(null);
        setDificuldade("");
        setComentario("");
      })
      .catch((error) => {
        console.error("Erro ao enviar:", error);
        toast.error("Ocorreu um erro. Tente novamente.");
      });
  };

  return (
    <div className="feedback-container">
      {/* Container de notificações */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Feedback sobre a plataforma</h2>

      <form ref={formRef} onSubmit={handleSubmit}>
        <label>Como você avalia essa plataforma?</label>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <ButtonSecondary
              key={n}
              onPress={() => setRating(n)}
              className={`rating-button ${rating === n ? "selected" : ""}`}
              small
            >
              {n}
            </ButtonSecondary>
          ))}
        </div>

        <label>Teve alguma dificuldade? Se sim, escreva qual(is):</label>
        <textarea
          value={dificuldade}
          onChange={(e) => setDificuldade(e.target.value)}
          placeholder="Escreva aqui..."
        />

        <label>Deseja acrescentar algum comentário?</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escreva aqui..."
        />

        <MyPrimaryButton formRef={formRef}>Enviar feedback</MyPrimaryButton>
      </form>
    </div>
  );
};

export default Feedback;
