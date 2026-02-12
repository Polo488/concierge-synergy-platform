
import { OnboardingKPIs } from '@/types/onboarding';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Rocket, CheckCircle2, AlertTriangle, Clock, TrendingUp, 
  Target, FileSignature, Globe 
} from 'lucide-react';

interface OnboardingStatsProps {
  kpis: OnboardingKPIs;
}

export function OnboardingStats({ kpis }: OnboardingStatsProps) {
  const cards = [
    { label: 'En cours', value: kpis.activeOnboardings, icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Terminés', value: kpis.completedOnboardings, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Bloqués', value: kpis.blockedOnboardings, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Durée moy.', value: `${kpis.avgCompletionDays}j`, icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Taux complétion', value: `${kpis.completionRate}%`, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Lead → Mandat', value: `${kpis.leadToMandatRate}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Délai signature', value: `${kpis.avgSignatureDelay}j`, icon: FileSignature, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Délai publication', value: `${kpis.avgPublicationDelay}j`, icon: Globe, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="border border-border/50">
          <CardContent className="p-3 flex flex-col items-center gap-1.5 text-center">
            <div className={`p-2 rounded-lg ${c.bg}`}>
              <c.icon size={16} className={c.color} />
            </div>
            <span className="text-lg font-bold text-foreground">{c.value}</span>
            <span className="text-[11px] text-muted-foreground leading-tight">{c.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
