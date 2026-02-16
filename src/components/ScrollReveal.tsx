import { ReactNode } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'flip';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const transforms: Record<RevealDirection, string> = {
  up: 'translateY(60px)',
  down: 'translateY(-60px)',
  left: 'translateX(60px)',
  right: 'translateX(-60px)',
  scale: 'scale(0.85)',
  flip: 'perspective(800px) rotateX(15deg)',
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ once });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0) scale(1) perspective(800px) rotateX(0deg)' : transforms[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
