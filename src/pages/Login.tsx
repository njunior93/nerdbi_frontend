import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type AuthFormData = z.infer<typeof authSchema>;

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string | string[] } } };
    const msg = axiosError.response?.data?.message;
    if (msg) return Array.isArray(msg) ? msg[0] : msg;
  }
  return 'Ocorreu um erro. Tente novamente.';
};

const NerdBIIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="10" fill="var(--accent-bg)" />
    <rect x="6" y="23" width="5" height="7" rx="1.5" fill="var(--accent)" />
    <rect x="13" y="16" width="5" height="14" rx="1.5" fill="var(--accent)" />
    <rect x="20" y="19" width="5" height="11" rx="1.5" fill="var(--accent)" opacity="0.75" />
    <rect x="27" y="11" width="5" height="19" rx="1.5" fill="var(--accent)" opacity="0.5" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation, registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const activeMutation = isRegistering ? registerMutation : loginMutation;
  const isLoading = activeMutation.isPending;

  const onSubmit = (data: AuthFormData) => {
    if (isRegistering && data.password.length < 8) {
      setError('password', { message: 'Senha deve ter no mínimo 8 caracteres' });
      return;
    }
    activeMutation.mutate({ email: data.email, password: data.password });
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    reset();
    loginMutation.reset();
    registerMutation.reset();
  };

  const inputBase =
    'w-full px-3.5 py-2.5 rounded-lg border text-sm text-heading bg-canvas ' +
    'placeholder:text-gray-400 focus:outline-none transition-colors';

  const inputNormal = `${inputBase} border-outline focus:border-accent focus:ring-2 focus:ring-[var(--accent-bg)]`;
  const inputError = `${inputBase} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-canvas border border-outline rounded-2xl p-10 max-sm:p-7 shadow-card text-left">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <NerdBIIcon />
          <span className="text-xl font-bold text-heading tracking-tight">NerdBI</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-heading tracking-tight m-0 mb-2">
          {isRegistering ? 'Criar conta' : 'Bem-vindo de volta'}
        </h1>
        <p className="text-sm text-body mb-7">
          {isRegistering
            ? 'Crie sua conta para começar a analisar seus dados'
            : 'Entre para acessar suas análises de dados'}
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-heading">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="você@empresa.com"
              autoComplete="email"
              className={errors.email ? inputError : inputNormal}
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-red-500" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-heading">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                className={`${errors.password ? inputError : inputNormal} pr-11`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-body hover:text-heading transition-colors rounded focus-visible:outline-2 focus-visible:outline-accent"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500" role="alert">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Erro da API */}
          {activeMutation.isError && (
            <div
              className="px-3.5 py-2.5 rounded-lg border border-red-300/50 bg-red-500/[0.08] text-sm text-red-500"
              role="alert"
            >
              {getErrorMessage(activeMutation.error)}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-2.5 px-5 bg-accent text-white text-sm font-semibold rounded-lg transition-[opacity,transform] hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isLoading
              ? isRegistering
                ? 'Criando conta...'
                : 'Entrando...'
              : isRegistering
                ? 'Criar conta'
                : 'Entrar'}
          </button>
        </form>

        {/* Alternar modo */}
        <p className="mt-6 text-center text-sm text-body">
          {isRegistering ? 'Já tem conta? ' : 'Não tem conta? '}
          <button
            type="button"
            className="text-accent font-medium underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-accent rounded"
            onClick={toggleMode}
          >
            {isRegistering ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
