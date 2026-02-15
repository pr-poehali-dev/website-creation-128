import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Airline {
  name: string;
  logo: string;
  url: string;
  color: string;
}

interface AirlineSelectorProps {
  open: boolean;
  onClose: () => void;
  fromCity: string;
  toCity: string;
  date?: string;
  isPremium?: boolean;
}

const airlines: Airline[] = [
  { name: 'Аэрофлот', logo: '✈️', url: 'https://www.aeroflot.ru/ru-ru/search/flights', color: 'from-red-500 to-rose-600' },
  { name: 'Utair', logo: '🛫', url: 'https://www.utair.ru/booking', color: 'from-amber-500 to-orange-600' },
  { name: 'Ямал', logo: '🛩️', url: 'https://www.yamal.aero/booking', color: 'from-sky-500 to-blue-600' },
  { name: 'S7', logo: '🟢', url: 'https://www.s7.ru', color: 'from-emerald-500 to-green-600' },
];

export default function AirlineSelector({ open, onClose, fromCity, toCity, date, isPremium }: AirlineSelectorProps) {
  const handleAirlineSelect = (airline: Airline) => {
    let url = airline.url;
    if (fromCity && toCity) {
      const params = new URLSearchParams();
      params.append('from', fromCity);
      params.append('to', toCity);
      if (date) params.append('date', date);
      url += `?${params.toString()}`;
    }
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-lg rounded-3xl border-0 ${
        isPremium ? 'glass-premium' : 'glass-strong'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-extrabold text-center ${
            isPremium ? 'text-gradient gradient-premium' : 'text-foreground'
          }`}>
            Выберите авиакомпанию
          </DialogTitle>
          {fromCity && toCity && (
            <p className={`text-center text-sm mt-1 ${
              isPremium ? 'text-yellow-100/50' : 'text-muted-foreground'
            }`}>
              {fromCity} → {toCity}
            </p>
          )}
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {airlines.map((airline, i) => (
            <div
              key={i}
              className={`group rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                isPremium
                  ? 'bg-white/5 hover:bg-white/10 border border-yellow-500/10 hover:border-yellow-500/30'
                  : 'bg-white/50 hover:bg-white/80 border border-white/30 hover:shadow-lg'
              }`}
              onClick={() => handleAirlineSelect(airline)}
            >
              <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${airline.color} flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {airline.logo}
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isPremium ? 'text-yellow-100' : 'text-foreground'}`}>
                {airline.name}
              </h4>
              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ExternalLink" size={12} className={isPremium ? 'text-yellow-400' : 'text-primary'} />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
