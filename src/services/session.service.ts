import { api } from './api';
import type { SessionResponseDto, MessageResponseDto } from '../types/api.types';

export const getSessions = (): Promise<SessionResponseDto[]> =>
  api.get<SessionResponseDto[]>('/session').then((r) => r.data);

export const createSession = (title: string): Promise<SessionResponseDto> =>
  api.post<SessionResponseDto>('/session', { title }).then((r) => r.data);

export const getSessionMessages = (sessionId: string): Promise<SessionResponseDto> =>
  api.get<SessionResponseDto>(`/session/${sessionId}/messages`).then((r) => r.data);

export const sendChatMessage = (sessionId: string, question: string): Promise<MessageResponseDto> =>
  api.post<MessageResponseDto>(`/session/${sessionId}/chat`, { question }).then((r) => r.data);
