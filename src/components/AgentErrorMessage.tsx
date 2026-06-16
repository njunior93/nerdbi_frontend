interface AgentErrorMessageProps {
  content: string;
}

export const AgentErrorMessage = ({ content }: AgentErrorMessageProps) => (
  <div className="flex justify-start">
    <div
      role="alert"
      className="max-w-[90%] px-5 py-4"
      style={{
        background: '#fef9ee',
        border: '0.5px solid rgba(180, 83, 9, 0.2)',
        borderRadius: '12px 12px 12px 2px',
      }}
    >
      <p style={{ fontSize: '12px', fontWeight: 500, color: '#b45309' }}>
        ⚠ Não consegui processar essa solicitação
      </p>
      <hr className="my-2" style={{ borderColor: 'rgba(180, 83, 9, 0.15)' }} />
      <p style={{ fontSize: '12px', fontWeight: 400, color: '#6b6b6b', fontStyle: 'italic' }}>
        {content}
      </p>
      <p className="mt-3" style={{ fontSize: '11px', fontWeight: 400, color: '#9b9b9b' }}>
        Dicas para tentar de novo:
      </p>
      <ul className="mt-1 list-disc list-inside space-y-0.5">
        {['Mencione o nome da tabela ou coluna', 'Reformule com mais contexto', 'Repita a mesma pergunta — às vezes funciona'].map((tip) => (
          <li key={tip} style={{ fontSize: '12px', fontWeight: 400, color: '#6b6b6b' }}>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
