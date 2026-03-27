'use client';

import { useState } from 'react';
import { scenarios, suggestionCards, ChatMessage } from '@/data/chat-scenarios';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import SuggestionCards from './SuggestionCards';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    // 사용자 메시지 추가
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);

    // 시나리오 찾기
    setIsTyping(true);
    setTimeout(() => {
      let found = false;
      for (const [key, scenario] of Object.entries(scenarios)) {
        if (content.includes(key) || key.includes(content.replace(/\s/g, ''))) {
          setMessages((prev) => [...prev, scenario[1]]);
          found = true;
          break;
        }
      }

      if (!found) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '현재 데모 버전입니다. 다음 질문을 시도해보세요:\n\n• 압구정동 실거래가\n• 중개수수료 얼마인가요\n• 전세사기 예방 방법\n• 거래신고 절차',
          },
        ]);
      }
      setIsTyping(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 mt-12">
              <div className="text-6xl mb-4">🏛️</div>
              <h2 className="text-3xl font-bold text-primary mb-2">강남부동산톡</h2>
              <p className="text-text-secondary text-lg">
                강남 부동산, 무엇이든 물어보세요
              </p>
            </div>
            <SuggestionCards suggestions={suggestionCards} onSelect={handleSuggestionClick} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
                  AI
                </div>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
