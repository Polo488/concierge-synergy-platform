import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isRevealed };
}

// Component wrapper for scroll reveal
export function useMultipleScrollReveal(count: number, options: UseScrollRevealOptions = {}) {
  const [revealedItems, setRevealedItems] = useState<boolean[]>(new Array(count).fill(false));
  const refs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
    
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealedItems(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            if (once) {
              observer.unobserve(element);
            }
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [count, options]);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return { revealedItems, setRef };
}
