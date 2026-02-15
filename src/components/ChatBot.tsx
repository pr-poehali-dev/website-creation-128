import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ChatBotProps {
  isPremium: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatBot({ isPremium }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isPremium
        ? 'Добро пожаловать! Я ваш Premium-ассистент. Помогу подобрать лучшие билеты и маршруты.'
        : 'Привет! Я бот-помощник. Постараюсь помочь, но могу немного путаться',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/758a1ee1-8b4e-4fc1-9c15-4bac393d4177', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, isPremium })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Произошла ошибка. Попробуйте ещё раз.',
        sender: 'bot'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Не удалось подключиться. Проверьте интернет.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          isPremium
            ? 'gradient-premium shadow-lg shadow-yellow-500/30'
            : 'gradient-primary shadow-lg shadow-blue-500/30'
        }`}
      >
        <Icon name={isOpen ? 'X' : 'MessageCircle'} size={24} className="text-white" />
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-3xl overflow-hidden animate-slide-up ${
          isPremium ? 'glass-premium' : 'glass-strong'
        }`}>
          <div className={`px-5 py-4 border-b ${
            isPremium ? 'border-yellow-500/10' : 'border-black/5'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isPremium ? 'gradient-premium' : 'gradient-primary'
              }`}>
                <Icon name="Bot" size={18} className="text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${
                  isPremium ? 'text-gradient gradient-premium' : 'text-foreground'
                }`}>
                  {isPremium ? 'Premium Ассистент' : 'Помощник'}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isPremium ? 'bg-yellow-400' : 'bg-emerald-400'
                  }`} />
                  <span className={`text-[10px] ${
                    isPremium ? 'text-yellow-100/40' : 'text-muted-foreground'
                  }`}>
                    Онлайн
                  </span>
                </div>
              </div>
              {isPremium && (
                <span className="ml-auto text-[9px] gradient-premium text-white px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="h-80 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user'
                    ? isPremium
                      ? 'gradient-premium text-black font-medium'
                      : 'gradient-primary text-white'
                    : isPremium
                      ? 'bg-white/5 text-yellow-100/80 border border-yellow-500/10'
                      : 'bg-white/60 text-foreground border border-white/20'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-4 py-3 ${
                  isPremium ? 'bg-white/5 border border-yellow-500/10' : 'bg-white/60 border border-white/20'
                }`}>
                  <div className="flex gap-1.5">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isPremium ? 'bg-yellow-400' : 'bg-blue-400'}`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isPremium ? 'bg-yellow-400' : 'bg-blue-400'}`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isPremium ? 'bg-yellow-400' : 'bg-blue-400'}`} style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`px-4 pb-4 pt-2 border-t ${
            isPremium ? 'border-yellow-500/10' : 'border-black/5'
          }`}>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className={`h-11 rounded-xl border-0 text-sm ${
                  isPremium
                    ? 'bg-white/5 text-yellow-100 placeholder:text-yellow-100/30'
                    : 'bg-white/60 text-foreground placeholder:text-muted-foreground'
                }`}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className={`h-11 w-11 rounded-xl p-0 ${
                  isPremium
                    ? 'gradient-premium text-black'
                    : 'gradient-primary text-white'
                }`}
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
