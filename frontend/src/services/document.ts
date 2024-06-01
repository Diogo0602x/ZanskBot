import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '../types/type';
import { api } from '../commons';

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


// Função para deletar documento
export const deleteDocument = async (id: string): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await api.delete<ApiResponse>(`/documents/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Erro desconhecido ao deletar documento');
  }
};