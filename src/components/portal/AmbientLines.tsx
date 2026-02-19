import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface AmbientLineProps {
  path: string;
  gradient: [string, string];
  strokeWidth?: number;
  maxOpacity?: number;
  drawDuration?: number;
  parallaxFactor?: number;
  id: string;
  viewBox?: string;
}

function AmbientLine({
  path,
  gradient,
  strokeWidth = 24,
  maxOpacity = 0.15,
  drawDuration = 2.5,
  parallaxFactor = 0.08,
  id,
  viewBox = '0 0 1200 600',
}: AmbientLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [hasDrawn, setHasDrawn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  useEffect(() => {
    if (isInView && !hasDrawn) {
      const t = setTimeout(() => setHasDrawn(true), drawDuration * 1000 + 800);
      return () => clearTimeout(t);
    }
  }, [isInView, hasDrawn, drawDuration]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualDuration = isMobile ? drawDuration * 0.65 : drawDuration;
  const actualStroke = isMobile ? strokeWidth * 0.6 : strokeWidth;
  const glurRadius = isMobile ? 4 : 12;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ y }}>
        <svg
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
            <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={glurRadius} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow layer — thicker, more diffuse */}
          <motion.path
            d={path}
            stroke={`url(#grad-${id})`}
            strokeWidth={actualStroke * 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    pathLength: 1,
                    opacity: hasDrawn ? maxOpacity * 0.3 : maxOpacity * 0.5,
                  }
                : {}
            }
            transition={{
              pathLength: { duration: actualDuration, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 1, delay: 0.1 },
            }}
            filter={`url(#glow-${id})`}
          />

          {/* Main stroke — visible, thick */}
          <motion.path
            d={path}
            stroke={`url(#grad-${id})`}
            strokeWidth={actualStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    pathLength: 1,
                    opacity: hasDrawn ? maxOpacity * 0.75 : maxOpacity,
                  }
                : {}
            }
            transition={{
              pathLength: { duration: actualDuration, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.6, delay: 0.15 },
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

interface AmbientSectionProps {
  children: React.ReactNode;
  variant: number;
  className?: string;
}

const pathConfigs: AmbientLineProps[] = [
  {
    id: 'ops',
    path: 'M-20,320 C180,80 380,520 620,240 S920,420 1220,180',
    gradient: ['hsla(220, 70%, 58%, 1)', 'hsla(25, 75%, 58%, 1)'],
    strokeWidth: 28,
    maxOpacity: 0.14,
    drawDuration: 2.6,
    parallaxFactor: 0.06,
  },
  {
    id: 'dist',
    path: 'M1240,80 C980,380 760,40 480,320 S180,140 -20,420',
    gradient: ['hsla(217, 80%, 62%, 1)', 'hsla(45, 85%, 58%, 1)'],
    strokeWidth: 24,
    maxOpacity: 0.13,
    drawDuration: 2.8,
    parallaxFactor: 0.09,
  },
  {
    id: 'billing',
    path: 'M-20,460 C160,180 360,520 560,130 S820,360 1060,80 1240,280',
    gradient: ['hsla(25, 70%, 58%, 1)', 'hsla(220, 65%, 58%, 1)'],
    strokeWidth: 32,
    maxOpacity: 0.12,
    drawDuration: 2.4,
    parallaxFactor: 0.07,
  },
  {
    id: 'compliance',
    path: 'M1240,480 C1060,180 820,440 580,140 S280,360 40,200 -20,360',
    gradient: ['hsla(270, 38%, 58%, 1)', 'hsla(220, 60%, 58%, 1)'],
    strokeWidth: 22,
    maxOpacity: 0.15,
    drawDuration: 2.5,
    parallaxFactor: 0.05,
  },
  {
    id: 'social',
    path: 'M-20,140 C220,420 500,40 720,360 S1020,180 1240,460',
    gradient: ['hsla(220, 70%, 58%, 1)', 'hsla(152, 45%, 52%, 1)'],
    strokeWidth: 26,
    maxOpacity: 0.12,
    drawDuration: 2.3,
    parallaxFactor: 0.08,
  },
  {
    id: 'pricing',
    path: 'M1240,340 C1020,80 780,420 540,180 S240,460 -20,240',
    gradient: ['hsla(45, 80%, 58%, 1)', 'hsla(25, 70%, 58%, 1)'],
    strokeWidth: 30,
    maxOpacity: 0.13,
    drawDuration: 2.5,
    parallaxFactor: 0.06,
  },
];

export function AmbientSection({ children, variant, className = '' }: AmbientSectionProps) {
  const config = pathConfigs[variant % pathConfigs.length];

  return (
    <div className={`relative ${className}`}>
      <AmbientLine {...config} />
      {children}
    </div>
  );
}
