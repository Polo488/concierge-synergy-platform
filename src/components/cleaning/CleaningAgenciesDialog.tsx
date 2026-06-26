import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Mail, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = [
  { key: 0, label: 'D' },
  { key: 1, label: 'L' },
  { key: 2, label: 'M' },
  { key: 3, label: 'M' },
  { key: 4, label: 'J' },
  { key: 5, label: 'V' },
  { key: 6, label: 'S' },
];

interface Agency {
  id: string;
  name: string;
  email: string;
  external: boolean;
  workDays: number[];
  maxPerDay: number | null;
}

const INITIAL: Agency[] = [
  { id: 'a1', name: 'Amel', email: 'a.kasraoui@icloud.com', external: true, workDays: [0,1,2,3,4,5,6], maxPerDay: 15 },
  { id: 'a2', name: 'Axel', email: 'axelch698@gmail.com', external: true, workDays: [0,1,2,3,4,5,6], maxPerDay: null },
  { id: 'a3', name: 'Serpolet', email: 'contact@serpolet.fr', external: false, workDays: [1,2,3,4,5], maxPerDay: 10 },
  { id: 'a4', name: 'Sihem', email: 'sihem@noe.fr', external: true, workDays: [1,2,3,4,5,6], maxPerDay: 12 },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CleaningAgenciesDialog = ({ open, onOpenChange }: Props) => {
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL);

  const toggleDay = (id: string, day: number) => {
    setAgencies((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, workDays: a.workDays.includes(day) ? a.workDays.filter((d) => d !== day) : [...a.workDays, day] }
          : a
      )
    );
  };

  const updateAgency = (id: string, patch: Partial<Agency>) => {
    setAgencies((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeAgency = (id: string) => {
    setAgencies((prev) => prev.filter((a) => a.id !== id));
    toast.success('Agence supprimée');
  };

  const addAgency = () => {
    const id = `a${Date.now()}`;
    setAgencies((prev) => [
      ...prev,
      { id, name: 'Nouvelle agence', email: '', external: true, workDays: [1, 2, 3, 4, 5], maxPerDay: null },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[680px] max-h-[90vh] overflow-hidden p-0 rounded-[20px]">
        <div className="px-6 pt-6 pb-3">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-[18px] font-bold">Agences de ménage</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Chaque agence est un compte unique (un email, un tableau de bord). Gérez leurs disponibilités et leurs limites.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 pb-4 space-y-3" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {agencies.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Input
                  value={a.name}
                  onChange={(e) => updateAgency(a.id, { name: e.target.value })}
                  className="h-9 max-w-[260px] text-[15px] font-bold border-transparent focus-visible:border-border px-2 -ml-2"
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[12px] text-muted-foreground">Externe</span>
                  <Switch checked={a.external} onCheckedChange={(v) => updateAgency(a.id, { external: v })} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => removeAgency(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="email"
                    value={a.email}
                    placeholder="email@exemple.com"
                    onChange={(e) => updateAgency(a.id, { email: e.target.value })}
                    className="h-8 text-[13px] border-transparent focus-visible:border-border px-1 min-w-[220px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toast.success(`Accès renvoyé à ${a.name}`)}
                  className="text-[13px] font-semibold text-primary hover:underline"
                >
                  Renvoyer l'accès
                </button>
              </div>

              <div>
                <p className="text-[12px] font-medium text-foreground mb-1.5">Jours travaillés</p>
                <div className="flex gap-1.5">
                  {DAYS.map((d) => {
                    const active = a.workDays.includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => toggleDay(a.id, d.key)}
                        className={`h-8 w-8 rounded-full text-[12px] font-bold transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-medium text-foreground mb-1.5">Max ménages / jour</p>
                <Input
                  type="number"
                  min={1}
                  value={a.maxPerDay ?? ''}
                  placeholder="Illimité"
                  onChange={(e) =>
                    updateAgency(a.id, { maxPerDay: e.target.value ? Number(e.target.value) : null })
                  }
                  className="h-9 max-w-[140px] rounded-[10px]"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAgency}
            className="w-full h-11 rounded-2xl border border-dashed border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une agence
          </button>
        </div>

        <div className="border-t border-border px-6 py-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 rounded-[10px]">
            Annuler
          </Button>
          <Button
            onClick={() => {
              toast.success('Agences enregistrées');
              onOpenChange(false);
            }}
            className="h-9 rounded-[10px]"
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
