import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { russianCities } from '@/data/cities';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  isPremium?: boolean;
}

export default function CityAutocomplete({ value, onChange, placeholder, label, isPremium }: CityAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    if (inputValue.length >= 2) {
      const filtered = russianCities.filter(city =>
        city.toLowerCase().startsWith(inputValue.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
  };

  const dk = isDark && !isPremium;

  return (
    <div ref={wrapperRef} className="relative">
      <label className={`text-sm font-medium mb-2 block ${
        isPremium ? 'text-yellow-300/80' : dk ? 'text-slate-400' : 'text-muted-foreground'
      }`}>{label}</label>
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 rounded-xl border-0 ${
          isPremium
            ? 'bg-white/5 text-yellow-100 placeholder:text-yellow-100/30'
            : dk
              ? 'bg-white/5 text-slate-200 placeholder:text-slate-500 focus:bg-white/10'
              : 'bg-white/70 focus:bg-white text-foreground'
        }`}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-2 rounded-2xl overflow-hidden ${
          isPremium ? 'glass-premium' : dk ? 'glass-dark' : 'glass-strong'
        }`}>
          {suggestions.map((city, index) => (
            <div
              key={index}
              className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
                isPremium
                  ? 'text-yellow-100 hover:bg-yellow-500/10'
                  : dk
                    ? 'text-slate-200 hover:bg-white/10'
                    : 'text-foreground hover:bg-black/5'
              }`}
              onClick={() => handleSelectCity(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
