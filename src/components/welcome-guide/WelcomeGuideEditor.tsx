
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, GripVertical, Image, Wifi, Home, ShoppingCart, Save } from 'lucide-react';
import { WelcomeGuideTemplate, WelcomeGuideStep } from '@/types/welcomeGuide';
import { toast } from 'sonner';

interface Props {
  template: WelcomeGuideTemplate;
  onBack: () => void;
}

export function WelcomeGuideEditor({ template, onBack }: Props) {
  const [form, setForm] = useState(template);

  const updateStep = (stepId: string, updates: Partial<WelcomeGuideStep>) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
    }));
  };

  const stepIcons: Record<string, string> = {
    building_arrival: '🏢',
    key_access: '🔑',
    apartment_access: '🚪',
    welcome: '👋',
    upsell: '🛒',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{form.name}</h2>
          <p className="text-sm text-muted-foreground">{form.propertyName}</p>
        </div>
        <Button className="gap-2" onClick={() => { toast.success('Livret sauvegardé'); onBack(); }}>
          <Save size={16} /> Sauvegarder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Étapes du parcours</h3>
          {form.steps.map(step => (
            <Card key={step.id} className={`glass-panel transition-all ${!step.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 pt-1">
                    <GripVertical size={14} className="text-muted-foreground/50 cursor-grab" />
                    <span className="text-lg">{stepIcons[step.type]}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{step.order}</Badge>
                        <Input
                          value={step.title}
                          onChange={e => updateStep(step.id, { title: e.target.value })}
                          className="h-8 text-sm font-medium border-0 bg-transparent p-0 focus-visible:ring-0 w-auto"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                          Optionnel
                          <Switch
                            checked={step.isOptional}
                            onCheckedChange={v => updateStep(step.id, { isOptional: v })}
                          />
                        </label>
                        <Switch
                          checked={step.isActive}
                          onCheckedChange={v => updateStep(step.id, { isActive: v })}
                        />
                      </div>
                    </div>
                    <Textarea
                      value={step.description}
                      onChange={e => updateStep(step.id, { description: e.target.value })}
                      placeholder="Instructions pour le voyageur..."
                      className="text-sm min-h-[60px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={step.validationLabel}
                        onChange={e => updateStep(step.id, { validationLabel: e.target.value })}
                        placeholder="Texte du bouton"
                        className="h-8 text-xs flex-1"
                      />
                      <Button variant="outline" size="sm" className="gap-1 text-xs shrink-0">
                        <Image size={12} /> Photo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Settings sidebar */}
        <div className="space-y-4">
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Home size={14} /> Infos logement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Message de bienvenue</Label>
                <Textarea
                  value={form.welcomeMessage}
                  onChange={e => setForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="text-sm mt-1 min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs flex items-center gap-1"><Wifi size={10} /> Nom WiFi</Label>
                  <Input
                    value={form.wifiName || ''}
                    onChange={e => setForm(prev => ({ ...prev, wifiName: e.target.value }))}
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Mot de passe</Label>
                  <Input
                    value={form.wifiPassword || ''}
                    onChange={e => setForm(prev => ({ ...prev, wifiPassword: e.target.value }))}
                    className="h-8 text-sm mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><ShoppingCart size={14} /> Upsells</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {form.upsells.map(upsell => (
                <div key={upsell.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{upsell.name}</p>
                    <p className="text-xs text-muted-foreground">{upsell.price} {upsell.currency}</p>
                  </div>
                  <Switch checked={upsell.isActive} onCheckedChange={v => {
                    setForm(prev => ({
                      ...prev,
                      upsells: prev.upsells.map(u => u.id === upsell.id ? { ...u, isActive: v } : u),
                    }));
                  }} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
