import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

export default function Index() {
  const [userCity, setUserCity] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Plane" className="text-primary" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Путешествие.ру</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#tickets" className="text-foreground hover:text-primary transition-colors">Билеты</a>
            <a href="#profile" className="text-foreground hover:text-primary transition-colors">Профиль</a>
          </nav>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl">✈️</div>
          <div className="absolute bottom-10 right-20 text-6xl">🌍</div>
          <div className="absolute top-40 right-40 text-7xl">☁️</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Найди лучшие билеты
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Сравнивай цены от всех авиакомпаний и бронируй выгодно
            </p>
            {userCity && (
              <div className="flex items-center justify-center gap-2 mb-8 text-blue-100">
                <Icon name="MapPin" size={20} />
                <span>Ваше местоположение: {userCity}</span>
              </div>
            )}

            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-scale-in">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Откуда</label>
                    <Input 
                      placeholder={userCity || "Город отправления"} 
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Куда</label>
                    <Input 
                      placeholder="Город назначения" 
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Дата</label>
                    <Input 
                      type="date" 
                      className="h-12"
                    />
                  </div>
                </div>
                <Button size="lg" className="w-full h-12 text-lg font-semibold">
                  <Icon name="Search" className="mr-2" />
                  Найти билеты
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-6xl">✈️</span>
                <h3 className="text-4xl font-bold">Аэрофлот</h3>
              </div>
              <p className="text-xl mb-4">Специальное предложение: скидка до 30% на международные рейсы</p>
              <ul className="space-y-2 text-lg">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={20} />
                  Москва → Париж от 15 900 ₽
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={20} />
                  Москва → Дубай от 18 500 ₽
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={20} />
                  Москва → Бангкок от 24 200 ₽
                </li>
              </ul>
            </div>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
              Узнать подробнее
            </Button>
          </div>
        </div>
      </section>

      <section id="tickets" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Выберите авиакомпанию</h3>
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
    </div>
  );
}
