import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessions, createSession, getSessionMessages } from '../services/session.service';
import type { SessionResponseDto } from '../types/api.types';

export const useSession = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) => createSession(title),
    onSuccess: (newSession) => {
      queryClient.setQueryData<SessionResponseDto[]>(
        ['sessions'],
        (prev = []) => [newSession, ...prev],
      );
    },
  });

  return { sessionsQuery, createMutation };
};

export const useSessionMessages = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session-messages', sessionId],
    queryFn: () => getSessionMessages(sessionId!),
    enabled: sessionId !== null,
  });
};
