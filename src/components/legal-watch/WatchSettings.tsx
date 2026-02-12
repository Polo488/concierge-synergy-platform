import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Plus, Trash2, CalendarClock, Bell } from 'lucide-react';
import { WatchSchedule } from '@/types/legalWatch';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  schedules: WatchSchedule[];
  onUpdateSchedules: (s: WatchSchedule[]) => void;
  availableCities: string[];
}

export function WatchSettings({ schedules, onUpdateSchedules, availableCities }: Props) {
  const [newCity, setNewCity] = useState('');
  const [newFreq, setNewFreq] = useState<'monthly' | 'quarterly'>('monthly');
  const [newThreshold, setNewThreshold] = useState('70');

  const handleAdd = () => {
    if (!newCity) return;
    const schedule: WatchSchedule = {
      id: Date.now().toString(),
      scope: { type: 'city', value: newCity },
      frequency: newFreq,
      nextRun: newFreq === 'monthly'
        ? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
        : new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      isActive: true,
      threshold: parseInt(newThreshold) || undefined,
    };
    onUpdateSchedules([...schedules, schedule]);
    setNewCity('');
    toast.success('Veille programmée ajoutée');
  };

  const toggleActive = (id: string) => {
    onUpdateSchedules(
      schedules.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const removeSchedule = (id: string) => {
    onUpdateSchedules(schedules.filter((s) => s.id !== id));
    toast.success('Veille programmée supprimée');
  };

  return (
    <div className="space-y-4">
      {/* Existing schedules */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Veilles programmées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucune veille programmée. Ajoutez-en une ci-dessous.
            </p>
          ) : (
            <div className="space-y-3">
              {schedules.map((s) => (
                <div key={s.id} className="border border-border/50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch checked={s.isActive} onCheckedChange={() => toggleActive(s.id)} />
                    <div>
                      <p className="text-sm font-medium">{s.scope.value || 'Global'}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.frequency === 'monthly' ? 'Mensuelle' : 'Trimestrielle'} · Prochaine : {s.nextRun}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.threshold && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Bell className="h-3 w-3" />
                        Seuil : {s.threshold}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => removeSchedule(s.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add new */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle veille programmée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Ville</Label>
              <Select value={newCity} onValueChange={setNewCity}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Fréquence</Label>
              <Select value={newFreq} onValueChange={(v) => setNewFreq(v as any)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                  <SelectItem value="quarterly">Trimestrielle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Seuil d'alerte</Label>
              <Input
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                min={0}
                max={100}
                className="h-9"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} disabled={!newCity} className="w-full h-9">
                Programmer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
