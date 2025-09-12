import React from "react";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  hasNotification?: boolean;
}

interface Props {
  contacts: Contact[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const ContactList: React.FC<Props> = ({ contacts, onSelect, selectedId }) => {
  return (
    <div className="contact-list">
      <h3>Conversas</h3>
      {contacts.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#888" }}>
          Nenhum contato disponível
        </p>
      ) : (
        contacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${
              selectedId === contact.id ? "active" : ""
            }`}
            onClick={() => onSelect(contact.id)}
          >
            <div className="avatar-circle">{contact.name[0]}</div>
            <div className="contact-info">
              <strong>{contact.name}</strong>
              <p>{contact.lastMessage || "Mensagem"}</p>
            </div>
            {contact.hasNotification && (
              <span className="notification-dot"></span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ContactList;
