import { ReactNode } from 'react';
import useTilt from '@/hooks/useTilt';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  tiltMax?: number;
  glare?: boolean;
  scale?: number;
}

export default function TiltCard({ children, className = '', onClick, tiltMax = 12, glare = true, scale = 1.03 }: TiltCardProps) {
  const { ref, glarePos } = useTilt<HTMLDivElement>({ max: tiltMax, glare, scale });

  return (
    <div
      ref={ref}
      className={`tilt-card relative ${className}`}
      onClick={onClick}
    >
      {children}
      {glare && (
        <div
          className="tilt-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
