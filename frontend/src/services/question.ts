import axios, { AxiosResponse } from 'axios';
import { api } from '../commons';
import { ApiResponse, QuestionData } from '../types/type';

const getAuthToken = () => localStorage.getItem('authToken');

// Função para registrar perguntas
export const registerQuestions = async (questions: QuestionData[]): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.post<ApiResponse>('/questions/register', { questions }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao registrar perguntas');
  }
};

// Função para buscar perguntas
export const fetchQuestions = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.get<ApiResponse>('/questions', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao buscar perguntas');
  }
};

// Função para editar perguntas
export const editQuestions = async (id: string, questions: QuestionData[]): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.put<ApiResponse>(`/questions/edit/${id}`, { questions }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao editar perguntas');
  }
};
