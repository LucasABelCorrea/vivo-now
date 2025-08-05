import { Message } from "../../src/types/Message";
import MessageBubble from "./MessageBubble";
import { useState } from "react";
import "./Chat.css"; // ou ajuste o caminho conforme seu projeto

interface Props {
  contactName: string;
  messages: Message[];
  onSend: (text: string) => void;
  onBack?: () => void;
  isMobile?: boolean;
}

const ChatWindow = ({
  contactName,
  messages,
  onSend,
  onBack,
  isMobile,
}: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isMobile && onBack && (
          <button className="back-button" onClick={onBack}>
            ← Voltar
          </button>
        )}
        <span>{contactName}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <div className="chat-input-area custom-input">
        <input
          type="text"
          placeholder="Escreva sua mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatWindow;
