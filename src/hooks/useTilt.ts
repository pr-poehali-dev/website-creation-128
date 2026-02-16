import { useRef, useCallback, useEffect, useState } from 'react';

interface TiltOptions {
  max?: number;
  speed?: number;
  glare?: boolean;
  scale?: number;
}

export default function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const { max = 15, speed = 400, glare = true, scale = 1.02 } = options;
  const ref = useRef<T>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (max * (0.5 - y)).toFixed(2);
    const tiltY = (max * (x - 0.5)).toFixed(2);

    el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    if (glare) {
      setGlarePos({ x: x * 100, y: y * 100 });
    }
  }, [max, scale, glare]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setGlarePos({ x: 50, y: 50 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, speed]);

  return { ref, glarePos };
}
