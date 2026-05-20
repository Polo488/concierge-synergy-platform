import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Home, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyTarifTabProps {
  propertyId: string;
}

export const PropertyTarifTab = ({ propertyId }: PropertyTarifTabProps) => {
  // Pricing
  const [providerPrice, setProviderPrice] = useState('45');
  const [providerVAT, setProviderVAT] = useState<'HT' | 'TTC'>('HT');
  const [guestFee, setGuestFee] = useState('70');
  const [feeIncludes, setFeeIncludes] = useState('Forfait incluant blanchisserie et consommables');
  const [pushFee, setPushFee] = useState(true);
  const [nightlyStd, setNightlyStd] = useState('120');
  const [nightlyMin, setNightlyMin] = useState('85');
  const [nightlyMax, setNightlyMax] = useState('220');

  const margin = Math.max(0, Number(guestFee || 0) - Number(providerPrice || 0));
  const marginPct = Number(guestFee) > 0 ? Math.round((margin / Number(guestFee)) * 100) : 0;
  const marginColor = marginPct >= 30 ? 'bg-[hsl(142,76%,36%)]' : marginPct >= 10 ? 'bg-[hsl(45,93%,55%)]' : 'bg-destructive';

  const platforms = [
    { name: 'Airbnb', status: 'synced', last: 'il y a 2 h' },
    { name: 'Booking', status: 'synced', last: 'il y a 2 h' },
    { name: 'Abritel', status: 'pending', last: '—' },
  ];

  const handlePush = () => {
    toast.success('Tarifs poussés sur les plateformes', { description: 'Airbnb, Booking — sync en cours' });
  };

  const handleSave = () => {
    toast.success('Tarification enregistrée');
  };

  const platforms = [
    { name: 'Airbnb', status: 'synced', last: 'il y a 2 h' },
    { name: 'Booking', status: 'synced', last: 'il y a 2 h' },
    { name: 'Abritel', status: 'pending', last: '—' },
  ];

  const handlePush = () => {
    toast.success('Tarifs poussés sur les plateformes', { description: 'Airbnb, Booking — sync en cours' });
  };

  const handleSave = () => {
    toast.success('Tarification enregistrée');
  };

  return (
    <TabsContent value="tarif" className="space-y-4 mt-4">
      {/* Tarification ménage + location */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-[15px] font-bold">Tarification ménage</h3>
            </div>

            <div>
              <Label className="text-[12px]">Prix prestataire</Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <Input value={providerPrice} onChange={(e) => setProviderPrice(e.target.value)} type="number" className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                </div>
                <Select value={providerVAT} onValueChange={(v: 'HT' | 'TTC') => setProviderVAT(v)}>
                  <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HT">HT</SelectItem>
                    <SelectItem value="TTC">TTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[12px]">Forfait facturé voyageur</Label>
              <div className="relative mt-1.5">
                <Input value={guestFee} onChange={(e) => setGuestFee(e.target.value)} type="number" className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
              </div>
            </div>

            <div>
              <Label className="text-[12px]">Description du forfait</Label>
              <Input value={feeIncludes} onChange={(e) => setFeeIncludes(e.target.value)} className="mt-1.5" />
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3">
              <div>
                <p className="text-[13px] font-semibold">Pousser via API plateformes</p>
                <p className="text-[11px] text-muted-foreground">Airbnb, Booking, Abritel</p>
              </div>
              <Switch checked={pushFee} onCheckedChange={setPushFee} />
            </div>

            <div className={`rounded-xl p-3 text-primary-foreground ${marginColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold opacity-90">Marge ménage</span>
                <span className="text-[18px] font-bold tabular-nums">{margin} € · {marginPct}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-[15px] font-bold">Tarification location</h3>
            </div>

            <div>
              <Label className="text-[12px]">Prix nuitée standard</Label>
              <div className="relative mt-1.5">
                <Input value={nightlyStd} onChange={(e) => setNightlyStd(e.target.value)} type="number" className="pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[12px]">Plancher</Label>
                <div className="relative mt-1.5">
                  <Input value={nightlyMin} onChange={(e) => setNightlyMin(e.target.value)} type="number" className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                </div>
              </div>
              <div>
                <Label className="text-[12px]">Plafond</Label>
                <div className="relative mt-1.5">
                  <Input value={nightlyMax} onChange={(e) => setNightlyMax(e.target.value)} type="number" className="pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 text-[12px] text-muted-foreground">
              Pricing dynamique éventuel borné par plancher / plafond.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Synchronisation plateformes */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <h3 className="text-[15px] font-bold">Synchronisation plateformes</h3>
            <Button onClick={handlePush} size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Pousser sur les plateformes
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  {p.status === 'synced' ? (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)]" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-[hsl(45,93%,55%)]" />
                  )}
                  <span className="text-[13px] font-semibold">{p.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{p.last}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Enregistrer la tarification</Button>
      </div>
    </TabsContent>
  );
};
