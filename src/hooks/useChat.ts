import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendChatMessage } from '../services/session.service';
import type { MessageResponseDto, SessionResponseDto } from '../types/api.types';

interface ChatContext {
  userMsg: MessageResponseDto;
}

export const useChat = (sessionId: string | null) => {
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (question: string) => {
      if (!sessionId) throw new Error('Nenhuma sessão ativa');
      return sendChatMessage(sessionId, question);
    },
    onMutate: async (question): Promise<ChatContext | undefined> => {
      if (!sessionId) return undefined;

      const userMsg: MessageResponseDto = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: question,
        sql: null,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<SessionResponseDto>(
        ['session-messages', sessionId],
        (prev) =>
          prev ? { ...prev, messages: [...(prev.messages ?? []), userMsg] } : prev,
      );

      return { userMsg };
    },
    onSuccess: (assistantMsg, _question, context) => {
      if (!sessionId || !context) return;

      queryClient.setQueryData<SessionResponseDto>(
        ['session-messages', sessionId],
        (prev) => {
          if (!prev) return prev;
          const msgs = (prev.messages ?? []).filter((m) => m.id !== context.userMsg.id);
          return { ...prev, messages: [...msgs, context.userMsg, assistantMsg] };
        },
      );
    },
    onError: (_err, _question, context) => {
      if (!sessionId || !context) return;

      queryClient.setQueryData<SessionResponseDto>(
        ['session-messages', sessionId],
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: (prev.messages ?? []).filter((m) => m.id !== context.userMsg.id),
          };
        },
      );
    },
  });

  return { sendMutation };
};
