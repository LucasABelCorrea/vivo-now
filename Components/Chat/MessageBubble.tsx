import { MessageDTO } from "../../Components/Chat/Chat";
import "./Chat.css";

interface Props {
  message: MessageDTO;
  isOwn: boolean;
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-BR", {
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
