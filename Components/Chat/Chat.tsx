import React, { useEffect, useState, useRef } from "react";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import "./Chat.css";

export interface MessageDTO {
  id: number;
  content: string;
  time: string;
  senderName: string;
  senderId?: number;
}

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
  const token = localStorage.getItem("token") || "";
  const userId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "";

  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChatOnly, setShowChatOnly] = useState(false);
  const [lastReadMessageIdMap, setLastReadMessageIdMap] = useState<
    Record<number, number>
  >({});
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      try {
        let userChats: ChatDTO[] = [];
        if (role === "MANAGER" || role === "BUDDY") {
          userChats = await fetchUserChats(userId, token);
        } else if (role === "COLLABORATOR") {
          userChats = await fetchCollaboratorChats(userId, token);
        }
        setChats(userChats);
      } catch (error) {
        console.error(error);
      }
    };
    loadChats();
  }, [userId, token, role]);

  useEffect(() => {
    if (!selectedChat || !userId || !token) {
      setMessages([]);
      if (pollingRef.current) clearInterval(pollingRef.current);
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

        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg) {
          setLastReadMessageIdMap((prev) => ({
            ...prev,
            [selectedChat.id]: lastMsg.id,
          }));
        }
      } catch (error) {
        console.error("Erro ao atualizar mensagens:", error);
      }
    };

    loadMessages();
    pollingRef.current = window.setInterval(loadMessages, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedChat, userId, token]);

  const handleSend = async (text: string) => {
    if (!selectedChat) return;
    try {
      await sendMessageAPI(userId, selectedChat.receiverId, token, text);
      const updatedMessages = await fetchChatMessages(
        userId,
        selectedChat.receiverId,
        token
      );
      setMessages(updatedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const getContactName = (chat: ChatDTO) => {
    const other = chat.participants.find((p) => p.id !== userId);
    return other ? `${other.name} ${other.lastName}` : "Sem contato";
  };

  const contacts: Contact[] = chats.map((chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    const lastReadId = lastReadMessageIdMap[chat.id] || 0;

    const isUnread =
      lastMessage &&
      lastMessage.senderId !== userId &&
      lastMessage.id > lastReadId;

    return {
      id: chat.id.toString(),
      name: getContactName(chat),
      receiverId: chat.receiverId,
      hasNotification: isUnread,
    };
  });

  return (
    <div className="chat-layout">
      {!isMobileView || !showChatOnly ? (
        <ContactList
          contacts={contacts}
          onSelect={(id) => {
            const chat = chats.find((c) => c.id === Number(id)) || null;
            setSelectedChat(chat);
            if (isMobileView) setShowChatOnly(true);
          }}
          selectedId={selectedChat?.id.toString() || null}
        />
      ) : null}

      {!isMobileView || showChatOnly ? (
        selectedChat ? (
          <ChatWindow
            contactName={getContactName(selectedChat)}
            messages={messages}
            onSend={handleSend}
            loading={loadingMessages}
            currentUserId={userId}
            currentUserName={userName}
            onBack={isMobileView ? () => setShowChatOnly(false) : undefined}
            isMobile={isMobileView}
          />
        ) : (
          <div className="empty-chat">Selecione um contato</div>
        )
      ) : null}
    </div>
  );
};

export default Chat;
