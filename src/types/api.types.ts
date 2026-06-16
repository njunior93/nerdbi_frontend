export interface MessageResponseDto {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql: string | null;
  createdAt: string;
  isError?: boolean;
}

export interface SessionResponseDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: MessageResponseDto[];
}

export interface AuthResponse {
  accessToken: string;
}

export interface ConnectionStatusResponse {
  hasConnection: boolean;
}
