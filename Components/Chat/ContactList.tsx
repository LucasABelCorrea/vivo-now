interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
}

interface Props {
  contacts: Contact[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const ContactList = ({ contacts, onSelect, selectedId }: Props) => {
  return (
    <div className="contact-list">
      <h3>Conversas</h3>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`contact-item ${
            selectedId === contact.id ? "active" : ""
          }`}
          onClick={() => onSelect(contact.id)}
        >
          <div className="avatar-circle">{contact.name[0]}</div>
          <div>
            <strong>{contact.name}</strong>
            <p>{contact.lastMessage || "Mensagem"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
