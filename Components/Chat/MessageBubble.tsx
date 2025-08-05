import { Message } from "../../src/types/Message";
import "./Chat.css";

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  return <div className={`message ${message.sender}`}>{message.text}</div>;
};

export default MessageBubble;