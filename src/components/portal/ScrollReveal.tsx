import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  const baseStyles: Record<string, { initial: string; revealed: string }> = {
    up: {
      initial: 'translate-y-12 opacity-0',
      revealed: 'translate-y-0 opacity-100',
    },
    down: {
      initial: '-translate-y-12 opacity-0',
      revealed: 'translate-y-0 opacity-100',
    },
    left: {
      initial: '-translate-x-12 opacity-0',
      revealed: 'translate-x-0 opacity-100',
    },
    right: {
      initial: 'translate-x-12 opacity-0',
      revealed: 'translate-x-0 opacity-100',
    },
    scale: {
      initial: 'scale-90 opacity-0',
      revealed: 'scale-100 opacity-100',
    },
    fade: {
      initial: 'opacity-0',
      revealed: 'opacity-100',
    },
  };

  const styles = baseStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out',
        isRevealed ? styles.revealed : styles.initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
