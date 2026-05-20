import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Smartphone, Flame, ShieldAlert, Users, Clock, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const THRESHOLDS = [
  { id: 'h2', label: 'H-2', desc: '2h avant check-in' },
  { id: 'h1', label: 'H-1', desc: '1h avant check-in' },
  { id: 'h30', label: 'M-30', desc: '30 min avant' },
  { id: 'h15', label: 'M-15', desc: '15 min avant' },
  { id: 'h0', label: 'H-0', desc: 'Au check-in (critique)' },
];

const RECIPIENTS = [
  { id: 'me', label: 'Moi (utilisateur principal)', icon: Users },
  { id: 'manager', label: 'Manager opérations', icon: ShieldAlert },
  { id: 'provider', label: 'Prestataire concerné', icon: Smartphone },
];

interface CleaningNotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CleaningNotificationsDialog = ({ open, onOpenChange }: CleaningNotificationsDialogProps) => {
  const { user } = useAuth();
  const [inApp, setInApp] = useState(true);
  const [push, setPush] = useState(false);
  const [thresholds, setThresholds] = useState<Set<string>>(new Set(['h1', 'h30', 'h0']));
  const [recipients, setRecipients] = useState<Set<string>>(new Set(['me', 'manager']));
  const [escalate, setEscalate] = useState(true);

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setSet(next);
  };

  const save = () => {
    toast.success('Préférences enregistrées');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications ménage
          </DialogTitle>
          <DialogDescription>
            Configure les alertes pour les ménages avec check-in jour J{user?.name ? ` — ${user.name}` : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Canaux */}
          <section className="space-y-2">
            <h3 className="text-[13px] font-bold text-foreground">Canaux</h3>
            <Row icon={<Bell className="h-4 w-4" />} title="In-app" desc="Notifications dans l'interface Noé">
              <Switch checked={inApp} onCheckedChange={setInApp} />
            </Row>
            <Row icon={<Smartphone className="h-4 w-4" />} title="Push mobile" desc="Disponible avec l'application mobile (à venir)" disabled>
              <Switch checked={push} onCheckedChange={setPush} disabled />
            </Row>
          </section>

          {/* Seuils */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-foreground">Seuils de déclenchement</h3>
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
                      'rounded-xl border p-2.5 text-left transition-colors',
                      on ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40',
                      t.id === 'h0' && on && 'border-destructive bg-destructive/10'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('text-[13px] font-bold', t.id === 'h0' && on && 'text-destructive')}>{t.label}</span>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Destinataires */}
          <section className="space-y-2">
            <h3 className="text-[13px] font-bold text-foreground">Destinataires</h3>
            <div className="space-y-1">
              {RECIPIENTS.map((r) => (
                <Row key={r.id} icon={<r.icon className="h-4 w-4" />} title={r.label}>
                  <Switch checked={recipients.has(r.id)} onCheckedChange={() => toggle(recipients, setRecipients, r.id)} />
                </Row>
              ))}
            </div>
          </section>

          {/* Escalade */}
          <section>
            <Row
              icon={<ArrowUpRight className="h-4 w-4" />}
              title="Escalade automatique au manager"
              desc="Si l'alerte H-1 est ignorée pendant plus de 10 minutes."
            >
              <Switch checked={escalate} onCheckedChange={setEscalate} />
            </Row>
          </section>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  <div className={cn('flex items-center justify-between gap-3 py-1.5', disabled && 'opacity-60')}>
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
