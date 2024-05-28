export interface User {
  cnpj: string;
  companyName: string;
  companySocialName: string;
  phone: string;
  email: string;
  companySize: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  cnpj: string;
  password: string;
}

export interface ApiResponse {
  message: string;
  user?: User;
}