import { useState, useEffect, useRef, startTransition } from 'react';
import { useSession, useSessionMessages } from '../hooks/useSession';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { SessionSidebar } from '../components/SessionSidebar';
import { ChatMessage } from '../components/ChatMessage';

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div
      className="flex items-center gap-1.5 px-4 py-3 bg-canvas border border-outline"
      style={{ borderRadius: '12px 12px 12px 2px' }}
      aria-label="Agente digitando"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-center px-6">
    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="6" y="23" width="5" height="7" rx="1.5" fill="var(--accent)" />
        <rect x="13" y="16" width="5" height="14" rx="1.5" fill="var(--accent)" />
        <rect x="20" y="19" width="5" height="11" rx="1.5" fill="var(--accent)" opacity="0.75" />
        <rect x="27" y="11" width="5" height="19" rx="1.5" fill="var(--accent)" opacity="0.5" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-heading">Pronto para analisar seus dados</p>
      <p className="text-xs text-body mt-1 max-w-xs">
        Faça uma pergunta em português — o NerdBI transforma em SQL, executa e explica o resultado.
      </p>
    </div>
  </div>
);

export const Chat = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [question, setQuestion] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const { logout } = useAuth();
  const { sessionsQuery, createMutation } = useSession();
  const messagesQuery = useSessionMessages(activeSessionId);
  const { sendMutation } = useChat(activeSessionId);

  const sessions = sessionsQuery.data ?? [];
  const messages = messagesQuery.data?.messages ?? [];
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    if (sessionsQuery.isLoading) return;
    if (initialized.current) return;
    initialized.current = true;

    if (sessions.length > 0) {
      startTransition(() => setActiveSessionId(sessions[0].id));
    } else {
      createMutation.mutate('Nova conversa', {
        onSuccess: (session) => setActiveSessionId(session.id),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsQuery.isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, sendMutation.isPending]);

  useEffect(() => {
    sendMutation.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleNewSession = () => {
    createMutation.mutate('Nova conversa', {
      onSuccess: (session) => {
        setActiveSessionId(session.id);
        setIsSidebarOpen(false);
      },
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSend = () => {
    if (!question.trim() || sendMutation.isPending || !activeSessionId) return;

    const text = question.trim();
    setQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    sendMutation.mutate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInputDisabled = sendMutation.isPending || !activeSessionId;

  return (
    <div className="flex flex-1 overflow-hidden">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isCreating={createMutation.isPending}
        isOpen={isSidebarOpen}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={logout}
      />

      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-outline sm:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-body hover:text-heading hover:bg-[var(--code-bg)] transition-colors focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Abrir menu de sessões"
          >
            <MenuIcon />
          </button>
          <span className="text-sm font-medium text-heading truncate">
            {activeSession?.title ?? 'Chat'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
          {messagesQuery.isLoading && activeSessionId ? (
            <div className="flex justify-center py-8">
              <p className="text-sm text-body">Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 && !sendMutation.isPending ? (
            <EmptyState />
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}

          {sendMutation.isPending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {sendMutation.isError && (
          <div className="mx-4 mb-2 px-3.5 py-2 rounded-lg border border-red-300/50 bg-red-500/[0.08] text-xs text-red-500" role="alert">
            Não foi possível enviar a mensagem. Tente novamente.
          </div>
        )}

        <div className="border-t border-outline px-4 py-4">
          <div
            className={`flex items-end gap-2 rounded-2xl border px-4 py-2 transition-colors ${
              isInputDisabled ? 'border-outline bg-[var(--code-bg)]' : 'border-outline bg-canvas focus-within:border-accent focus-within:ring-2 focus-within:ring-[var(--accent-bg)]'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleKeyDown}
              placeholder={activeSessionId ? 'Faça uma pergunta sobre seus dados...' : 'Selecione ou crie uma sessão para começar'}
              rows={1}
              disabled={isInputDisabled}
              aria-label="Pergunta para o agente de IA"
              className="flex-1 resize-none text-sm text-heading bg-transparent focus:outline-none placeholder:text-gray-400 overflow-y-auto py-1.5 disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!question.trim() || isInputDisabled}
              aria-label="Enviar pergunta"
              className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mb-0.5"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-xs text-body mt-2 text-center">
            Enter para enviar · Shift+Enter para nova linha
          </p>
          <p className="text-center mt-1.5" style={{ fontSize: '12px', color: '#6b6b6b', fontWeight: 400 }}>
            Usando IA gratuita (Llama 3.3 via Groq) · Respostas podem variar — se algo parecer estranho, reformule ou repita a pergunta.
          </p>
        </div>
      </main>
    </div>
  );
};
