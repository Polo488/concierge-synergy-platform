import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X, Inbox, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBlockRequests } from '@/hooks/useBlockRequests';
import { MOTIF_LABELS } from '@/types/blockRequest';
import type { BlockMode, BlockRequest } from '@/types/blockRequest';
import type { CalendarProperty } from '@/types/calendar';

interface BlockRequestsPanelProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  properties: CalendarProperty[];
}

export function BlockRequestsPanel({ open, onOpenChange, properties }: BlockRequestsPanelProps) {
  const {
    requests,
    globalMode,
    setGlobalMode,
    modeFor,
    setPropertyMode,
    approve,
    reject,
  } = useBlockRequests();

  const [tab, setTab] = useState<'pending' | 'history' | 'settings'>('pending');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const pending = requests.filter((r) => r.status === 'pending');
  const history = requests.filter((r) => r.status !== 'pending');

  const handleApprove = (r: BlockRequest) => {
    approve(r.id);
    toast.success(`Demande validée — ${r.propertyName}`, {
      description: 'Le propriétaire a été notifié, synchronisation channels en cours.',
    });
  };

  const handleConfirmReject = (r: BlockRequest) => {
    reject(r.id, rejectNote || undefined);
    toast.success(`Demande refusée — ${r.propertyName}`, {
      description: rejectNote ? `Motif : ${rejectNote}` : 'Le propriétaire a été notifié.',
    });
    setRejectingId(null);
    setRejectNote('');
  };

  const renderRequest = (r: BlockRequest) => (
    <div
      key={r.id}
      className="rounded-xl border border-border/50 bg-card p-3 space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{r.propertyName}</div>
          <div className="text-xs text-muted-foreground">
            {r.ownerName} · demandé le {format(r.requestedAt, 'd MMM', { locale: fr })}
          </div>
        </div>
        {r.status === 'pending' ? (
          <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
            En attente
          </Badge>
        ) : r.status === 'approved' ? (
          <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
            Validée
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            Refusée
          </Badge>
        )}
      </div>

      <div className="text-sm">
        Du <strong>{format(r.startDate, 'd MMM', { locale: fr })}</strong> au{' '}
        <strong>{format(r.endDate, 'd MMM yyyy', { locale: fr })}</strong>
      </div>

      <div className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Motif :</span> {MOTIF_LABELS[r.motif]}
        {r.comment && <> — {r.comment}</>}
      </div>

      {r.decisionNote && (
        <div className="text-xs italic text-muted-foreground">Note admin : {r.decisionNote}</div>
      )}

      {r.status === 'pending' && (
        <>
          {rejectingId === r.id ? (
            <div className="space-y-2 pt-1">
              <Textarea
                placeholder="Motif du refus (optionnel)"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                  Annuler
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleConfirmReject(r)}
                >
                  Confirmer le refus
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRejectingId(r.id)}
                className="flex-1 gap-1"
              >
                <X className="w-3.5 h-3.5" /> Refuser
              </Button>
              <Button size="sm" onClick={() => handleApprove(r)} className="flex-1 gap-1">
                <Check className="w-3.5 h-3.5" /> Valider
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" />
            Demandes de blocage
          </SheetTitle>
          <SheetDescription>
            Demandes des propriétaires et paramétrage du mode de blocage.
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-1 mt-4 p-1 rounded-lg bg-muted">
          {(['pending', 'history', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs font-medium px-2 py-1.5 rounded-md transition-colors ${
                tab === t ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {t === 'pending' && `En attente (${pending.length})`}
              {t === 'history' && 'Historique'}
              {t === 'settings' && (
                <span className="flex items-center justify-center gap-1">
                  <Settings2 className="w-3 h-3" />
                  Mode
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {tab === 'pending' && (
            pending.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune demande en attente.
              </p>
            ) : (
              pending.map(renderRequest)
            )
          )}

          {tab === 'history' && (
            history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun historique.
              </p>
            ) : (
              history.map(renderRequest)
            )
          )}

          {tab === 'settings' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-card p-3 space-y-3">
                <div>
                  <Label className="text-sm font-semibold">Mode par défaut</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comportement appliqué aux propriétaires sans réglage spécifique.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="global-direct" className="text-sm font-normal flex-1">
                    Blocage direct autorisé
                  </Label>
                  <Switch
                    id="global-direct"
                    checked={globalMode === 'direct'}
                    onCheckedChange={(v) => {
                      setGlobalMode(v ? 'direct' : 'request');
                      toast.success(
                        v
                          ? 'Mode par défaut : blocage direct'
                          : 'Mode par défaut : sur demande (validation requise)'
                      );
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold">Surcharges par logement</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Forcer un mode différent pour un logement précis.
                </p>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {properties.slice(0, 10).map((p) => {
                    const m = modeFor(p.id);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border/30"
                      >
                        <span className="text-xs flex-1 truncate">{p.name}</span>
                        <Select
                          value={m}
                          onValueChange={(v) => {
                            setPropertyMode(p.id, v as BlockMode);
                            toast.success(`${p.name} : ${v === 'direct' ? 'direct' : 'sur demande'}`);
                          }}
                        >
                          <SelectTrigger className="w-[130px] h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="direct">Direct</SelectItem>
                            <SelectItem value="request">Sur demande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
