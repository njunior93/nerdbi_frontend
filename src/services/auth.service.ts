import { api } from './api';
import type { AuthResponse } from '../types/api.types';

export const loginUser = (email: string, password: string): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (email: string, password: string): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/register', { email, password }).then((r) => r.data);
