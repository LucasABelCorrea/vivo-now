import React, { useEffect, useState, useRef, ReactNode } from "react";
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

export interface MessageDTO {
  text?: ReactNode;
  id: number;
  content: string;
  time: string;
  senderName: string;
}

interface ChatDTO {
  id: number;
  participants: UserDTO[];
  messages: MessageDTO[];
  receiverId: number;
}

interface Contact {
  id: string;
  name: string;
  receiverId: number;
}

const fetchUserChats = async (
  userId: number,
  token: string
): Promise<ChatDTO[]> => {
  const res = await fetch(`http://localhost:8080/users/${userId}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro ao buscar chats:", errorText);
    throw new Error("Erro ao buscar chats do usuário");
  }

  const chats: ChatDTO[] = await res.json();
  return chats.map((chat) => {
    const other = chat.participants.find((p) => p.id !== userId);
    return {
      ...chat,
      receiverId: other ? other.id : userId,
    };
  });
};

const fetchCollaboratorChats = async (
  userId: number,
  token: string
): Promise<ChatDTO[]> => {
  const chats: ChatDTO[] = [];

  const managerRes = await fetch(
    `http://localhost:8080/users/${userId}/chat/manager`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (managerRes.ok) {
    const managerChat: ChatDTO = await managerRes.json();
    const other = managerChat.participants.find((p) => p.id !== userId);
    chats.push({ ...managerChat, receiverId: other ? other.id : userId });
  }

  const buddyRes = await fetch(
    `http://localhost:8080/users/${userId}/chat/buddy`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (buddyRes.ok) {
    const buddyChat: ChatDTO = await buddyRes.json();
    const other = buddyChat.participants.find((p) => p.id !== userId);
    chats.push({ ...buddyChat, receiverId: other ? other.id : userId });
  }

  return chats;
};

const fetchChatMessages = async (
  senderId: number,
  receiverId: number,
  token: string
): Promise<MessageDTO[]> => {
  const res = await fetch(
    `http://localhost:8080/users/${senderId}/chat/${receiverId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Erro ao buscar mensagens do chat");
  const chat: ChatDTO = await res.json();
  return chat.messages;
};

const sendMessageAPI = async (
  senderId: number,
  receiverId: number,
  token: string,
  content: string
): Promise<MessageDTO> => {
  const res = await fetch(
    `http://localhost:8080/users/${senderId}/chat/${receiverId}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );
  if (!res.ok) throw new Error("Erro ao enviar mensagem");
  return res.json();
};

const Chat: React.FC = () => {
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const userName = localStorage.getItem("userName")?.trim().toLowerCase() || "";
  const role = localStorage.getItem("role");

  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId || !token || !role) {
      setError("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const loadChats = async () => {
      try {
        setLoading(true);
        let userChats: ChatDTO[] = [];

        if (role === "MANAGER" || role === "BUDDY") {
          userChats = await fetchUserChats(userId, token);
        } else if (role === "COLLABORATOR") {
          userChats = await fetchCollaboratorChats(userId, token);
        } else {
          throw new Error("Role não reconhecida para chat");
        }

        setChats(userChats);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    loadChats();
  }, [userId, token, role]);

  useEffect(() => {
    if (!selectedChat || !userId || !token) {
      setMessages([]);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      return;
    }

    const loadMessages = async () => {
      try {
        const msgs = await fetchChatMessages(
          userId,
          selectedChat.receiverId,
          token
        );
        setMessages(msgs);
      } catch (e: any) {
        setError(e.message);
      }
    };

    loadMessages();
    pollingRef.current = window.setInterval(loadMessages, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedChat, userId, token]);

  const handleSend = async (text: string) => {
    if (!selectedChat || !userId || !token) return;
    try {
      await sendMessageAPI(userId, selectedChat.receiverId, token, text);
      const updatedMessages = await fetchChatMessages(
        userId,
        selectedChat.receiverId,
        token
      );
      setMessages(updatedMessages);
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

  const contacts: Contact[] = chats.map((chat) => ({
    id: chat.id.toString(),
    name: getContactName(chat),
    receiverId: chat.receiverId,
  }));

  return (
    <div className="chat-layout">
      <ContactList
        contacts={contacts}
        onSelect={(id) =>
          setSelectedChat(chats.find((c) => c.id === Number(id)) || null)
        }
        selectedId={selectedChat?.id.toString() || null}
      />

      {selectedChat ? (
        <ChatWindow
          contactName={getContactName(selectedChat)}
          messages={messages}
          onSend={handleSend}
          loading={loadingMessages}
          currentUserName={userName}
        />
      ) : (
        <div className="empty-chat">Selecione um contato</div>
      )}
    </div>
  );
};

export default Chat;
