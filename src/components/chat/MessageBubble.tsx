import { ChatMessage } from '@/data/chat-scenarios';
import RichResponse from './RichResponse';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-user-msg text-text-primary px-4 py-3 rounded-2xl max-w-xl">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0 text-sm font-bold">
        AI
      </div>
      <div className="flex-1">
        <div className="text-text-primary mb-2 whitespace-pre-line">
          {message.content}
        </div>
        {message.richContent && <RichResponse content={message.richContent} />}
      </div>
    </div>
  );
}
