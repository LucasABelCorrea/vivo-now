import React, { useEffect, useState, useRef } from "react";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import "./Chat.css";

interface UserDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  position: string;
  telephone: string;
  role: string;
  teamId: number;
  onboardingIds: number[];
}

interface MessageDTO {
  id: number;
  content: string;
  time: string;
  senderName: string;
}

interface ChatDTO {
  id: number;
  participants: UserDTO[];
  messages: MessageDTO[];
}

const fetchUserChats = async (
  userId: number,
  token: string
): Promise<ChatDTO[]> => {
  const res = await fetch(`http://localhost:8080/users/${userId}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar chats do usuário");
  return res.json();
};

const fetchChatMessages = async (
  senderId: number,
  chatId: number,
  token: string
): Promise<MessageDTO[]> => {
  const res = await fetch(`http://localhost:8080/chats/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao buscar mensagens do chat");
  const chat: ChatDTO = await res.json();
  return chat.messages;
};

const sendMessageAPI = async (
  chatId: number,
  senderId: number,
  token: string,
  content: string
): Promise<MessageDTO> => {
  const res = await fetch(`http://localhost:8080/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId, content }),
  });
  if (!res.ok) throw new Error("Erro ao enviar mensagem");
  return res.json();
};

const Chat: React.FC<{ userId: number; token: string }> = ({
  userId,
  token,
}) => {
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        const userChats = await fetchUserChats(userId, token);
        setChats(userChats);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };
    loadChats();
  }, [userId, token]);

  useEffect(() => {
    if (selectedChatId === null) {
      setMessages([]);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const msgs = await fetchChatMessages(userId, selectedChatId, token);
        setMessages(msgs);
        setLoadingMessages(false);
      } catch (e: any) {
        setError(e.message);
        setLoadingMessages(false);
      }
    };

    loadMessages();

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(loadMessages, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedChatId, userId, token]);

  const handleSend = async (text: string) => {
    if (!selectedChatId) return;
    try {
      const newMsg = await sendMessageAPI(selectedChatId, userId, token, text);
      setMessages((prev) => [...prev, newMsg]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const getContactName = (chat: ChatDTO) => {
    const otherParticipant = chat.participants.find((p) => p.id !== userId);
    return otherParticipant
      ? `${otherParticipant.name} ${otherParticipant.lastName}`
      : "Sem contato";
  };

  if (loading) return <p>Carregando chats...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;

  return (
    <div className="chat-layout">
      {/* Lista contatos - usa chats para montar contatos */}
      <ContactList
        contacts={chats.map((chat) => ({
          id: chat.id.toString(),
          name: getContactName(chat),
        }))}
        onSelect={(id) => setSelectedChatId(Number(id))}
        selectedId={selectedChatId?.toString() || null}
      />

      {/* Janela do chat */}
      {selectedChatId !== null ? (
        <ChatWindow
          contactName={getContactName(
            chats.find((c) => c.id === selectedChatId)!
          )}
          messages={messages}
          onSend={handleSend}
          loading={loadingMessages}
        />
      ) : (
        <div className="empty-chat">Selecione um contato</div>
      )}
    </div>
  );
};

export default Chat;
