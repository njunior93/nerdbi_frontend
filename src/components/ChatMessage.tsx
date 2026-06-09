import type { MessageResponseDto } from '../types/api.types';
import { ChartBlock } from './ChartBlock';
import { SqlBlock } from './SqlBlock';

interface ChatMessageProps {
  message: MessageResponseDto;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed"
          style={{
            background: '#534AB7',
            color: '#EEEDFE',
            borderRadius: '12px 12px 2px 12px',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div
        className="max-w-[90%] px-4 py-3 bg-canvas border border-outline"
        style={{ borderRadius: '12px 12px 12px 2px' }}
      >
        <p className="text-sm text-heading whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        {message.chartConfig && <ChartBlock config={message.chartConfig} />}
        {message.sql && <SqlBlock sql={message.sql} />}
      </div>
    </div>
  );
};

export default ChatMessage;
