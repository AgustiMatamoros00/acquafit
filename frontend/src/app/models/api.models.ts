// Interfaces para las respuestas de la API

export interface LoginResponse {
  message: string;
  token: string;
  user: UserData;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  surname: string;
  weight_unit?: string;
  superadmin?: boolean;
}

export interface TokenValidationResponse {
  valid: boolean;
  user: UserData;
}

export interface ApiErrorResponse {
  error: string;
} 