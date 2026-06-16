interface RateLimitMessageProps {
  onRetry: () => void;
}

export const RateLimitMessage = ({ onRetry }: RateLimitMessageProps) => (
  <div className="flex justify-start">
    <div
      role="alert"
      className="max-w-[90%] px-5 py-4"
      style={{
        background: '#eff8ff',
        border: '0.5px solid rgba(37, 99, 235, 0.2)',
        borderRadius: '12px 12px 12px 2px',
      }}
    >
      <p style={{ fontSize: '12px', fontWeight: 500, color: '#2563eb' }}>
        ⏳ Serviço temporariamente indisponível
      </p>
      <hr className="my-2" style={{ borderColor: 'rgba(37, 99, 235, 0.15)' }} />
      <p style={{ fontSize: '12px', fontWeight: 400, color: '#6b6b6b' }}>
        O assistente de IA atingiu o limite de uso por este período. Aguarde alguns minutos e tente enviar sua pergunta novamente.
      </p>
      <p className="mt-2" style={{ fontSize: '11px', fontWeight: 400, color: '#9b9b9b' }}>
        Geralmente se resolve em 1 a 3 minutos.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 bg-transparent border-0 p-0 cursor-pointer underline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ fontSize: '12px', fontWeight: 400, color: '#2563eb' }}
      >
        Tentar novamente
      </button>
    </div>
  </div>
);
