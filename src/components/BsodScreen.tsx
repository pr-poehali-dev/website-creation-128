import { useState, useEffect } from 'react';

interface BsodScreenProps {
  onComplete: () => void;
}

export default function BsodScreen({ onComplete }: BsodScreenProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setPct(p => {
        if (p >= 100) {
          clearInterval(iv);
          return 100;
        }
        return p + 1;
      });
    }, 150);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(onComplete, 1500);
      return () => clearTimeout(t);
    }
  }, [pct, onComplete]);

  const hex1 = Math.random().toString(16).slice(2, 10).toUpperCase();
  const hex2 = Math.random().toString(16).slice(2, 10).toUpperCase();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0078d7] flex items-center justify-center cursor-default select-none animate-fade-in">
      <div className="max-w-2xl px-8 text-white">
        <p className="text-[120px] md:text-[160px] font-light leading-none mb-6">:(</p>
        <p className="text-xl md:text-2xl mb-6">
          На вашем ПК возникла проблема, и его необходимо перезагрузить. Мы лишь собираем некоторые сведения об ошибке, а затем вы сможете выполнить перезагрузку.
        </p>
        <div className="flex items-center gap-3 mb-8">
          <div className="text-lg">{pct}% завершено</div>
        </div>
        <div className="border-t border-white/20 pt-6 space-y-2">
          <p className="text-sm opacity-80">Код остановки: CRITICAL_SERVER_DAMAGE</p>
          <p className="text-sm opacity-80">Что произошло: PUTESHESTVIE_KERNEL_DATA_INPAGE_ERROR</p>
          <p className="text-xs opacity-50 mt-4 font-mono">
            0x00000B5D (0x{hex1}, 0x{hex2})
          </p>
        </div>
      </div>
    </div>
  );
}
