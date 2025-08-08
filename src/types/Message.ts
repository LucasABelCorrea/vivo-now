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
  time: string; // LocalDateTime no backend, aqui será string ISO
  senderName: string;
}

interface ChatDTO {
  id: number;
  participants: UserDTO[];
  messages: MessageDTO[];
}
