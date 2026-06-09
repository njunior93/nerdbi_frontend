export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  xKey: string;
  yKey: string;
  data: Record<string, unknown>[];
}

export interface MessageResponseDto {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql: string | null;
  chartConfig: ChartConfig | null;
  createdAt: string;
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
