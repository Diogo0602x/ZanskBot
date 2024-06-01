import axios, { AxiosResponse } from 'axios';
import { User, ApiResponse } from '../types/type';
import { api } from '../commons';

// Função para registrar usuário
export const registerUser = async (userData: User): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.post<ApiResponse>('/auth/register', userData);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao registrar usuário');
  }
};