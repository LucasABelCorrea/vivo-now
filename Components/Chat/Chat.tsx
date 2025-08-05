import { useEffect, useState } from "react";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { Message } from "../../src/types/Message";
import "./Chat.css";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
}

const Chat = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showContacts, setShowContacts] = useState(true);

  const mockContacts: Contact[] = [
    { id: "1", name: "Ana Silva", lastMessage: "Perfeito! Aqui está: link..." },
    { id: "2", name: "Bruno Costa", lastMessage: "Você pode me ajudar com..." },
    { id: "3", name: "Camila Oliveira", lastMessage: "Obrigada pela ajuda!" },
  ];

  const mockMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        sender: "agent",
        text: "Olá Ana! Seja muito bem-vinda! Estou aqui para te auxiliar nessa nova jornada. Como posso te ajudar hoje?",
        timestamp: "2025-08-01T10:00:00Z",
      },
      {
        id: "m2",
        sender: "user",
        text: "Oi! Preciso de acesso à Plataforma XYZ, como faço para solicitar?",
        timestamp: "2025-08-01T10:01:00Z",
      },
      {
        id: "m3",
        sender: "agent",
        text: "Ótima pergunta! Você pode conferir na nossa seção “Plataformas” como solicitar acesso a ela. Quer que eu te envie o link direto?",
        timestamp: "2025-08-01T10:02:00Z",
      },
      {
        id: "m4",
        sender: "user",
        text: "Quero sim, por favor!",
        timestamp: "2025-08-01T10:03:00Z",
      },
      {
        id: "m5",
        sender: "agent",
        text: "Perfeito! Aqui está: link. Se precisar de mais alguma coisa, é só me chamar!",
        timestamp: "2025-08-01T10:04:00Z",
      },
    ],
    "2": [
      {
        id: "m6",
        sender: "user",
        text: "Você pode me ajudar com o acesso ao sistema?",
        timestamp: "2025-08-01T11:00:00Z",
      },
      {
        id: "m7",
        sender: "agent",
        text: "Claro! Qual sistema você precisa acessar?",
        timestamp: "2025-08-01T11:01:00Z",
      },
    ],
    "3": [
      {
        id: "m8",
        sender: "agent",
        text: "Oi Camila, tudo certo com seu acesso?",
        timestamp: "2025-08-01T12:00:00Z",
      },
      {
        id: "m9",
        sender: "user",
        text: "Sim! Obrigada pela ajuda!",
        timestamp: "2025-08-01T12:01:00Z",
      },
    ],
  };

  const handleSend = (text: string) => {
    if (!selectedContactId) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleBackToContacts = () => {
    setSelectedContactId(null);
    setShowContacts(true);
  };

  useEffect(() => {
    setContacts(mockContacts);

    const resizeHandler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowContacts(true);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    if (selectedContactId) {
      const msgs = mockMessages[selectedContactId] || [];
      setMessages(msgs);
      if (isMobile) setShowContacts(false);
    }
  }, [selectedContactId]);

  return (
    <div className="chat-layout">
      {showContacts && (
        <ContactList
          contacts={contacts}
          onSelect={setSelectedContactId}
          selectedId={selectedContactId}
        />
      )}

      {!showContacts && selectedContactId && (
        <ChatWindow
          contactName={
            contacts.find((c) => c.id === selectedContactId)?.name || ""
          }
          messages={messages}
          onSend={handleSend}
          onBack={handleBackToContacts}
          isMobile={isMobile}
        />
      )}

      {!isMobile && selectedContactId && (
        <ChatWindow
          contactName={
            contacts.find((c) => c.id === selectedContactId)?.name || ""
          }
          messages={messages}
          onSend={handleSend}
        />
      )}

      {!isMobile && !selectedContactId && (
        <div className="empty-chat">Selecione um contato</div>
      )}
    </div>
  );
};

export default Chat;
