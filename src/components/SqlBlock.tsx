import { useState } from 'react';

interface SqlBlockProps {
  sql: string;
}

interface ChevronIconProps {
  isOpen: boolean;
}

const ChevronIcon = ({ isOpen }: ChevronIconProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const SqlBlock = ({ sql }: SqlBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs text-body hover:text-heading transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded"
        aria-expanded={isOpen}
        aria-controls="sql-block-content"
      >
        <ChevronIcon isOpen={isOpen} />
        SQL executado
      </button>
      {isOpen && (
        <pre
          id="sql-block-content"
          className="mt-2 px-3.5 py-3 rounded-lg text-xs font-mono text-heading bg-[var(--code-bg)] overflow-x-auto whitespace-pre leading-relaxed"
        >
          {sql}
        </pre>
      )}
    </div>
  );
};
