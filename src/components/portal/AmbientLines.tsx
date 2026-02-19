import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AmbientLineProps {
  path: string;
  color: string;
  strokeWidth?: number;
  id: string;
  viewBox?: string;
}

function AmbientLine({
  path,
  color,
  strokeWidth = 28,
  id,
  viewBox = '0 0 1200 600',
}: AmbientLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // pathLength follows scroll: 0 at section enter, 1 at section leave
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualStroke = isMobile ? strokeWidth * 0.55 : strokeWidth;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ y }}>
        <svg
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <motion.path
            d={path}
            stroke={color}
            strokeWidth={actualStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ pathLength }}
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
    path: 'M-20,350 C200,60 420,540 650,220 S960,440 1230,160',
    color: 'hsl(220, 70%, 85%)',
    strokeWidth: 32,
  },
  {
    id: 'dist',
    path: 'M1240,60 C960,400 740,30 460,340 S160,120 -20,440',
    color: 'hsl(25, 75%, 85%)',
    strokeWidth: 28,
  },
  {
    id: 'billing',
    path: 'M-20,480 C180,160 380,540 580,110 S840,380 1080,60 1240,300',
    color: 'hsl(217, 75%, 87%)',
    strokeWidth: 34,
  },
  {
    id: 'compliance',
    path: 'M1240,500 C1040,160 800,460 560,120 S260,380 20,180 -20,380',
    color: 'hsl(45, 80%, 85%)',
    strokeWidth: 26,
  },
  {
    id: 'social',
    path: 'M-20,120 C240,440 520,20 740,380 S1040,160 1240,480',
    color: 'hsl(220, 60%, 88%)',
    strokeWidth: 30,
  },
  {
    id: 'pricing',
    path: 'M1240,360 C1000,60 760,440 520,160 S220,480 -20,220',
    color: 'hsl(25, 65%, 87%)',
    strokeWidth: 32,
  },
];

export function AmbientSection({ children, variant, className = '' }: AmbientSectionProps) {
  const config = pathConfigs[variant % pathConfigs.length];

  return (
    <div className={`relative bg-white ${className}`}>
      <AmbientLine {...config} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
