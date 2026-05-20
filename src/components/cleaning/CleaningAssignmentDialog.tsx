import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, X, Plus, Zap, Home, AlertTriangle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ALL_AGENTS = ['Marie Lambert', 'Sophie Renard', 'Lucas Martin', 'Karine Vidal', 'Nadia Bensaid'];
const PROPERTIES = [
  'Appartement 12 Rue du Port',
  'Studio 8 Avenue des Fleurs',
  'Loft 72 Rue des Arts',
  'Maison 23 Rue de la Paix',
  'Appartement 45 Boulevard Central',
  'Studio 15 Rue des Lilas',
  'Appartement 28 Avenue Victor Hugo',
];

// État courant des assignations (mock) — permet d'afficher ce qui est déjà configuré
type ExistingMode = 'priority' | 'rotation' | 'single';
const EXISTING_ASSIGNMENTS: Record<string, { mode: ExistingMode; agents: string[] }> = {
  'Appartement 12 Rue du Port': { mode: 'priority', agents: ['Marie Lambert', 'Sophie Renard'] },
  'Studio 8 Avenue des Fleurs': { mode: 'priority', agents: ['Marie Lambert'] },
  'Loft 72 Rue des Arts': { mode: 'rotation', agents: ['Lucas Martin', 'Karine Vidal'] },
  'Maison 23 Rue de la Paix': { mode: 'single', agents: ['Nadia Bensaid'] },
  'Appartement 45 Boulevard Central': { mode: 'rotation', agents: ['Sophie Renard', 'Lucas Martin'] },
};

const MODE_META: Record<ExistingMode, { label: string; cls: string }> = {
  priority: { label: 'Priorité', cls: 'bg-primary/10 text-primary border-primary/20' },
  rotation: { label: 'Rotation', cls: 'bg-[hsl(213,84%,40%)]/10 text-[hsl(213,84%,40%)] border-[hsl(213,84%,40%)]/20' },
  single: { label: 'Dédié', cls: 'bg-[hsl(142,71%,35%)]/10 text-[hsl(142,71%,35%)] border-[hsl(142,71%,35%)]/20' },
};

const DAYS = [
  { key: 1, label: 'L' },
  { key: 2, label: 'M' },
  { key: 3, label: 'M' },
  { key: 4, label: 'J' },
  { key: 5, label: 'V' },
  { key: 6, label: 'S' },
  { key: 0, label: 'D' },
];


interface CleaningAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CleaningAssignmentDialog = ({ open, onOpenChange }: CleaningAssignmentDialogProps) => {
  const [autoAssign, setAutoAssign] = useState(true);
  const [mode, setMode] = useState<'rotation' | 'priority'>('priority');
  const [team, setTeam] = useState<string[]>(['Marie Lambert', 'Sophie Renard']);
  const [agentToAdd, setAgentToAdd] = useState<string>('');
  const [workDays, setWorkDays] = useState<Record<string, number[]>>({
    'Marie Lambert': [1, 2, 3, 4, 5],
    'Sophie Renard': [6, 0],
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([PROPERTIES[0], PROPERTIES[1]]);

  const toggleDay = (agent: string, day: number) => {
    setWorkDays((prev) => {
      const cur = prev[agent] || [];
      const next = cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day];
      return { ...prev, [agent]: next };
    });
  };

  const addAgent = () => {
    if (agentToAdd && !team.includes(agentToAdd)) {
      setTeam([...team, agentToAdd]);
      setWorkDays((prev) => ({ ...prev, [agentToAdd]: prev[agentToAdd] || [1, 2, 3, 4, 5] }));
      setAgentToAdd('');
    }
  };
  const removeAgent = (a: string) => setTeam(team.filter((x) => x !== a));
  const move = (a: string, dir: -1 | 1) => {
    const i = team.indexOf(a);
    const j = i + dir;
    if (j < 0 || j >= team.length) return;
    const next = [...team];
    [next[i], next[j]] = [next[j], next[i]];
    setTeam(next);
  };

  const togglePropertyAll = () => {
    setSelectedProperties(selectedProperties.length === PROPERTIES.length ? [] : [...PROPERTIES]);
  };
  const toggleProperty = (p: string) => {
    setSelectedProperties((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleSave = () => {
    toast.success('Assignation enregistrée', {
      description: `${selectedProperties.length} logement${selectedProperties.length > 1 ? 's' : ''} · ${team.length} prestataire${team.length > 1 ? 's' : ''}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Assignation des ménages
          </DialogTitle>
          <DialogDescription>
            Définissez les prestataires et leurs conditions, puis cochez les logements concernés.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 1. Auto-assignation toggle */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <div>
              <p className="text-[13px] font-semibold">Auto-assignation</p>
              <p className="text-[11px] text-muted-foreground">Assigner automatiquement les nouveaux ménages</p>
            </div>
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
          </div>

          {/* 2. Mode d'assignation */}
          {autoAssign && (
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Mode d'assignation</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setMode('priority')}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    mode === 'priority' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <p className="text-[13px] font-semibold">Priorité</p>
                  <p className="text-[11px] text-muted-foreground">1er prestataire, fallback si indispo</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('rotation')}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    mode === 'rotation' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <p className="text-[13px] font-semibold">Rotation (aléatoire)</p>
                  <p className="text-[11px] text-muted-foreground">Round-robin entre prestataires</p>
                </button>
              </div>
            </div>
          )}

          {/* 3. Prestataires avec leurs conditions (jours travaillés) */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Prestataires ({team.length})
            </Label>
            <p className="text-[11px] text-muted-foreground mt-1">
              Cochez les jours travaillés de chaque prestataire — condition appliquée à l'assignation.
            </p>
            <div className="mt-2 space-y-2">
              {team.map((a, i) => (
                <div key={a} className="rounded-xl border border-border p-2.5 space-y-2">
                  <div className="flex items-center gap-2">
                    {mode === 'priority' && (
                      <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[11px] bg-muted">
                        {a.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] flex-1 truncate font-medium">{a}</span>
                    {mode === 'priority' && (
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(a, -1)} disabled={i === 0}>↑</Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(a, 1)} disabled={i === team.length - 1}>↓</Button>
                      </div>
                    )}
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => removeAgent(a)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 pl-1 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Jours</span>
                    {DAYS.map((d, idx) => {
                      const active = (workDays[a] || []).includes(d.key);
                      return (
                        <button
                          key={`${a}-${idx}`}
                          type="button"
                          onClick={() => toggleDay(a, d.key)}
                          className={`h-7 w-7 rounded-full text-[11px] font-semibold transition-colors ${
                            active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {team.length === 0 && (
                <p className="text-xs text-muted-foreground italic px-1">Aucun prestataire — ajoutez-en pour commencer.</p>
              )}
          {/* 4. Logements concernés (cases à cocher) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Logements concernés ({selectedProperties.length}/{PROPERTIES.length})
              </Label>
              <button
                type="button"
                onClick={togglePropertyAll}
                className="text-[11px] text-primary font-semibold hover:underline"
              >
                {selectedProperties.length === PROPERTIES.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
            </div>

            {/* Légende des états existants */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Déjà assigné :</span>
              {(['priority', 'rotation', 'single'] as ExistingMode[]).map((m) => {
                const count = PROPERTIES.filter((p) => EXISTING_ASSIGNMENTS[p]?.mode === m).length;
                return (
                  <Badge key={m} variant="outline" className={`text-[10px] font-medium ${MODE_META[m].cls}`}>
                    {MODE_META[m].label} · {count}
                  </Badge>
                );
              })}
              <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground border-border">
                Non assigné · {PROPERTIES.filter((p) => !EXISTING_ASSIGNMENTS[p]).length}
              </Badge>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border max-h-64 overflow-y-auto">
              {PROPERTIES.map((p) => {
                const checked = selectedProperties.includes(p);
                const existing = EXISTING_ASSIGNMENTS[p];
                const conflict = checked && existing && existing.mode !== mode;
                return (
                  <label
                    key={p}
                    className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                      conflict ? 'bg-[hsl(38,92%,50%)]/5' : checked ? 'bg-primary/5' : 'hover:bg-muted/40'
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleProperty(p)} />
                    <Home className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] truncate">{p}</span>
                        {existing ? (
                          <Badge variant="outline" className={`text-[10px] font-medium flex-shrink-0 ${MODE_META[existing.mode].cls}`}>
                            {existing.mode === 'single' && <Lock className="h-2.5 w-2.5 mr-0.5" />}
                            {MODE_META[existing.mode].label}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground border-border flex-shrink-0">
                            Libre
                          </Badge>
                        )}
                      </div>
                      {existing && (
                        <p className="text-[10.5px] text-muted-foreground truncate mt-0.5">
                          → {existing.agents.join(existing.mode === 'priority' ? ' › ' : ', ')}
                        </p>
                      )}
                      {conflict && (
                        <p className="text-[10.5px] text-[hsl(38,92%,40%)] font-medium mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Écrasera l'assignation {MODE_META[existing!.mode].label.toLowerCase()} actuelle
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

            </div>
            <div className="rounded-xl border border-border divide-y divide-border max-h-56 overflow-y-auto">
              {PROPERTIES.map((p) => {
                const checked = selectedProperties.includes(p);
                return (
                  <label
                    key={p}
                    className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                      checked ? 'bg-primary/5' : 'hover:bg-muted/40'
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleProperty(p)} />
                    <Home className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-[13px] flex-1 truncate">{p}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {autoAssign && team.length > 0 && selectedProperties.length > 0 && (
            <div className="rounded-xl bg-[hsl(210,100%,96%)] border border-[hsl(210,100%,90%)] p-3 flex items-start gap-2">
              <Zap className="h-4 w-4 text-[hsl(213,84%,40%)] flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-[hsl(213,84%,30%)]">
                {selectedProperties.length} logement{selectedProperties.length > 1 ? 's' : ''} assigné{selectedProperties.length > 1 ? 's' : ''} via{' '}
                <strong>{mode === 'priority' ? `priorité (${team[0]} en 1er)` : 'rotation aléatoire'}</strong>, en tenant compte des jours travaillés de chaque prestataire.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
