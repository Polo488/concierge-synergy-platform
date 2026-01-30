import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageCircle, Sparkles, BarChart3, Check, LayoutDashboard, Map, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CalendarPreview, CleaningPreview, MessagingPreview, StatsPreview, DashboardPreview } from './previews';
import { GeoPreview } from './previews/GeoPreview';

interface PreviewThumbnail {
  id: string;
  icon: React.ElementType;
  preview?: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

const thumbnails: PreviewThumbnail[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-primary/20 to-primary/5', preview: DashboardPreview },
  { id: 'calendar', icon: Calendar, label: 'Calendrier', color: 'from-status-info/20 to-status-info/5', preview: CalendarPreview },
  { id: 'stats', icon: BarChart3, label: 'Stats', color: 'from-nav-pilotage/20 to-nav-pilotage/5', preview: StatsPreview },
  { id: 'geo', icon: Map, label: 'Géo', color: 'from-status-success/20 to-status-success/5', preview: GeoPreview },
  { id: 'cleaning', icon: Sparkles, label: 'Opérations', color: 'from-status-warning/20 to-status-warning/5', preview: CleaningPreview },
];

// Floating notifications - contextual and human
const notifications = [
  { text: 'Check-in confirmé', icon: Check, delay: 800 },
  { text: 'Ménage terminé ✓', icon: Sparkles, delay: 2500 },
  { text: 'Occupation +12% ce mois', icon: Zap, delay: 4200 },
  { text: 'Nouveau message voyageur', icon: MessageCircle, delay: 5900 },
];

function FloatingNotification({ text, icon: Icon, delay, index }: { text: string; icon: React.ElementType; delay: number; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(showTimeout);
  }, [delay]);

  const positions = [
    'top-8 right-4 lg:right-8',
    'top-28 right-0 lg:right-2',
    'bottom-48 right-6 lg:right-10',
    'bottom-28 right-2 lg:right-4',
  ];

  return (
    <div
      className={cn(
        'absolute transition-all duration-700 ease-out z-20 hidden lg:block',
        positions[index % positions.length],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div 
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 shadow-elevated"
        style={{ animation: isVisible ? `float 4s ease-in-out infinite ${index * 0.7}s` : 'none' }}
      >
        <div className="w-6 h-6 rounded-full bg-status-success/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-status-success" />
        </div>
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {text}
        </span>
        <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
      </div>
    </div>
  );
}

function ThumbnailPreview({ thumbnail }: { thumbnail: PreviewThumbnail }) {
  if (thumbnail.preview) {
    const PreviewComponent = thumbnail.preview;
    return <PreviewComponent />;
  }
  
  const Icon = thumbnail.icon;
  return (
    <div className={cn(
      "aspect-video bg-gradient-to-br rounded-xl border border-border/30 flex flex-col items-center justify-center p-8",
      thumbnail.color
    )}>
      <div className="w-16 h-16 rounded-2xl bg-card/80 backdrop-blur flex items-center justify-center mb-4 shadow-soft">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-lg font-medium text-foreground">{thumbnail.label}</p>
    </div>
  );
}

export function EnhancedHeroSection() {
  const [selectedThumbnail, setSelectedThumbnail] = useState<PreviewThumbnail | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[95vh] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content - Left Side */}
          <div className="lg:col-span-5 text-center lg:text-left">
            {/* Badge */}
            <div 
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-6 transition-all duration-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Votre copilote de gestion</span>
            </div>

            {/* Headline - Pilotage focus */}
            <h1 
              className={cn(
                "text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-foreground leading-[1.1] tracking-tight mb-6 transition-all duration-1000",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: '200ms' }}
            >
              Pilotez votre conciergerie,
              <br />
              <span className="text-muted-foreground">sans naviguer à vue.</span>
            </h1>
            
            {/* Subheadline - Human, value-oriented */}
            <p 
              className={cn(
                "text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 transition-all duration-1000",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: '400ms' }}
            >
              Réservations, équipes, qualité, finances, performance : <strong className="text-foreground">tout est enfin au même endroit.</strong>
            </p>
            
            {/* CTAs */}
            <div 
              className={cn(
                "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 transition-all duration-1000",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: '500ms' }}
            >
              <Button 
                size="lg" 
                className="text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300" 
                asChild
              >
                <Link to="/contact">
                  Demander une démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 h-12 hover:bg-card hover:scale-[1.02] transition-all duration-300" 
                asChild
              >
                <a href="#product">
                  Voir le produit
                </a>
              </Button>
            </div>

            {/* Trust indicators - Partner tone */}
            <div 
              className={cn(
                "flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground transition-all duration-1000",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: '600ms' }}
            >
              {['Sans engagement', 'Démo en 30 min', 'Onboarding accompagné'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-status-success/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-status-success" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Preview - Right Side */}
          <div className="lg:col-span-7 relative">
            {/* Floating Notifications */}
            {notifications.map((notif, i) => (
              <FloatingNotification key={i} text={notif.text} icon={notif.icon} delay={notif.delay} index={i} />
            ))}

            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative space-y-4">
              {/* Main Preview - Dashboard */}
              <div 
                className={cn(
                  "transition-all duration-1000",
                  isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                )}
                style={{ transitionDelay: '300ms' }}
              >
                <DashboardPreview className="shadow-elevated" />
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-5 gap-2">
                {thumbnails.map((thumbnail, i) => {
                  const Icon = thumbnail.icon;
                  return (
                    <button
                      key={thumbnail.id}
                      onClick={() => setSelectedThumbnail(thumbnail)}
                      className={cn(
                        "group relative bg-card rounded-xl border border-border/50 p-3 transition-all duration-500 hover:shadow-soft hover:border-primary/30 hover:scale-[1.02]",
                        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: `${700 + i * 100}ms` }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-2xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {thumbnail.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floating decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl animate-float" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-status-success/20 to-transparent rounded-2xl blur-xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedThumbnail} onOpenChange={() => setSelectedThumbnail(null)}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
          {selectedThumbnail && <ThumbnailPreview thumbnail={selectedThumbnail} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
