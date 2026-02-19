import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/**
 * Each path config defines a unique SVG curve that draws on scroll-enter.
 * Gradient IDs, stroke widths, and curve logic are all unique per instance.
 */
interface AmbientLineProps {
  /** SVG path d attribute */
  path: string;
  /** Gradient colors [start, end] */
  gradient: [string, string];
  /** Stroke width */
  strokeWidth?: number;
  /** Max opacity (5-15%) */
  maxOpacity?: number;
  /** Draw duration in seconds */
  drawDuration?: number;
  /** Parallax offset factor */
  parallaxFactor?: number;
  /** Unique ID for gradient */
  id: string;
  /** viewBox for SVG */
  viewBox?: string;
}

function AmbientLine({
  path,
  gradient,
  strokeWidth = 6,
  maxOpacity = 0.1,
  drawDuration = 2.5,
  parallaxFactor = 0.08,
  id,
  viewBox = '0 0 1200 600',
}: AmbientLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [hasDrawn, setHasDrawn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30 * parallaxFactor * 100, -30 * parallaxFactor * 100]);

  useEffect(() => {
    if (isInView && !hasDrawn) {
      const t = setTimeout(() => setHasDrawn(true), drawDuration * 1000 + 500);
      return () => clearTimeout(t);
    }
  }, [isInView, hasDrawn, drawDuration]);

  // Reduce on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualDuration = isMobile ? drawDuration * 0.6 : drawDuration;
  const actualStroke = isMobile ? strokeWidth * 0.7 : strokeWidth;
  const actualGlow = isMobile ? 0 : 8;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ y }}>
        <svg
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
            {actualGlow > 0 && (
              <filter id={`glow-${id}`}>
                <feGaussianBlur stdDeviation={actualGlow} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          <motion.path
            d={path}
            stroke={`url(#grad-${id})`}
            strokeWidth={actualStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter={actualGlow > 0 ? `url(#glow-${id})` : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    pathLength: 1,
                    opacity: hasDrawn ? maxOpacity * 0.7 : maxOpacity,
                  }
                : {}
            }
            transition={{
              pathLength: { duration: actualDuration, ease: [0.25, 0.1, 0.25, 1] },
              opacity: {
                duration: hasDrawn ? 1.5 : 0.8,
                delay: hasDrawn ? 0 : 0.2,
              },
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * A wrapper that adds ambient curved lines behind its children.
 * Each section gets a unique path and gradient.
 */
interface AmbientSectionProps {
  children: React.ReactNode;
  /** Which predefined path variant to use (0-6) */
  variant: number;
  className?: string;
}

// Unique path configurations — thick fluid curves inspired by infrastructure routing
const pathConfigs: AmbientLineProps[] = [
  {
    id: 'ops',
    path: 'M-50,300 C200,100 400,500 600,250 S900,400 1250,200',
    gradient: ['hsla(220, 70%, 55%, 1)', 'hsla(25, 75%, 55%, 1)'],
    strokeWidth: 8,
    maxOpacity: 0.08,
    drawDuration: 2.8,
    parallaxFactor: 0.06,
  },
  {
    id: 'dist',
    path: 'M1300,100 C1000,350 800,50 500,300 S200,150 -50,400',
    gradient: ['hsla(217, 80%, 60%, 1)', 'hsla(45, 85%, 55%, 1)'],
    strokeWidth: 7,
    maxOpacity: 0.07,
    drawDuration: 3.0,
    parallaxFactor: 0.09,
  },
  {
    id: 'billing',
    path: 'M-50,450 C150,200 350,500 550,150 S800,350 1050,100 1250,300',
    gradient: ['hsla(25, 70%, 55%, 1)', 'hsla(220, 65%, 55%, 1)'],
    strokeWidth: 9,
    maxOpacity: 0.06,
    drawDuration: 2.5,
    parallaxFactor: 0.07,
  },
  {
    id: 'compliance',
    path: 'M1300,500 C1100,200 850,450 600,150 S300,350 50,200 -50,350',
    gradient: ['hsla(270, 35%, 55%, 1)', 'hsla(220, 60%, 55%, 1)'],
    strokeWidth: 6,
    maxOpacity: 0.09,
    drawDuration: 2.6,
    parallaxFactor: 0.05,
  },
  {
    id: 'social',
    path: 'M-50,150 C200,400 500,50 700,350 S1000,200 1250,450',
    gradient: ['hsla(220, 70%, 55%, 1)', 'hsla(152, 45%, 50%, 1)'],
    strokeWidth: 7,
    maxOpacity: 0.06,
    drawDuration: 2.4,
    parallaxFactor: 0.08,
  },
  {
    id: 'pricing',
    path: 'M1300,350 C1050,100 800,400 550,200 S250,450 -50,250',
    gradient: ['hsla(45, 80%, 55%, 1)', 'hsla(25, 70%, 55%, 1)'],
    strokeWidth: 8,
    maxOpacity: 0.07,
    drawDuration: 2.7,
    parallaxFactor: 0.06,
  },
  {
    id: 'cta',
    path: 'M-50,200 C250,450 500,100 750,400 S1050,150 1250,350',
    gradient: ['hsla(220, 75%, 55%, 1)', 'hsla(25, 65%, 55%, 1)'],
    strokeWidth: 7,
    maxOpacity: 0.08,
    drawDuration: 2.3,
    parallaxFactor: 0.1,
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
