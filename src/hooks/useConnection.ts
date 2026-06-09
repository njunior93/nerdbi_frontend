import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { testConnection, saveConnection } from '../services/connection.service';

export const useConnection = () => {
  const navigate = useNavigate();

  const testMutation = useMutation({
    mutationFn: (connectionString: string) => testConnection(connectionString),
  });

  const saveMutation = useMutation({
    mutationFn: (connectionString: string) => saveConnection(connectionString),
    onSuccess: () => navigate('/chat', { replace: true }),
  });

  return { testMutation, saveMutation };
};
