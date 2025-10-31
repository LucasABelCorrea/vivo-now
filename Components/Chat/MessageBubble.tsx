import { MessageDTO } from "../../Components/Chat/Chat";
import "./Chat.css";

interface Props {
  message: MessageDTO;
  isOwn: boolean;
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);

  // Ajusta para UTC-3 manualmente (mantendo seu estilo original)
  date.setUTCHours(date.getUTCHours() - 3);

  // Retorna data completa: dia/mês/ano e hora:minuto
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageBubble = ({ message, isOwn }: Props) => {
  return (
    <div className={`message-bubble-wrapper ${isOwn ? "own" : "other"}`}>
      <div className="message-bubble">
        <p>{message.content}</p>
        <span className="message-time">{formatTime(message.time)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
