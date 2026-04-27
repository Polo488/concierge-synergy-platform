import { cn } from '@/lib/utils';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface Props {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

export function StatusPill({ tone = 'neutral', children, className, withDot = true }: Props) {
  return (
    <span className={cn('ios-pill', `ios-pill-${tone}`, !withDot && 'no-dot', className)}>
      {children}
    </span>
  );
}

interface PlatformProps {
  platform: 'airbnb' | 'booking' | 'direct' | 'vrbo' | 'abritel';
  className?: string;
  children?: React.ReactNode;
}

const labels: Record<PlatformProps['platform'], string> = {
  airbnb: 'Airbnb',
  booking: 'Booking',
  direct: 'Direct',
  vrbo: 'Vrbo',
  abritel: 'Abritel',
};

export function PlatformBadge({ platform, className, children }: PlatformProps) {
  return (
    <span className={cn('ios-badge', `ios-badge-${platform}`, className)}>
      {children ?? labels[platform]}
    </span>
  );
}
