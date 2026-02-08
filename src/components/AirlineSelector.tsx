import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
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
}

const airlines: Airline[] = [
  { 
    name: 'Аэрофлот', 
    logo: '✈️', 
    url: 'https://www.aeroflot.ru/ru-ru/search/flights',
    color: 'from-red-500 to-red-600'
  },
  { 
    name: 'Utair', 
    logo: '🛫', 
    url: 'https://www.utair.ru/booking',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    name: 'Ямал', 
    logo: '🛩️', 
    url: 'https://www.yamal.aero/booking',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'S7', 
    logo: '🚁', 
    url: 'https://www.s7.ru/booking/',
    color: 'from-green-500 to-green-600'
  },
];

export default function AirlineSelector({ open, onClose, fromCity, toCity, date }: AirlineSelectorProps) {
  const handleAirlineSelect = (airline: Airline) => {
    let url = airline.url;
    
    if (fromCity && toCity) {
      const params = new URLSearchParams();
      params.append('from', fromCity);
      params.append('to', toCity);
      if (date) {
        params.append('date', date);
      }
      url += `?${params.toString()}`;
    }
    
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Выберите авиакомпанию</DialogTitle>
          {fromCity && toCity && (
            <p className="text-center text-muted-foreground mt-2">
              {fromCity} → {toCity}
            </p>
          )}
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {airlines.map((airline, index) => (
            <Card 
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleAirlineSelect(airline)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${airline.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                  {airline.logo}
                </div>
                <h4 className="text-xl font-bold mb-2">{airline.name}</h4>
                <Icon name="ExternalLink" className="mx-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
