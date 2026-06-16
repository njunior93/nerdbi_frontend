import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useConnection } from '../hooks/useConnection';

const connectSchema = z.object({
  connectionString: z
    .string()
    .min(1, { message: 'Cole a connection string do seu banco' })
    .refine(
      (v) => v.startsWith('postgres://') || v.startsWith('postgresql://'),
      { message: 'A connection string deve começar com postgresql:// ou postgres://' }
    ),
});

type ConnectFormData = z.infer<typeof connectSchema>;

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string | string[] } } };
    const msg = axiosError.response?.data?.message;
    if (msg) return Array.isArray(msg) ? msg[0] : msg;
  }
  return 'Não foi possível conectar. Verifique a connection string.';
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

export const Connect = () => {
  const { testMutation, saveMutation } = useConnection();
  const isAnyLoading = testMutation.isPending || saveMutation.isPending;

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ConnectFormData>({
    resolver: zodResolver(connectSchema),
  });

  const handleTest = async () => {
    const valid = await trigger('connectionString');
    if (!valid) return;
    saveMutation.reset();
    testMutation.mutate(getValues('connectionString').trim());
  };

  const onSubmit = (data: ConnectFormData) => {
    testMutation.reset();
    saveMutation.mutate(data.connectionString.trim());
  };

  const textareaBase =
    'w-full px-3.5 py-2.5 rounded-lg border text-sm text-heading bg-canvas ' +
    'placeholder:text-gray-400 focus:outline-none transition-colors resize-none min-h-[120px] font-mono';

  const textareaNormal = `${textareaBase} border-outline focus:border-accent focus:ring-2 focus:ring-[var(--accent-bg)]`;
  const textareaError = `${textareaBase} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-canvas border border-outline rounded-2xl p-10 max-sm:p-7 shadow-card text-left">
        <div className="flex items-center gap-2.5 mb-8">
          <NerdBIIcon />
          <span className="text-xl font-bold text-heading tracking-tight">NerdBI</span>
        </div>

        <h1 className="text-2xl font-semibold text-heading tracking-tight m-0 mb-2">
          Conectar seu banco de dados
        </h1>
        <p className="text-sm text-body mb-7">
          Cole a connection string do seu banco PostgreSQL para começar a fazer perguntas em
          linguagem natural.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="connectionString" className="text-sm font-medium text-heading">
              Connection string
            </label>
            <textarea
              id="connectionString"
              placeholder="postgresql://usuario:senha@host:6543/banco"
              aria-describedby="connectionString-hint connectionString-hint-pooling"
              className={errors.connectionString ? textareaError : textareaNormal}
              {...register('connectionString', {
                onChange: () => {
                  testMutation.reset();
                  saveMutation.reset();
                },
              })}
            />
            <span id="connectionString-hint" className="text-xs text-body">
              Inclua usuário, senha, host, porta e nome do banco de dados.
            </span>
            <span id="connectionString-hint-pooling" className="text-xs text-body">
              Use connection pooling em modo transaction, com a porta 6543.
            </span>
            {errors.connectionString && (
              <span className="text-xs text-red-500" role="alert">
                {errors.connectionString.message}
              </span>
            )}
          </div>

          {testMutation.isSuccess && (
            <div
              className="px-3.5 py-2.5 rounded-lg border border-green-300/50 bg-green-500/[0.08] text-sm text-green-600"
              role="alert"
            >
              Conexão testada com sucesso. Você pode conectar agora.
            </div>
          )}
          {testMutation.isError && (
            <div
              className="px-3.5 py-2.5 rounded-lg border border-red-300/50 bg-red-500/[0.08] text-sm text-red-500"
              role="alert"
            >
              {getErrorMessage(testMutation.error)}
              <p className="mt-1 text-xs text-body">
                Verifique se a string usa a porta 6543 (connection pooling em modo transaction).
              </p>
            </div>
          )}

          {saveMutation.isError && (
            <div
              className="px-3.5 py-2.5 rounded-lg border border-red-300/50 bg-red-500/[0.08] text-sm text-red-500"
              role="alert"
            >
              {getErrorMessage(saveMutation.error)}
              <p className="mt-1 text-xs text-body">
                Verifique se a string usa a porta 6543 (connection pooling em modo transaction).
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={isAnyLoading}
              className="flex-1 py-2.5 px-5 border border-outline bg-canvas text-heading text-sm font-medium rounded-lg transition-[opacity,background-color] hover:bg-[var(--code-bg)] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {testMutation.isPending ? 'Testando...' : 'Testar conexão'}
            </button>
            <button
              type="submit"
              disabled={isAnyLoading}
              className="flex-1 py-2.5 px-5 bg-accent text-white text-sm font-semibold rounded-lg transition-[opacity,transform] hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {saveMutation.isPending ? 'Conectando...' : 'Conectar e começar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
