import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Função de login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erro ao fazer login.");
  }
};
