import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/auth.service';
import { getConnectionStatus } from '../services/connection.service';
import { TOKEN_KEY } from '../services/api';

export const useAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = async (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    try {
      const { hasConnection } = await getConnectionStatus();
      navigate(hasConnection ? '/chat' : '/connect', { replace: true });
    } catch {
      navigate('/connect', { replace: true });
    }
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: (data) => handleAuthSuccess(data.accessToken),
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerUser(email, password),
    onSuccess: (data) => handleAuthSuccess(data.accessToken),
  });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/', { replace: true });
  };

  return { loginMutation, registerMutation, logout };
};
