import axios, { AxiosResponse } from 'axios';
import { api } from '../commons';
import { AskResponse } from '../types/type';

const getAuthToken = () => localStorage.getItem('authToken');

export const askQuestion = async (questionNumber: number): Promise<AxiosResponse<AskResponse>> => {
  try {
    const response = await api.post<AskResponse>('/chatbot/ask', { questionNumber }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao perguntar');
  }
};
