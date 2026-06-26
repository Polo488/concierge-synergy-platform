import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sparkles, Zap, Home, Search, ArrowRight, Lock, Repeat, ListOrdered } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useCleaningTeam,
  AssignmentMode,
  getModeMeta,
} from '@/contexts/CleaningTeamContext';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODE_OPTIONS: { id: AssignmentMode; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'priority',
    title: 'Priorité',
    desc: '1ère agence, fallback si indispo',
    icon: <ListOrdered className="h-4 w-4" />,
  },
  {
    id: 'rotation',
    title: 'Rotation',
    desc: 'Équilibrage entre agences (la moins chargée)',
    icon: <Repeat className="h-4 w-4" />,
  },
  {
    id: 'dedicated',
    title: 'Dédié',
    desc: 'Chaque logement toujours à la même agence',
    icon: <Lock className="h-4 w-4" />,
  },
];

export const CleaningAssignmentDialog = ({ open, onOpenChange }: Props) => {
  const {
    autoAssign,
    setAutoAssign,
    agencies,
    catalog,
    assignments,
    setAssignmentsForProperties,
  } = useCleaningTeam();

  const [mode, setMode] = useState<AssignmentMode>('priority');
  const [team, setTeam] = useState<string[]>(agencies.slice(0, 2).map((a) => a.id));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () => catalog.filter((p) => p.toLowerCase().includes(search.toLowerCase())),
    [catalog, search]
  );

  const assignmentByProperty = useMemo(() => {
    const m = new Map<string, (typeof assignments)[number]>();
    assignments.forEach((a) => m.set(a.property, a));
    return m;
  }, [assignments]);

  // Recap counts (coherent with the list below)
  const recap = useMemo(() => {
    const counts: Record<AssignmentMode | 'free', number> = { priority: 0, rotation: 0, dedicated: 0, free: 0 };
    catalog.forEach((p) => {
      const a = assignmentByProperty.get(p);
      if (!a) counts.free++;
      else counts[a.mode]++;
    });
    return counts;
  }, [catalog, assignmentByProperty]);

  const toggleAgency = (id: string) =>
    setTeam((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const moveAgency = (id: string, dir: -1 | 1) => {
    setTeam((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const toggleProperty = (p: string) =>
    setSelected((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered);

  const canSave = team.length > 0 && selected.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    setAssignmentsForProperties(selected, mode, team);
    toast.success('Assignation enregistrée', {
      description: `${selected.length} logement${selected.length > 1 ? 's' : ''} · mode ${getModeMeta(mode).label.toLowerCase()}`,
    });
    setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] max-h-[92vh] overflow-hidden p-0 rounded-[20px]">
        <div className="px-6 pt-6 pb-3">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-[18px] font-bold inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Assignation des ménages
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Définissez les agences, leur mode d'assignation, puis cochez les logements concernés.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 pb-4 space-y-4" style={{ maxHeight: 'calc(92vh - 200px)' }}>
          {/* Auto-assignation */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3.5">
            <div>
              <p className="text-[13px] font-semibold">Auto-assignation</p>
              <p className="text-[11.5px] text-muted-foreground">Assigner automatiquement les nouveaux ménages</p>
            </div>
            <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
          </div>

          {/* Mode */}
          <div>
            <Label className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">Mode d'assignation</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              {MODE_OPTIONS.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      active
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border hover:border-foreground/20'
                    }`}
                  >
                    <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg mb-2 ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {m.icon}
                    </div>
                    <p className="text-[13px] font-semibold">{m.title}</p>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-snug">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agences */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                Agences ({team.length}/{agencies.length})
              </Label>
              {mode === 'dedicated' && team.length > 1 && (
                <span className="text-[11px] text-muted-foreground">En mode Dédié, seule la 1ère agence est utilisée</span>
              )}
            </div>
            {agencies.length === 0 ? (
              <p className="text-[12px] text-muted-foreground italic px-1 py-2">
                Aucune agence enregistrée — ajoutez-en depuis "Équipe & assignation › Agences".
              </p>
            ) : (
              <div className="space-y-1.5">
                {agencies.map((a) => {
                  const checked = team.includes(a.id);
                  const i = team.indexOf(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                        checked ? 'border-primary/30 bg-primary/5' : 'border-border'
                      }`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleAgency(a.id)} />
                      {mode === 'priority' && checked && (
                        <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {a.workDays.length} j/sem · {a.maxPerDay ?? '∞'} ménages max/j
                        </p>
                      </div>
                      {mode === 'priority' && checked && (
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveAgency(a.id, -1)} disabled={i <= 0}>↑</Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveAgency(a.id, 1)} disabled={i >= team.length - 1}>↓</Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Logements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                Logements concernés ({selected.length}/{filtered.length})
              </Label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-[11px] text-primary font-semibold hover:underline"
              >
                {selected.length === filtered.length && filtered.length > 0 ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
            </div>

            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un logement…"
                className="pl-9 h-9 rounded-[10px] bg-muted/40 border-border text-[13px]"
              />
            </div>

            {/* Recap chips — coherent with list */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Déjà assigné :</span>
              {(['priority', 'rotation', 'dedicated'] as AssignmentMode[]).map((m) => (
                <Badge key={m} variant="outline" className={`text-[10px] font-medium ${getModeMeta(m).cls}`}>
                  {getModeMeta(m).label} · {recap[m]}
                </Badge>
              ))}
              <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground border-border">
                Libre · {recap.free}
              </Badge>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border max-h-64 overflow-y-auto">
              {filtered.map((p) => {
                const checked = selected.includes(p);
                const existing = assignmentByProperty.get(p);
                const agencyNames = existing?.agencyIds.map((id) => agencies.find((a) => a.id === id)?.name).filter(Boolean) as string[] | undefined;
                return (
                  <label
                    key={p}
                    className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                      checked ? 'bg-primary/5' : 'hover:bg-muted/30'
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleProperty(p)} />
                    <Home className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] truncate">{p}</span>
                        {existing ? (
                          <Badge variant="outline" className={`text-[10px] font-medium flex-shrink-0 ${getModeMeta(existing.mode).cls}`}>
                            {getModeMeta(existing.mode).label}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-medium bg-muted text-muted-foreground border-border flex-shrink-0">
                            Libre
                          </Badge>
                        )}
                      </div>
                      {agencyNames && agencyNames.length > 0 && (
                        <p className="text-[10.5px] text-muted-foreground truncate mt-0.5">
                          → {agencyNames.join(existing?.mode === 'priority' ? ' › ' : ', ')}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-[12px] text-muted-foreground italic px-3 py-4 text-center">
                  Aucun logement correspondant à "{search}".
                </p>
              )}
            </div>
          </div>

          {canSave && (
            <div className="rounded-xl bg-[hsl(210,100%,96%)] border border-[hsl(210,100%,90%)] p-3 flex items-start gap-2">
              <Zap className="h-4 w-4 text-[hsl(213,84%,40%)] flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-[hsl(213,84%,30%)]">
                {selected.length} logement{selected.length > 1 ? 's' : ''} → <strong>{getModeMeta(mode).label.toLowerCase()}</strong>
                {mode === 'priority' && team[0] && (() => {
                  const first = agencies.find((a) => a.id === team[0])?.name;
                  return first ? <> · {first} en 1<sup>er</sup></> : null;
                })()}
                {mode === 'dedicated' && team[0] && (() => {
                  const first = agencies.find((a) => a.id === team[0])?.name;
                  return first ? <> · toujours {first}</> : null;
                })()}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 rounded-[10px]">
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!canSave} className="h-9 rounded-[10px] gap-1.5">
            Enregistrer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
