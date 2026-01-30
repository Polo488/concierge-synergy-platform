import { useEffect, useState } from 'react';
import { Check, Calendar, Sparkles, MessageCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  icon: React.ElementType;
  text: string;
  color: string;
  bgColor: string;
}

const notifications: Notification[] = [
  { id: 1, icon: Calendar, text: 'Réservation confirmée', color: 'text-status-success', bgColor: 'bg-status-success/10' },
  { id: 2, icon: Check, text: 'Calendriers synchronisés', color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 3, icon: Sparkles, text: 'Ménage assigné', color: 'text-nav-operations', bgColor: 'bg-nav-operations/10' },
  { id: 4, icon: MessageCircle, text: 'Message envoyé', color: 'text-status-info', bgColor: 'bg-status-info/10' },
  { id: 5, icon: Shield, text: 'Check-in validé', color: 'text-status-success', bgColor: 'bg-status-success/10' },
];

interface FloatingNotificationProps {
  className?: string;
  position?: 'left' | 'right';
}

export function FloatingNotification({ className, position = 'right' }: FloatingNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const notification = notifications[currentIndex];
  const Icon = notification.icon;

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-elevated',
        'animate-float'
      )}>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', notification.bgColor)}>
          <Icon className={cn('w-4 h-4', notification.color)} />
        </div>
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {notification.text}
        </span>
        <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
      </div>
    </div>
  );
}

// Multiple floating notifications for hero section
export function FloatingNotifications({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {/* Top right notification */}
      <div className="absolute top-20 right-8 animate-float" style={{ animationDelay: '0s' }}>
        <FloatingNotification />
      </div>
      
      {/* Middle right notification */}
      <div className="absolute top-1/2 right-4 animate-float-delayed" style={{ animationDelay: '1.5s' }}>
        <FloatingNotificationItem 
          icon={Check} 
          text="Aucun conflit détecté" 
          color="text-status-success" 
          bgColor="bg-status-success/10" 
        />
      </div>
      
      {/* Bottom right notification */}
      <div className="absolute bottom-32 right-12 animate-float" style={{ animationDelay: '3s' }}>
        <FloatingNotificationItem 
          icon={Sparkles} 
          text="Tâches du jour complètes" 
          color="text-nav-operations" 
          bgColor="bg-nav-operations/10" 
        />
      </div>
    </div>
  );
}

function FloatingNotificationItem({ 
  icon: Icon, 
  text, 
  color, 
  bgColor 
}: { 
  icon: React.ElementType; 
  text: string; 
  color: string; 
  bgColor: string; 
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft">
      <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', bgColor)}>
        <Icon className={cn('w-3.5 h-3.5', color)} />
      </div>
      <span className="text-xs font-medium text-foreground whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
