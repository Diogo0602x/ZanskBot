

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

export interface Document {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface LoginData {
  cnpj: string;
  password: string;
}

export interface QuestionData {
  questionText: string;
}

export interface QuestionFormValues {
  questions: QuestionData[];
}

export interface ApiResponse {
  message: string;
  user?: User;
  token?: string;
  documents?: Document[];
  newQuestions?: {
    _id: string;
    questions: QuestionData[];
  };
  questions?: {
    _id: string;
    questions: QuestionData[];
  }[];
}

export interface StyledAppBarProps {
  scrolled: boolean;
  isLandingPage: boolean;
}


export interface AuthContextProps {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
