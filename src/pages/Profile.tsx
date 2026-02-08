import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleYandexLogin = () => {
    alert('Интеграция с Яндекс ID будет добавлена. Для демонстрации входим автоматически.');
    setUser({
      name: 'Иван Петров',
      email: 'ivan.petrov@yandex.ru'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Plane" className="text-primary" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Путешествие.ру</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="/#tickets" className="text-foreground hover:text-primary transition-colors">Билеты</a>
            <a href="/profile" className="text-primary font-semibold transition-colors">Профиль</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {!user ? (
            <Card className="shadow-xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Вход в личный кабинет</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-5xl">
                    ✈️
                  </div>
                  <p className="text-muted-foreground">
                    Войдите через Яндекс ID, чтобы получить доступ к истории бронирований и персональным предложениям
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold bg-yellow-400 hover:bg-yellow-500 text-black"
                  onClick={handleYandexLogin}
                >
                  <Icon name="LogIn" className="mr-2" />
                  Войти через Яндекс ID
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                        ✈️
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <p className="text-blue-100">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={handleLogout}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Icon name="LogOut" className="mr-2" />
                      Выйти
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" />
                    История бронирований
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Plane" size={48} className="mx-auto mb-4 opacity-30" />
                    <p>У вас пока нет бронирований</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Heart" />
                    Избранные направления
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Star" size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Добавьте любимые направления для быстрого поиска</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
