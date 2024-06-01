import axios, { AxiosResponse } from 'axios';
import { LoginData, ApiResponse } from '../types/type';
import { api } from '../commons';

// Função para login de usuário
export const loginUser = async (loginData: LoginData): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.post<ApiResponse>('/auth/login', loginData);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao fazer login');
  }
};