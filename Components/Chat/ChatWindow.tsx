import { useState, useEffect, useRef } from "react";
import { MessageDTO } from "./Chat";
import MessageBubble from "./MessageBubble";
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
    await onSend(text);
    setText("");
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
              msg.senderId === currentUserId ||
              msg.senderName.trim().toLowerCase() ===
                currentUserName.trim().toLowerCase();

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

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Escreva sua mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
