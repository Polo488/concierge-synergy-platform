import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Smartphone, Flame, Users, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';


const THRESHOLDS = [
  { id: 'h2', label: 'H-2', desc: '2h avant check-in' },
  { id: 'h1', label: 'H-1', desc: '1h avant check-in' },
  { id: 'h30', label: 'H-30', desc: '30 min avant' },
  { id: 'h15', label: 'H-15', desc: '15 min avant' },
  { id: 'h0', label: 'H-0', desc: 'Au check-in (critique)' },
];

const RECIPIENTS = [
  { id: 'me', label: 'Moi (utilisateur principal)', icon: Users },
  { id: 'manager', label: 'Manager opérations', icon: ShieldAlert },
  { id: 'provider', label: 'Prestataire concerné', icon: Smartphone },
];

const CleaningNotifications = () => {
  const { user } = useAuth();
  const [inApp, setInApp] = useState(true);
  const [push, setPush] = useState(false);
  const [thresholds, setThresholds] = useState<Set<string>>(new Set(['h1', 'h30', 'h0']));
  const [recipients, setRecipients] = useState<Set<string>>(new Set(['me', 'manager']));
  const [escalate, setEscalate] = useState(true);

  useEffect(() => { document.title = 'Notifications ménage'; }, []);

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setSet(next);
  };

  const save = () => toast.success('Préférences enregistrées');

  return (
    <div className="space-y-4 max-w-3xl">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Notifications ménage
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure les alertes pour les ménages avec check-in jour J{user?.name ? ` — préférences personnelles de ${user.name}` : ''}.
        </p>
      </header>


      {/* Canaux */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h2 className="text-[15px] font-bold">Canaux</h2>
          <Row icon={<Bell className="h-4 w-4" />} title="In-app" desc="Notifications dans l'interface Noé">
            <Switch checked={inApp} onCheckedChange={setInApp} />
          </Row>
          <Row icon={<Smartphone className="h-4 w-4" />} title="Push mobile" desc="Disponible avec l'application mobile (à venir)" disabled>
            <Switch checked={push} onCheckedChange={setPush} disabled />
          </Row>
        </CardContent>
      </Card>

      {/* Seuils */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold">Seuils de déclenchement</h2>
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            Une alerte est déclenchée si un ménage <strong>check-in jour J</strong> n'est pas validé au seuil.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {THRESHOLDS.map((t) => {
              const on = thresholds.has(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggle(thresholds, setThresholds, t.id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-colors',
                    on ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40',
                    t.id === 'h0' && on && 'border-destructive bg-destructive/10'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[15px] font-bold', t.id === 'h0' && on && 'text-destructive')}>{t.label}</span>
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Destinataires */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <h2 className="text-[15px] font-bold">Destinataires</h2>
          <div className="space-y-2">
            {RECIPIENTS.map((r) => (
              <Row key={r.id} icon={<r.icon className="h-4 w-4" />} title={r.label}>
                <Switch checked={recipients.has(r.id)} onCheckedChange={() => toggle(recipients, setRecipients, r.id)} />
              </Row>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalade */}
      <Card>
        <CardContent className="pt-6">
          <Row
            icon={<ArrowUpRight className="h-4 w-4" />}
            title="Escalade automatique au manager"
            desc="Si l'alerte H-1 est ignorée pendant plus de 10 minutes."
          >
            <Switch checked={escalate} onCheckedChange={setEscalate} />
          </Row>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}>Enregistrer</Button>
      </div>
    </div>
  );
};

const Row = ({
  icon,
  title,
  desc,
  disabled,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <div className={cn('flex items-center justify-between gap-3 py-2', disabled && 'opacity-60')}>
    <div className="flex items-start gap-3 min-w-0">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default CleaningNotifications;
