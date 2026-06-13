import type { SessionResponseDto } from '../types/api.types';

interface SessionSidebarProps {
  sessions: SessionResponseDto[];
  activeSessionId: string | null;
  isCreating: boolean;
  isOpen: boolean;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onClose: () => void;
  onLogout: () => void;
}

const NerdBIIcon = () => (
  <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="10" fill="var(--accent-bg)" />
    <rect x="6" y="23" width="5" height="7" rx="1.5" fill="var(--accent)" />
    <rect x="13" y="16" width="5" height="14" rx="1.5" fill="var(--accent)" />
    <rect x="20" y="19" width="5" height="11" rx="1.5" fill="var(--accent)" opacity="0.75" />
    <rect x="27" y="11" width="5" height="19" rx="1.5" fill="var(--accent)" opacity="0.5" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const LogoutIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SidebarContent = ({
  sessions,
  activeSessionId,
  isCreating,
  onSelectSession,
  onNewSession,
  onLogout,
}: Omit<SessionSidebarProps, 'isOpen' | 'onClose'>) => (
  <>
    {/* Header */}
    <div className="flex items-center gap-2 px-4 py-4 border-b border-outline">
      <NerdBIIcon />
      <span className="text-sm font-medium text-heading">NerdBI</span>
    </div>

    {/* Nova sessão */}
    <div className="px-3 py-3">
      <button
        type="button"
        onClick={onNewSession}
        disabled={isCreating}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-heading rounded-lg border border-outline bg-canvas hover:border-accent/40 hover:text-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent"
      >
        <PlusIcon />
        {isCreating ? 'Criando...' : 'Nova sessão'}
      </button>
    </div>

    {/* Lista de sessões */}
    <nav aria-label="Sessões de conversa" className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-0.5">
      {sessions.length === 0 && !isCreating && (
        <p className="text-xs text-body px-3 py-2">Nenhuma sessão ainda.</p>
      )}
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectSession(session.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
              isActive
                ? 'bg-canvas text-heading'
                : 'text-body hover:bg-canvas/70 hover:text-heading'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <p className="text-sm font-medium truncate leading-snug">{session.title}</p>
            <p className="text-xs text-body mt-0.5">{formatDate(session.updatedAt)}</p>
          </button>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="px-3 py-3 border-t border-outline">
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-body rounded-lg hover:text-accent hover:bg-canvas transition-colors focus-visible:outline-2 focus-visible:outline-accent"
      >
        <LogoutIcon />
        Sair
      </button>
    </div>
  </>
);

export const SessionSidebar = ({
  sessions,
  activeSessionId,
  isCreating,
  isOpen,
  onSelectSession,
  onNewSession,
  onClose,
  onLogout,
}: SessionSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[var(--code-bg)] border-r border-outline
          transition-transform duration-200 ease-in-out
          sm:relative sm:translate-x-0 sm:inset-auto sm:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Navegação de sessões"
      >
        <SidebarContent
          sessions={sessions}
          activeSessionId={activeSessionId}
          isCreating={isCreating}
          onSelectSession={onSelectSession}
          onNewSession={onNewSession}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
};

export default SessionSidebar;
