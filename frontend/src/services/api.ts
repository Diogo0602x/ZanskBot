import axios, { AxiosResponse } from 'axios';
import { User, LoginData, ApiResponse } from '../types/type';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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

// Função para upload de documento
export const uploadDocument = async (file: File): Promise<AxiosResponse<ApiResponse>> => {
  const formData = new FormData();
  formData.append('document', file);

  try {
    const response = await api.post<ApiResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao enviar documento');
  }
};

// Função para buscar documentos do usuário
export const fetchDocuments = async (): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.get<ApiResponse>('/documents', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao buscar documentos');
  }
};

// Função para fazer download de documento
export const downloadDocument = async (id: string): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao fazer download do documento');
  }
};
