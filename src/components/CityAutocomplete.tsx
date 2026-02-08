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

  return (
    <div ref={wrapperRef} className="relative">
      <label className={`text-sm font-medium mb-2 block ${
        isPremium ? 'text-yellow-300' : 'text-foreground'
      }`}>{label}</label>
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className={`h-12 ${
          isPremium ? 'bg-gray-800 border-yellow-500/30 text-yellow-100 placeholder:text-yellow-700' : ''
        }`}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto ${
          isPremium 
            ? 'bg-gray-800 border border-yellow-500/30' 
            : 'bg-white border border-gray-200'
        }`} style={isPremium ? {
          boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
        } : {}}>
          {suggestions.map((city, index) => (
            <div
              key={index}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                isPremium 
                  ? 'text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300' 
                  : 'hover:bg-blue-50'
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