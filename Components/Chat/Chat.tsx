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
  senderId?: number;
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
  hasNotification?: boolean;
}

const fetchUserChats = async (
  userId: number,
  token: string
): Promise<ChatDTO[]> => {
  const res = await fetch(`http://localhost:8080/users/${userId}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao buscar chats do usuário");

  const chats: ChatDTO[] = await res.json();
  return chats.map((chat) => {
    const other = chat.participants.find((p) => p.id !== userId);
    return { ...chat, receiverId: other ? other.id : userId };
  });
};

const fetchCollaboratorChats = async (
  userId: number,
  token: string
): Promise<ChatDTO[]> => {
  const endpoints = ["manager", "buddy"];
  const chats: ChatDTO[] = [];

  for (const type of endpoints) {
    const res = await fetch(
      `http://localhost:8080/users/${userId}/chat/${type}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const chat: ChatDTO = await res.json();
      const other = chat.participants.find((p) => p.id !== userId);
      chats.push({ ...chat, receiverId: other ? other.id : userId });
    }
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
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "";

  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadChats, setUnreadChats] = useState<Record<number, boolean>>({});
  const [lastRead, setLastRead] = useState<Record<number, number>>({});
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

        const loggedUser = userChats
          .flatMap((chat) => chat.participants)
          .find((p) => p.id === userId);

        if (loggedUser) {
          localStorage.setItem("userName", loggedUser.name);
        }

        setChats(userChats);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userId, token, role]);

  useEffect(() => {
    if (!userId || !token) return;

    const checkForNewMessages = async () => {
      try {
        for (const chat of chats) {
          const msgs = await fetchChatMessages(userId, chat.receiverId, token);
          const lastMessage = msgs[msgs.length - 1];

          if (lastMessage && lastMessage.senderId !== userId) {
            const lastReadId = lastRead[chat.id] || 0;

            if (lastMessage.id > lastReadId) {
              if (chat.id !== selectedChat?.id) {
                setUnreadChats((prev) => ({
                  ...prev,
                  [chat.id]: true,
                }));
              }
            }
          }
        }
      } catch (e) {
        console.error("Erro ao verificar mensagens novas:", e);
      }
    };

    const interval = window.setInterval(checkForNewMessages, 5000);
    return () => clearInterval(interval);
  }, [chats, userId, token, selectedChat, lastRead]);

  useEffect(() => {
    if (!selectedChat || !userId || !token) {
      setMessages([]);
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const msgs = await fetchChatMessages(
          userId,
          selectedChat.receiverId,
          token
        );
        setMessages(msgs);

        const lastMessage = msgs[msgs.length - 1];
        if (lastMessage) {
          setLastRead((prev) => ({
            ...prev,
            [selectedChat.id]: lastMessage.id,
          }));

          setUnreadChats((prev) => {
            const updated = { ...prev };
            delete updated[selectedChat.id];
            return updated;
          });
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
    pollingRef.current = window.setInterval(loadMessages, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
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
    const other = chat.participants.find((p) => p.id !== userId);
    return other ? `${other.name} ${other.lastName}` : "Sem contato";
  };

  const contacts: Contact[] = chats.map((chat) => ({
    id: chat.id.toString(),
    name: getContactName(chat),
    receiverId: chat.receiverId,
    hasNotification: unreadChats[chat.id] || false,
  }));

  if (loading) return <p>Carregando chats...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;

  return (
    <div className="chat-layout">
      <ContactList
        contacts={contacts}
        onSelect={(id) => {
          const chat = chats.find((c) => c.id === Number(id)) || null;
          setSelectedChat(chat);

          if (chat) {
            setUnreadChats((prev) => {
              const updated = { ...prev };
              delete updated[chat.id];
              return updated;
            });
          }
        }}
        selectedId={selectedChat?.id.toString() || null}
      />

      {selectedChat ? (
        <ChatWindow
          contactName={getContactName(selectedChat)}
          messages={messages}
          onSend={handleSend}
          loading={loadingMessages}
          currentUserId={userId}
          currentUserName={userName}
        />
      ) : (
        <div className="empty-chat">Selecione um contato</div>
      )}
    </div>
  );
};

export default Chat;
         