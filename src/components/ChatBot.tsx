import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ChatBotProps {
  isPremium: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const basicResponses = [
  'Хм, попробуйте спросить проще...',
  'Я немного запутался, можете уточнить?',
  'Интересный вопрос! Но я не уверен...',
  'Может быть, да, а может и нет 🤔',
  'Это сложно... А что если поискать в интернете?'
];

const premiumResponses = [
  'Отличный выбор! Я рекомендую бронировать заранее для лучших цен.',
  'Для этого направления лучше всего подойдет Аэрофлот или S7 - они предлагают прямые рейсы.',
  'Совет: если лететь в будний день, цена может быть на 30-40% ниже.',
  'Обратите внимание на время вылета - утренние рейсы обычно дешевле.',
  'Я могу помочь найти оптимальный маршрут с пересадками, если прямых рейсов нет.'
];

export default function ChatBot({ isPremium }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isPremium 
        ? 'Здравствуйте! Я GigaChat - ваш премиум-помощник. Готов помочь с выбором билетов и маршрутов!' 
        : 'Привет! Я бот-помощник. Постараюсь помочь, но могу немного путаться 😅',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');

    try {
      const response = await fetch('https://functions.poehali.dev/758a1ee1-8b4e-4fc1-9c15-4bac393d4177', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          isPremium: isPremium
        })
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Извините, произошла ошибка. Попробуйте еще раз.',
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const responses = isPremium ? premiumResponses : basicResponses;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl ${
          isPremium 
            ? 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-700' 
            : 'bg-primary'
        }`}
        style={isPremium ? {
          boxShadow: '0 0 30px rgba(234, 179, 8, 0.6), 0 0 60px rgba(234, 179, 8, 0.3)',
        } : {}}
      >
        <Icon name={isOpen ? 'X' : 'MessageCircle'} size={28} />
      </Button>

      {isOpen && (
        <Card 
          className={`fixed bottom-24 right-6 z-50 w-96 shadow-2xl ${
            isPremium 
              ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 border-yellow-500/30' 
              : 'bg-white'
          }`}
          style={isPremium ? {
            boxShadow: '0 0 40px rgba(234, 179, 8, 0.4)',
          } : {}}
        >
          <CardHeader className={`border-b ${isPremium ? 'border-yellow-500/20 bg-black/50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPremium ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                <h3 className={`font-bold ${isPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500' : 'text-foreground'}`}>
                  {isPremium ? '⚡ GigaChat' : '🤖 Помощник'}
                </h3>
              </div>
              {isPremium && (
                <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-1 rounded-full font-bold">
                  PREMIUM
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 overflow-y-auto mb-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? isPremium
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                          : 'bg-primary text-primary-foreground'
                        : isPremium
                        ? 'bg-gray-800 text-yellow-100 border border-yellow-500/20'
                        : 'bg-muted text-foreground'
                    }`}
                    style={isPremium && msg.sender === 'bot' ? {
                      boxShadow: '0 0 20px rgba(234, 179, 8, 0.1)',
                    } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isPremium ? 'Спросите что угодно...' : 'Задайте вопрос...'}
                className={isPremium ? 'bg-gray-800 border-yellow-500/20 text-yellow-100 placeholder:text-yellow-700' : ''}
              />
              <Button 
                onClick={handleSend}
                className={isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' : ''}
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}