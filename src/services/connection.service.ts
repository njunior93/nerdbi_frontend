import { api } from './api';
import type { ConnectionStatusResponse } from '../types/api.types';

export const getConnectionStatus = (): Promise<ConnectionStatusResponse> =>
  api.get<ConnectionStatusResponse>('/connection/status').then((r) => r.data);

export const testConnection = (connectionString: string): Promise<{ success: boolean }> =>
  api.post<{ success: boolean }>('/connection/test', { connectionString }).then((r) => r.data);

export const saveConnection = (connectionString: string): Promise<{ success: boolean }> =>
  api.put<{ success: boolean }>('/connection', { connectionString }).then((r) => r.data);
