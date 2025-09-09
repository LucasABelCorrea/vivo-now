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
  currentUserId: number;
  currentUserName: string;
}

const ChatWindow = ({
  contactName,
  messages,
  onSend,
  onBack,
  isMobile,
  loading,
  currentUserId,
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              msg.senderName.trim().toLowerCase() ===
              currentUserName.trim().toLowerCase();

            console.log(
              `Mensagem: ${msg.content} | Remetente: ${msg.senderName} | Usuário atual: ${currentUserName} | isOwn: ${isOwn}`
            );

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
