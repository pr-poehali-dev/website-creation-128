import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import CityAutocomplete from '@/components/CityAutocomplete';
import AirlineSelector from '@/components/AirlineSelector';
import ChatBot from '@/components/ChatBot';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import TiltCard from '@/components/TiltCard';
import ScrollReveal from '@/components/ScrollReveal';

const airlines = [
  { name: 'Аэрофлот', logo: '✈️', url: 'https://www.aeroflot.ru', color: 'from-red-500 to-rose-600' },
  { name: 'Utair', logo: '🛫', url: 'https://www.utair.ru', color: 'from-amber-500 to-orange-600' },
  { name: 'Ямал', logo: '🛩️', url: 'https://www.yamal.aero', color: 'from-sky-500 to-blue-600' },
  { name: 'S7', logo: '🟢', url: 'https://www.s7.ru', color: 'from-emerald-500 to-green-600' },
];

const popularDestinations = [
  { city: 'Москва', price: '5 490', emoji: '🏛️', desc: 'Столица России' },
  { city: 'Санкт-Петербург', price: '4 200', emoji: '🌉', desc: 'Культурная столица' },
  { city: 'Сочи', price: '8 300', emoji: '🏖️', desc: 'Курорт у моря' },
  { city: 'Казань', price: '6 100', emoji: '🕌', desc: 'Третья столица' },
  { city: 'Владивосток', price: '12 900', emoji: '🌊', desc: 'Край света' },
  { city: 'Калининград', price: '7 400', emoji: '🏰', desc: 'Европейский шарм' },
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
  const [showMaintenance, setShowMaintenance] = useState(true);

  const showError = () => {
    toast.error('Сервис временно недоступен. Попробуйте позже.', {
      description: 'Ведутся технические работы на серверах',
    });
  };
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setUserCity('Москва'),
        () => setUserCity('Москва')
      );
    }
  }, []);

  const bgBase = isPremium
    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black'
    : isDark
      ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900'
      : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30';

  return (
    <div className={`min-h-screen ${bgBase} transition-all duration-700`}>

      {showMaintenance && (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-fade-in">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Icon name="AlertTriangle" size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm md:text-base truncate">Технические работы</p>
                  <p className="text-white/80 text-xs md:text-sm truncate">В связи с повреждением серверов некоторые функции временно недоступны. Приносим извинения.</p>
                </div>
              </div>
              <button
                onClick={() => setShowMaintenance(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <Icon name="X" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`fixed left-0 right-0 z-50 transition-all duration-300 ${showMaintenance ? 'top-[52px] md:top-[48px]' : 'top-0'} ${isPremium ? 'glass-premium' : isDark ? 'glass-dark' : 'glass-strong'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-3d transition-transform duration-300 hover:scale-110 hover:rotate-6 ${
              isPremium ? 'gradient-premium' : 'gradient-primary'
            }`}>
              <Icon name="Plane" className="text-white" size={22} />
            </div>
            <h1
              className={`text-xl font-extrabold tracking-tight cursor-pointer select-none transition-all duration-300 ${
                isPremium ? 'text-gradient gradient-premium' : isDark ? 'text-white' : 'text-foreground'
              }`}
              onClick={() => {
                const n = titleClickCount + 1;
                setTitleClickCount(n);
                if (n === 3) {
                  setShowPremiumDialog(true);
                  setTitleClickCount(0);
                }
              }}
            >
              Путешествие.ру
            </h1>
            {isPremium && (
              <span className="text-[10px] gradient-premium text-white px-2 py-0.5 rounded-full font-bold tracking-wider animate-glow-pulse">
                PREMIUM
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <nav className="hidden md:flex gap-1 items-center">
              {['Главная', 'Билеты', 'Направления'].map(item => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => { e.preventDefault(); showError(); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isPremium
                      ? 'text-yellow-200/80 hover:text-yellow-100 hover:bg-yellow-500/10'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                isPremium
                  ? 'hover:bg-yellow-500/10 text-yellow-400'
                  : isDark
                    ? 'hover:bg-white/10 text-slate-300'
                    : 'hover:bg-black/5 text-muted-foreground'
              }`}
            >
              <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className={`relative pb-8 px-4 overflow-hidden transition-all duration-300 ${showMaintenance ? 'pt-40' : 'pt-28'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
            isPremium ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 ${
            isPremium ? 'bg-orange-500' : 'bg-purple-500'
          }`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${
            isPremium ? 'bg-amber-400' : 'bg-indigo-400'
          }`} />
          <div className="plane-fly absolute top-1/3 text-4xl md:text-5xl opacity-30" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
            ✈️
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 float-3d-slow shadow-3d ${
              isPremium
                ? 'glass-premium text-yellow-300'
                : isDark
                  ? 'glass-dark text-slate-300'
                  : 'glass text-muted-foreground'
            }`}>
              <Icon name="Sparkles" size={16} />
              {isPremium ? 'Premium-поиск активирован' : 'Умный поиск билетов'}
            </div>
            <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 depth-text ${
              isPremium
                ? 'text-gradient gradient-premium'
                : isDark ? 'text-white' : 'text-foreground'
            }`}>
              Найди свой
              <br />
              <span className={isPremium ? '' : 'text-gradient gradient-primary'}>
                идеальный рейс
              </span>
            </h2>
            {isPremium && (
              <p className="text-xs text-yellow-400/60 font-mono mb-2">
                {PREMIUM_CODE}
              </p>
            )}
            <p className={`text-lg md:text-xl max-w-xl mx-auto ${
              isPremium ? 'text-yellow-100/60' : isDark ? 'text-slate-400' : 'text-muted-foreground'
            }`}>
              Сравнивай цены от всех авиакомпаний и бронируй выгодно
            </p>
          </div>

          <TiltCard tiltMax={5} scale={1.01} className={`max-w-3xl mx-auto rounded-3xl p-6 md:p-8 animate-scale-in shadow-3d shadow-3d-hover ${
            isPremium ? 'glass-premium' : isDark ? 'glass-dark' : 'glass-strong'
          }`}>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              <CityAutocomplete
                value={fromCity}
                onChange={setFromCity}
                placeholder={userCity || "Откуда"}
                label="Откуда"
                isPremium={isPremium}
              />
              <CityAutocomplete
                value={toCity}
                onChange={setToCity}
                placeholder="Куда"
                label="Куда"
                isPremium={isPremium}
              />
              <div>
                <label className={`text-sm font-medium mb-2 block ${
                  isPremium ? 'text-yellow-300/80' : isDark ? 'text-slate-400' : 'text-muted-foreground'
                }`}>Дата</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`h-12 rounded-xl border-0 ${
                    isPremium
                      ? 'bg-white/5 text-yellow-100 focus:ring-yellow-500/30'
                      : isDark
                        ? 'bg-white/5 text-slate-200 focus:bg-white/10'
                        : 'bg-white/70 focus:bg-white text-foreground'
                  }`}
                />
              </div>
            </div>
            <Button
              size="lg"
              className={`w-full h-14 text-base font-semibold rounded-2xl transition-all duration-300 ${
                isPremium
                  ? 'gradient-premium text-black hover:opacity-90 shadow-lg shadow-yellow-500/25'
                  : 'gradient-primary text-white hover:opacity-90 shadow-lg shadow-blue-500/25'
              }`}
              onClick={showError}
            >
              <Icon name="Search" className="mr-2" size={20} />
              Найти билеты
            </Button>
          </TiltCard>
        </div>
      </section>

      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 opacity-5 ${
            isPremium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 via-white to-blue-500'
          }`} />
        </div>
        <div className="container mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 depth-text ${
                isPremium ? 'text-gradient gradient-premium' : isDark ? 'text-white' : 'text-foreground'
              }`}>
                С Годом народного единства!
              </h3>
              <p className={`text-base ${isPremium ? 'text-yellow-100/50' : isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>
                Откройте красоту России
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { city: 'Москва', emoji: '🏛️', price: '5 490' },
              { city: 'Санкт-Петербург', emoji: '🌉', price: '4 200' },
              { city: 'Казань', emoji: '🕌', price: '6 100' },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 120}>
                <TiltCard
                  tiltMax={15}
                  className={`rounded-2xl p-5 text-center cursor-pointer shadow-3d shadow-3d-hover ${
                    isPremium
                      ? 'glass-premium hover:border-yellow-500/40'
                      : isDark
                        ? 'glass-dark hover:border-white/10'
                        : 'glass-strong'
                  }`}
                  onClick={showError}
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <p className={`font-bold ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>{item.city}</p>
                  <p className={`text-sm ${isPremium ? 'text-yellow-400/60' : isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>от {item.price} ₽</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 depth-text ${
                isPremium ? 'text-gradient gradient-premium' : isDark ? 'text-white' : 'text-foreground'
              }`}>
                Популярные направления
              </h3>
              <p className={`text-base ${isPremium ? 'text-yellow-100/50' : isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>
                Лучшие цены на ближайшие даты
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {popularDestinations.map((dest, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? 'up' : 'scale'} delay={i * 100}>
                <TiltCard
                  tiltMax={12}
                  className={`group rounded-2xl overflow-hidden cursor-pointer shadow-3d shadow-3d-hover ${
                    isPremium ? 'glass-premium hover:border-yellow-500/40' : isDark ? 'glass-dark hover:border-white/10' : 'glass-strong'
                  }`}
                  onClick={showError}
                >
                  <div className={`h-28 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110 ${
                    isPremium
                      ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
                      : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                  }`}>
                    {dest.emoji}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-lg font-bold ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>
                        {dest.city}
                      </h4>
                      <Icon
                        name="ArrowUpRight"
                        size={18}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isPremium ? 'text-yellow-400' : 'text-primary'
                        }`}
                      />
                    </div>
                    <p className={`text-xs mb-3 ${isPremium ? 'text-yellow-100/40' : isDark ? 'text-slate-500' : 'text-muted-foreground'}`}>
                      {dest.desc}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xs ${isPremium ? 'text-yellow-100/40' : isDark ? 'text-slate-500' : 'text-muted-foreground'}`}>от</span>
                      <span className={`text-xl font-extrabold ${
                        isPremium ? 'text-gradient gradient-premium' : 'text-gradient gradient-primary'
                      }`}>
                        {dest.price} ₽
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-2 depth-text ${
                isPremium ? 'text-gradient gradient-premium' : isDark ? 'text-white' : 'text-foreground'
              }`}>
                Авиакомпании-партнёры
              </h3>
              <p className={`text-base ${isPremium ? 'text-yellow-100/50' : isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>
                Переходите на сайт для бронирования
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {airlines.map((airline, i) => (
              <ScrollReveal key={i} direction="flip" delay={i * 100}>
                <TiltCard
                  tiltMax={18}
                  className={`group rounded-2xl p-6 text-center cursor-pointer shadow-3d shadow-3d-hover ${
                    isPremium ? 'glass-premium hover:border-yellow-500/40' : isDark ? 'glass-dark hover:border-white/10' : 'glass-strong'
                  }`}
                  onClick={showError}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${airline.color} flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {airline.logo}
                  </div>
                  <h4 className={`text-base font-bold mb-1 ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>
                    {airline.name}
                  </h4>
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`text-xs ${isPremium ? 'text-yellow-400' : 'text-primary'}`}>Перейти</span>
                    <Icon name="ExternalLink" size={12} className={isPremium ? 'text-yellow-400' : 'text-primary'} />
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal direction="up">
      <footer className={`py-10 px-4 ${isPremium ? 'glass-premium' : isDark ? 'glass-dark' : 'glass-strong'}`}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isPremium ? 'gradient-premium' : 'gradient-primary'
                }`}>
                  <Icon name="Plane" size={16} className="text-white" />
                </div>
                <span className={`font-bold ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>
                  Путешествие.ру
                </span>
              </div>
              <p className={`text-sm ${isPremium ? 'text-yellow-100/40' : isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>
                Находим лучшие билеты для ваших путешествий
              </p>
            </div>
            <div>
              <h5 className={`font-bold mb-3 text-sm ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>Разделы</h5>
              <ul className="space-y-2">
                {['Главная', 'Билеты', 'Направления'].map(item => (
                  <li key={item}>
                    <a href="#" className={`text-sm transition-colors ${
                      isPremium ? 'text-yellow-100/40 hover:text-yellow-300' : isDark ? 'text-slate-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className={`font-bold mb-3 text-sm ${isPremium ? 'text-yellow-100' : isDark ? 'text-white' : 'text-foreground'}`}>Контакты</h5>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={14} className={isPremium ? 'text-yellow-400' : 'text-muted-foreground'} />
                  <span className={`text-sm ${isPremium ? 'text-yellow-100/60' : 'text-muted-foreground'}`}>8-800-555-35-35</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} className={isPremium ? 'text-yellow-400' : 'text-muted-foreground'} />
                  <span className={`text-sm ${isPremium ? 'text-yellow-100/60' : 'text-muted-foreground'}`}>info@puteshestvie.ru</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      </ScrollReveal>

      <AirlineSelector
        open={showAirlineSelector}
        onClose={() => setShowAirlineSelector(false)}
        fromCity={selectedDestination?.from || fromCity}
        toCity={selectedDestination?.to || toCity}
        date={date}
        isPremium={isPremium}
        isDark={isDark}
      />

      <ChatBot isPremium={isPremium} isDark={isDark} />

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className={`sm:max-w-sm rounded-3xl border-0 ${isDark ? 'glass-dark' : 'glass-strong'}`}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-extrabold text-gradient gradient-premium">
              Premium доступ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>
              Введите код для активации
            </p>
            <Input
              value={premiumInput}
              onChange={(e) => setPremiumInput(e.target.value.toUpperCase())}
              placeholder="Введите код"
              className={`text-center text-lg font-mono h-12 rounded-xl border-0 ${isDark ? 'bg-white/5 text-white' : 'bg-white/50'}`}
              maxLength={20}
            />
            <Button
              className="w-full h-12 rounded-xl gradient-primary text-white font-semibold"
              onClick={() => {
                if (premiumInput === PREMIUM_CODE) {
                  setIsPremium(true);
                  setShowPremiumDialog(false);
                  setPremiumInput('');
                  toast.success('Premium-режим активирован!');
                } else {
                  toast.error('Неверный код');
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