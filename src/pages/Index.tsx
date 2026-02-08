import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import CityAutocomplete from '@/components/CityAutocomplete';
import AirlineSelector from '@/components/AirlineSelector';
import ChatBot from '@/components/ChatBot';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const airlines = [
  { 
    name: 'Аэрофлот', 
    logo: '✈️', 
    url: 'https://www.aeroflot.ru',
    color: 'from-red-500 to-red-600'
  },
  { 
    name: 'Utair', 
    logo: '🛫', 
    url: 'https://www.utair.ru',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    name: 'Ямал', 
    logo: '🛩️', 
    url: 'https://www.yamal.aero',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'S7', 
    logo: '🚁', 
    url: 'https://www.s7.ru',
    color: 'from-green-500 to-green-600'
  },
];

const popularDestinations = [
  { city: 'Москва', country: 'Россия', price: '5 490', image: '🏛️' },
  { city: 'Санкт-Петербург', country: 'Россия', price: '4 200', image: '🌉' },
  { city: 'Сочи', country: 'Россия', price: '8 300', image: '🏖️' },
  { city: 'Казань', country: 'Россия', price: '6 100', image: '🕌' },
  { city: 'Владивосток', country: 'Россия', price: '12 900', image: '🌊' },
  { city: 'Калининград', country: 'Россия', price: '7 400', image: '🏰' },
];

const PREMIUM_CODE = 'PREMIUM2025';

export default function Index() {
  const [userCity, setUserCity] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [showAirlineSelector, setShowAirlineSelector] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{from: string, to: string} | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumInput, setPremiumInput] = useState('');
  const [titleClickCount, setTitleClickCount] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setUserCity('Москва');
        },
        () => {
          setUserCity('Определение города...');
        }
      );
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isPremium 
        ? 'bg-gradient-to-b from-gray-950 via-black to-gray-900' 
        : 'bg-gradient-to-b from-blue-50 to-white'
    }`}>
      <header className={`shadow-sm sticky top-0 z-50 transition-colors duration-500 ${
        isPremium 
          ? 'bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-500/20' 
          : 'bg-white'
      }`} style={isPremium ? {
        boxShadow: '0 4px 20px rgba(234, 179, 8, 0.1)'
      } : {}}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon 
              name="Plane" 
              className={isPremium ? 'text-yellow-500' : 'text-primary'} 
              size={32} 
              style={isPremium ? {
                filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))'
              } : {}}
            />
            <h1 
              className={`text-2xl md:text-3xl font-bold cursor-pointer select-none transition-all duration-300 ${
                isPremium 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:scale-105' 
                  : 'text-primary'
              }`}
              onClick={() => {
                const newCount = titleClickCount + 1;
                setTitleClickCount(newCount);
                if (newCount === 3) {
                  setShowPremiumDialog(true);
                  setTitleClickCount(0);
                }
              }}
              style={isPremium ? {
                textShadow: '0 0 30px rgba(234, 179, 8, 0.5), 0 0 60px rgba(234, 179, 8, 0.3)',
                transform: 'perspective(1000px) rotateX(0deg)',
                transition: 'all 0.3s ease'
              } : {}}
            >
              Путешествие.ру
            </h1>
            {isPremium && (
              <span 
                className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold animate-pulse"
                style={{
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.6)'
                }}
              >
                ⚡ PREMIUM
              </span>
            )}
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#" className={`transition-colors ${
              isPremium 
                ? 'text-yellow-200 hover:text-yellow-400' 
                : 'text-foreground hover:text-primary'
            }`}>Главная</a>
            <a href="#tickets" className={`transition-colors ${
              isPremium 
                ? 'text-yellow-200 hover:text-yellow-400' 
                : 'text-foreground hover:text-primary'
            }`}>Билеты</a>
          </nav>
        </div>
      </header>

      <section className={`relative text-white py-20 md:py-32 overflow-hidden transition-all duration-500 ${
        isPremium 
          ? 'bg-gradient-to-r from-black via-gray-900 to-black' 
          : 'bg-gradient-to-r from-primary to-blue-600'
      }`} style={isPremium ? {
        boxShadow: 'inset 0 0 100px rgba(234, 179, 8, 0.1)'
      } : {}}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-20 left-10 text-8xl ${isPremium ? 'animate-pulse' : ''}`} style={isPremium ? {
            filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.8))'
          } : {}}>✈️</div>
          <div className={`absolute bottom-10 right-20 text-6xl ${isPremium ? 'animate-pulse' : ''}`} style={isPremium ? {
            filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.8))'
          } : {}}>🌍</div>
          <div className={`absolute top-40 right-40 text-7xl ${isPremium ? 'animate-pulse' : ''}`} style={isPremium ? {
            filter: 'drop-shadow(0 0 30px rgba(234, 179, 8, 0.8))'
          } : {}}>☁️</div>
          {isPremium && (
            <>
              <div className="absolute top-1/2 left-1/4 text-6xl animate-pulse" style={{
                filter: 'drop-shadow(0 0 40px rgba(234, 179, 8, 0.6))'
              }}>⭐</div>
              <div className="absolute bottom-1/3 right-1/3 text-5xl animate-pulse" style={{
                filter: 'drop-shadow(0 0 40px rgba(234, 179, 8, 0.6))'
              }}>💎</div>
            </>
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-300 ${
              isPremium 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500' 
                : ''
            }`} style={isPremium ? {
              textShadow: '0 0 40px rgba(234, 179, 8, 0.5)',
              transform: 'perspective(1000px) rotateX(5deg)'
            } : {}}>
              Найди лучшие билеты
            </h2>
            {isPremium && (
              <p className="text-sm text-yellow-300 mb-4 font-mono animate-pulse" style={{
                textShadow: '0 0 10px rgba(234, 179, 8, 0.8)'
              }}>
                🔑 Код доступа: {PREMIUM_CODE}
              </p>
            )}
            <p className={`text-xl md:text-2xl mb-8 ${
              isPremium ? 'text-yellow-100' : 'text-blue-100'
            }`}>
              Сравнивай цены от всех авиакомпаний и бронируй выгодно
            </p>
            {userCity && (
              <div className="flex items-center justify-center gap-2 mb-8 text-blue-100">
                <Icon name="MapPin" size={20} />
                <span>Ваше местоположение: {userCity}</span>
              </div>
            )}

            <Card className={`backdrop-blur-sm shadow-2xl animate-scale-in transition-all duration-500 ${
              isPremium 
                ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-yellow-500/30' 
                : 'bg-white/95'
            }`} style={isPremium ? {
              boxShadow: '0 0 60px rgba(234, 179, 8, 0.3), 0 20px 40px rgba(0,0,0,0.5)',
              transform: 'perspective(1000px) rotateX(2deg)'
            } : {}}>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <CityAutocomplete
                    value={fromCity}
                    onChange={setFromCity}
                    placeholder={userCity || "Город отправления"}
                    label="Откуда"
                    isPremium={isPremium}
                  />
                  <CityAutocomplete
                    value={toCity}
                    onChange={setToCity}
                    placeholder="Город назначения"
                    label="Куда"
                    isPremium={isPremium}
                  />
                  <div>
                    <label className={`text-sm font-medium mb-2 block ${
                      isPremium ? 'text-yellow-300' : 'text-foreground'
                    }`}>Дата</label>
                    <Input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`h-12 ${
                        isPremium ? 'bg-gray-800 border-yellow-500/30 text-yellow-100' : ''
                      }`}
                    />
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                    isPremium 
                      ? 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-700 text-black font-bold' 
                      : ''
                  }`}
                  style={isPremium ? {
                    boxShadow: '0 0 30px rgba(234, 179, 8, 0.5), 0 10px 20px rgba(0,0,0,0.3)',
                    transform: 'perspective(1000px)'
                  } : {}}
                  onClick={() => {
                    if (fromCity && toCity) {
                      setSelectedDestination({ from: fromCity, to: toCity });
                      setShowAirlineSelector(true);
                    }
                  }}
                >
                  <Icon name="Search" className="mr-2" />
                  {isPremium ? '⚡ Найти билеты PREMIUM' : 'Найти билеты'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-600 via-white to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🇷🇺</div>
          <div className="absolute bottom-10 right-10 text-6xl">🇷🇺</div>
          <div className="absolute top-20 right-20 text-5xl">🎆</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              С Годом народного единства!
            </h3>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Откройте для себя красоту России - путешествуйте по родной стране!
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card 
                className="border-2 border-red-200 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => {
                  setFromCity(userCity || 'Москва');
                  setToCity('Москва');
                  setSelectedDestination({ from: userCity || 'Москва', to: 'Москва' });
                  setShowAirlineSelector(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🏛️</div>
                  <p className="font-semibold">Москва</p>
                  <p className="text-sm text-muted-foreground">от 5 490 ₽</p>
                </CardContent>
              </Card>
              <Card 
                className="border-2 border-blue-200 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => {
                  setFromCity(userCity || 'Москва');
                  setToCity('Санкт-Петербург');
                  setSelectedDestination({ from: userCity || 'Москва', to: 'Санкт-Петербург' });
                  setShowAirlineSelector(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🌉</div>
                  <p className="font-semibold">Санкт-Петербург</p>
                  <p className="text-sm text-muted-foreground">от 4 200 ₽</p>
                </CardContent>
              </Card>
              <Card 
                className="border-2 border-red-200 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => {
                  setFromCity(userCity || 'Москва');
                  setToCity('Казань');
                  setSelectedDestination({ from: userCity || 'Москва', to: 'Казань' });
                  setShowAirlineSelector(true);
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🕌</div>
                  <p className="font-semibold">Казань</p>
                  <p className="text-sm text-muted-foreground">от 6 100 ₽</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="tickets" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Наши партнёры</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {airlines.map((airline, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden"
                onClick={() => window.open(airline.url, '_blank')}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${airline.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                    {airline.logo}
                  </div>
                  <h4 className="text-xl font-bold mb-2">{airline.name}</h4>
                  <p className="text-muted-foreground mb-4">Перейти на сайт</p>
                  <Icon name="ExternalLink" className="mx-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Популярные направления</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {popularDestinations.map((dest, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden group"
                onClick={() => {
                  setSelectedDestination({ from: userCity || 'Москва', to: dest.city });
                  setShowAirlineSelector(true);
                }}
              >
                <div className="h-40 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                  {dest.image}
                </div>
                <CardContent className="p-6">
                  <h4 className="text-2xl font-bold mb-1">{dest.city}</h4>
                  <p className="text-muted-foreground mb-4">{dest.country}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">от</span>
                    <span className="text-2xl font-bold text-primary">{dest.price} ₽</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Plane" size={28} />
                <h4 className="text-xl font-bold">Путешествие.ру</h4>
              </div>
              <p className="text-gray-400">Находим лучшие билеты для ваших путешествий</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Разделы</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Главная</a></li>
                <li><a href="#tickets" className="hover:text-white transition-colors">Билеты</a></li>
                <li><a href="#profile" className="hover:text-white transition-colors">Профиль</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Контакты</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>8-800-555-35-35</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@puteshestvie.ru</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <AirlineSelector 
        open={showAirlineSelector}
        onClose={() => setShowAirlineSelector(false)}
        fromCity={selectedDestination?.from || fromCity}
        toCity={selectedDestination?.to || toCity}
        date={date}
      />

      <ChatBot isPremium={isPremium} />

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🌟 Premium доступ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              Введите код для активации премиум-режима
            </p>
            <Input
              value={premiumInput}
              onChange={(e) => setPremiumInput(e.target.value.toUpperCase())}
              placeholder="Введите код"
              className="text-center text-lg font-mono"
              maxLength={20}
            />
            <Button
              className="w-full"
              onClick={() => {
                if (premiumInput === PREMIUM_CODE) {
                  setIsPremium(true);
                  setShowPremiumDialog(false);
                  setPremiumInput('');
                  toast.success('🎉 Premium-режим активирован!');
                } else {
                  toast.error('❌ Неверный код');
                }
              }}
            >
              Активировать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}