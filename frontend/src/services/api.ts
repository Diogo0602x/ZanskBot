import axios, { AxiosResponse } from 'axios';
import { api } from '../commons';
import { ApiResponse } from '../types/type';

const getAuthToken = () => localStorage.getItem('authToken');

export const generateApi = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.post<ApiResponse>('/generate-api', {}, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao gerar a API');
  }
};