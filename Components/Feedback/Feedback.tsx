import React, { useState, useRef } from "react";
import { ButtonPrimary, ButtonSecondary } from "@telefonica/mistica";
import "./Feedback.css";
import emailjs from "emailjs-com";

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [dificuldade, setDificuldade] = useState("");
  const [comentario, setComentario] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        alert("Feedback enviado com sucesso!");
        setRating(null);
        setDificuldade("");
        setComentario("");
      })
      .catch((error) => {
        console.error("Erro ao enviar:", error);
        alert("Ocorreu um erro. Tente novamente.");
      });
  };

  return (
    <div className="feedback-container">
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

        <ButtonPrimary
          onPress={() => {
            formRef.current?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }}
          style={{ width: "100%", marginTop: 16 }}
        >
          Enviar feedback
        </ButtonPrimary>
      </form>
    </div>
  );
};

export default Feedback;
