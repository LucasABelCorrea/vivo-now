import React, { useState } from "react";
import "./Chatbot.css";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Olá Ana! Seja muito bem-vinda! Estou aqui para te auxiliar nessa nova jornada. Como posso te ajudar hoje?",
      timestamp: "11:41 AM",
    },
  ]);
  const [input, setInput] = useState("");

  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const botReply = data.candidates[0].content.parts[0].text;

        const botMessage: Message = {
          role: "bot",
          content: botReply,
          timestamp: getCurrentTime(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } else if (data.error) {
        const botMessage: Message = {
          role: "bot",
          content: `Erro da API: ${data.error.message}`,
          timestamp: getCurrentTime(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          role: "bot",
          content: "Ops, a resposta veio vazia da API.",
          timestamp: getCurrentTime(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const botMessage: Message = {
        role: "bot",
        content: "Erro ao conectar com a API.",
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
      console.error("Erro ao chamar Gemini API:", error);
    }
  }; // <-- AQUI estava faltando o fechamento

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <div className="avatar" />
        <span>Nome Sobrenome</span>
      </header>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            <div className="bubble">{msg.content}</div>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Escreva sua mensagem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chatbot;
