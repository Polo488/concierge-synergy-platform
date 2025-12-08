
import React from 'react';
import { Home, Globe, Building2, User, HelpCircle } from 'lucide-react';
import type { BookingChannel } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface ChannelIconProps {
  channel: BookingChannel;
  className?: string;
}

// Simple icons for each channel - in a real app, these could be actual logos
export const ChannelIcon: React.FC<ChannelIconProps> = ({ channel, className }) => {
  const iconClass = cn("w-4 h-4", className);

  switch (channel) {
    case 'airbnb':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.42 3.95 6.15 6.93 6.15 9.64c0 2.87 2.33 5.21 5.85 5.21s5.85-2.34 5.85-5.21C17.85 6.93 15.58 3.95 12 0zm0 13.11c-2.41 0-4.36-1.95-4.36-3.47C7.64 7.95 9.27 5.5 12 2.03c2.73 3.47 4.36 5.92 4.36 7.61 0 1.52-1.95 3.47-4.36 3.47z"/>
          <path d="M12 17.11c-4.39 0-7.98 3.26-7.98 6.89h15.96c0-3.63-3.59-6.89-7.98-6.89z"/>
        </svg>
      );
    case 'booking':
      return <Building2 className={iconClass} />;
    case 'vrbo':
      return <Home className={iconClass} />;
    case 'direct':
      return <User className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
  }
};

export const ChannelLogo: React.FC<{ channel: BookingChannel; size?: 'sm' | 'md' | 'lg' }> = ({ 
  channel, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full",
      sizeClasses[size]
    )}>
      <ChannelIcon channel={channel} className="w-full h-full" />
    </div>
  );
};
