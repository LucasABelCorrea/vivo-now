import { MessageDTO } from "../../Components/Chat/Chat";
import MessageBubble from "./MessageBubble";
import { useState, useEffect, useRef } from "react";
import "./Chat.css";

interface Props {
  contactName: string;
  messages: MessageDTO[];
  onSend: (text: string) => void;
  onBack?: () => void;
  isMobile?: boolean;
  loading: boolean;
  currentUserName: string; // 👈 novo prop
}

const ChatWindow = ({
  contactName,
  messages,
  onSend,
  onBack,
  isMobile,
  loading,
  currentUserName,
}: Props) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      await onSend(text);
      setText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const normalize = (str: string | null | undefined) =>
    str?.trim().toLowerCase();

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isMobile && onBack && (
          <button className="back-button" onClick={onBack}>
            Voltar
          </button>
        )}
        <span>{contactName}</span>
      </div>

      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((msg, index) => {
            const isOwn =
              normalize(msg.senderName) === normalize(currentUserName);
            return (
              <MessageBubble
                key={`${msg.id}-${index}`}
                message={msg}
                isOwn={isOwn}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area custom-input">
        <input
          type="text"
          placeholder="Escreva sua mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
