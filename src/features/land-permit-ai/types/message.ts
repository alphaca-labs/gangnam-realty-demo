import type { RichSlot, MessageMeta } from '../components/v2/cards/types';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  slots?: RichSlot[];
  meta?: MessageMeta;
}
