import axios from "axios";
import { ChatDTO } from "../../src/types/Message";

const API_BASE = "http://localhost:8080"; // ajuste conforme necessário

export const getChat = async (senderId: number, receiverId: number) => {
  const res = await axios.get<ChatDTO>(
    `${API_BASE}/${senderId}/chat/${receiverId}`
  );
  return res.data;
};

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  content: string
) => {
  const res = await axios.post<ChatDTO>(
    `${API_BASE}/${senderId}/chat/${receiverId}/message`,
    { content }
  );
  return res.data;
};
