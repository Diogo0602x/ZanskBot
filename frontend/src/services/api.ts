import axios from 'axios';
import { User, LoginData, ApiResponse } from '../types/type';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const registerUser = async (userData: User): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/register', userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao registrar usuário');
  }
};

export const loginUser = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/login', loginData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao fazer login');
  }
};
