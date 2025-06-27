import React, { useState } from "react";
import Button from "../../Components/Button/Button"; // ajuste o caminho conforme sua estrutura
import "./Feedback.css";
import emailjs from "emailjs-com";

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [dificuldade, setDificuldade] = useState("");
  const [comentario, setComentario] = useState("");

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

      <form onSubmit={handleSubmit}>
        <label>Como você avalia essa plataforma?</label>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={rating === n ? "selected" : ""}
              onClick={() => setRating(n)}
            >
              {n}
            </button>
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

        <Button type="submit">Enviar feedback</Button>
      </form>
    </div>
  );
};

export default Feedback;
