
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, GripVertical, Image, Video, Wifi, Home, ShoppingCart, Save,
  Plus, Trash2, ChevronUp, ChevronDown, Sparkles, ImageIcon, Type
} from 'lucide-react';
import { WelcomeGuideTemplate, WelcomeGuideStep, WelcomeGuideUpsell } from '@/types/welcomeGuide';
import { toast } from 'sonner';

interface Props {
  template: WelcomeGuideTemplate;
  onBack: () => void;
}

const STEP_TYPE_OPTIONS: { value: WelcomeGuideStep['type']; label: string; icon: string }[] = [
  { value: 'building_arrival', label: 'Arrivée bâtiment', icon: '🏢' },
  { value: 'key_access', label: 'Récupération clés', icon: '🔑' },
  { value: 'apartment_access', label: 'Accès logement', icon: '🚪' },
  { value: 'welcome', label: 'Bienvenue', icon: '👋' },
  { value: 'upsell', label: 'Upsells', icon: '🛒' },
  { value: 'custom', label: 'Étape personnalisée', icon: '✨' },
];

export function WelcomeGuideEditor({ template, onBack }: Props) {
  const [form, setForm] = useState<WelcomeGuideTemplate>({
    ...template,
    landingConfig: template.landingConfig || {
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      showHostBadge: true,
      showNightsBadge: true,
      showPropertyCard: true,
      showDates: true,
    },
  });
  const [activeTab, setActiveTab] = useState('steps');

  const updateStep = useCallback((stepId: string, updates: Partial<WelcomeGuideStep>) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, ...updates } : s),
    }));
  }, []);

  const addStep = useCallback(() => {
    const newStep: WelcomeGuideStep = {
      id: `step-${Date.now()}`,
      order: form.steps.length + 1,
      type: 'custom',
      title: 'Nouvelle étape',
      description: '',
      validationLabel: 'Continuer',
      isOptional: false,
      isActive: true,
    };
    setForm(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    toast.success('Étape ajoutée');
  }, [form.steps.length]);

  const removeStep = useCallback((stepId: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps
        .filter(s => s.id !== stepId)
        .map((s, i) => ({ ...s, order: i + 1 })),
    }));
    toast.success('Étape supprimée');
  }, []);

  const moveStep = useCallback((stepId: string, direction: 'up' | 'down') => {
    setForm(prev => {
      const idx = prev.steps.findIndex(s => s.id === stepId);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === prev.steps.length - 1)) return prev;
      const newSteps = [...prev.steps];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
      return { ...prev, steps: newSteps.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }, []);

  const addUpsell = useCallback(() => {
    const newUpsell: WelcomeGuideUpsell = {
      id: `upsell-${Date.now()}`,
      name: 'Nouveau service',
      description: '',
      price: 0,
      currency: '€',
      isActive: true,
    };
    setForm(prev => ({ ...prev, upsells: [...prev.upsells, newUpsell] }));
    toast.success('Upsell ajouté');
  }, []);

  const updateUpsell = useCallback((upsellId: string, updates: Partial<WelcomeGuideUpsell>) => {
    setForm(prev => ({
      ...prev,
      upsells: prev.upsells.map(u => u.id === upsellId ? { ...u, ...updates } : u),
    }));
  }, []);

  const removeUpsell = useCallback((upsellId: string) => {
    setForm(prev => ({ ...prev, upsells: prev.upsells.filter(u => u.id !== upsellId) }));
    toast.success('Upsell supprimé');
  }, []);

  const addHouseRule = useCallback(() => {
    setForm(prev => ({ ...prev, houseRules: [...(prev.houseRules || []), ''] }));
  }, []);

  const updateHouseRule = useCallback((index: number, value: string) => {
    setForm(prev => {
      const rules = [...(prev.houseRules || [])];
      rules[index] = value;
      return { ...prev, houseRules: rules };
    });
  }, []);

  const removeHouseRule = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      houseRules: (prev.houseRules || []).filter((_, i) => i !== index),
    }));
  }, []);

  const stepIcon = (type: string) => STEP_TYPE_OPTIONS.find(o => o.value === type)?.icon || '✨';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <Input
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="text-lg font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
          />
          <Input
            value={form.propertyName || ''}
            onChange={e => setForm(prev => ({ ...prev, propertyName: e.target.value }))}
            placeholder="Nom du logement"
            className="text-sm text-muted-foreground border-0 bg-transparent p-0 h-auto focus-visible:ring-0 mt-0.5"
          />
        </div>
        <Button className="gap-2" onClick={() => { toast.success('Livret sauvegardé'); onBack(); }}>
          <Save size={16} /> Sauvegarder
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-panel">
          <TabsTrigger value="steps" className="gap-2"><Type size={14} /> Étapes</TabsTrigger>
          <TabsTrigger value="landing" className="gap-2"><ImageIcon size={14} /> Page d'accueil</TabsTrigger>
          <TabsTrigger value="upsells" className="gap-2"><Sparkles size={14} /> Upsells</TabsTrigger>
          <TabsTrigger value="info" className="gap-2"><Home size={14} /> Infos logement</TabsTrigger>
        </TabsList>

        {/* ===== STEPS TAB ===== */}
        <TabsContent value="steps" className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{form.steps.length} étape{form.steps.length > 1 ? 's' : ''}</h3>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={addStep}>
              <Plus size={14} /> Ajouter une étape
            </Button>
          </div>

          {form.steps.map((step, idx) => (
            <Card key={step.id} className={`glass-panel transition-all ${!step.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Drag handle + reorder */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button onClick={() => moveStep(step.id, 'up')} disabled={idx === 0}
                      className="text-muted-foreground/50 hover:text-foreground disabled:opacity-30 transition-colors">
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-lg">{stepIcon(step.type)}</span>
                    <button onClick={() => moveStep(step.id, 'down')} disabled={idx === form.steps.length - 1}
                      className="text-muted-foreground/50 hover:text-foreground disabled:opacity-30 transition-colors">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant="outline" className="text-xs shrink-0">{step.order}</Badge>
                        <select
                          value={step.type}
                          onChange={e => updateStep(step.id, { type: e.target.value as WelcomeGuideStep['type'] })}
                          className="h-7 text-xs rounded-md border border-input bg-background px-2 focus:outline-none"
                        >
                          {STEP_TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                          Optionnel
                          <Switch checked={step.isOptional} onCheckedChange={v => updateStep(step.id, { isOptional: v })} />
                        </label>
                        <Switch checked={step.isActive} onCheckedChange={v => updateStep(step.id, { isActive: v })} />
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive"
                          onClick={() => removeStep(step.id)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <Input
                      value={step.title}
                      onChange={e => updateStep(step.id, { title: e.target.value })}
                      placeholder="Titre de l'étape"
                      className="h-9 text-sm font-medium"
                    />

                    {/* Description */}
                    <Textarea
                      value={step.description}
                      onChange={e => updateStep(step.id, { description: e.target.value })}
                      placeholder="Instructions pour le voyageur..."
                      className="text-sm min-h-[60px] resize-none"
                    />

                    {/* Context hint */}
                    <Input
                      value={step.contextHint || ''}
                      onChange={e => updateStep(step.id, { contextHint: e.target.value })}
                      placeholder="Indication contextuelle (ex: 'Vous y êtes presque')"
                      className="h-8 text-xs"
                    />

                    {/* Help text */}
                    <Input
                      value={step.helpText || ''}
                      onChange={e => updateStep(step.id, { helpText: e.target.value })}
                      placeholder="Texte d'aide optionnel"
                      className="h-8 text-xs"
                    />

                    {/* Media + validation row */}
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        value={step.validationLabel}
                        onChange={e => updateStep(step.id, { validationLabel: e.target.value })}
                        placeholder="Texte du bouton"
                        className="h-8 text-xs flex-1 min-w-[180px]"
                      />
                      <div className="flex gap-1.5">
                        <div className="relative">
                          <Input
                            value={step.imageUrl || ''}
                            onChange={e => updateStep(step.id, { imageUrl: e.target.value })}
                            placeholder="URL image"
                            className="h-8 text-xs pl-7 w-[200px]"
                          />
                          <Image size={12} className="absolute left-2 top-2 text-muted-foreground" />
                        </div>
                        <div className="relative">
                          <Input
                            value={step.videoUrl || ''}
                            onChange={e => updateStep(step.id, { videoUrl: e.target.value })}
                            placeholder="URL vidéo"
                            className="h-8 text-xs pl-7 w-[200px]"
                          />
                          <Video size={12} className="absolute left-2 top-2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Preview thumbnails */}
                    <div className="flex gap-2">
                      {step.imageUrl && (
                        <div className="relative group">
                          <img src={step.imageUrl} alt="" className="h-16 w-24 rounded-lg object-cover border border-border/30" />
                          <button onClick={() => updateStep(step.id, { imageUrl: '' })}
                            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                            ×
                          </button>
                        </div>
                      )}
                      {step.videoUrl && (
                        <div className="h-16 px-3 rounded-lg bg-accent/30 flex items-center gap-2 text-xs text-muted-foreground border border-border/30">
                          <Video size={14} />
                          Vidéo liée
                          <button onClick={() => updateStep(step.id, { videoUrl: '' })}
                            className="text-destructive hover:text-destructive/80 ml-1">×</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full gap-2 border-dashed" onClick={addStep}>
            <Plus size={16} /> Ajouter une étape
          </Button>
        </TabsContent>

        {/* ===== LANDING TAB ===== */}
        <TabsContent value="landing" className="space-y-4 mt-4">
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><ImageIcon size={14} /> Image de couverture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">URL de l'image hero</Label>
                <Input
                  value={form.landingConfig?.heroImage || ''}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    landingConfig: { ...prev.landingConfig!, heroImage: e.target.value },
                  }))}
                  placeholder="https://images.unsplash.com/..."
                  className="h-9 text-sm mt-1"
                />
              </div>
              {form.landingConfig?.heroImage && (
                <div className="relative rounded-xl overflow-hidden border border-border/30">
                  <img src={form.landingConfig.heroImage} alt="" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-sm font-bold text-slate-800">{form.propertyName || 'Nom du logement'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Éléments affichés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'showHostBadge', label: 'Badge hôte' },
                { key: 'showNightsBadge', label: 'Badge nombre de nuits' },
                { key: 'showPropertyCard', label: 'Carte du logement' },
                { key: 'showDates', label: 'Dates de séjour' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-lg bg-accent/30">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Switch
                    checked={(form.landingConfig as any)?.[item.key] ?? true}
                    onCheckedChange={v => setForm(prev => ({
                      ...prev,
                      landingConfig: { ...prev.landingConfig!, [item.key]: v },
                    }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== UPSELLS TAB ===== */}
        <TabsContent value="upsells" className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{form.upsells.length} service{form.upsells.length > 1 ? 's' : ''}</h3>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={addUpsell}>
              <Plus size={14} /> Ajouter un upsell
            </Button>
          </div>

          {form.upsells.map(upsell => (
            <Card key={upsell.id} className={`glass-panel transition-all ${!upsell.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={upsell.name}
                    onChange={e => updateUpsell(upsell.id, { name: e.target.value })}
                    placeholder="Nom du service"
                    className="h-9 text-sm font-medium flex-1 mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <Switch checked={upsell.isActive} onCheckedChange={v => updateUpsell(upsell.id, { isActive: v })} />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive"
                      onClick={() => removeUpsell(upsell.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={upsell.description}
                  onChange={e => updateUpsell(upsell.id, { description: e.target.value })}
                  placeholder="Description du service..."
                  className="text-sm min-h-[50px] resize-none"
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Prix</Label>
                    <Input
                      type="number"
                      value={upsell.price}
                      onChange={e => updateUpsell(upsell.id, { price: parseFloat(e.target.value) || 0 })}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <div className="w-20">
                    <Label className="text-xs">Devise</Label>
                    <Input
                      value={upsell.currency}
                      onChange={e => updateUpsell(upsell.id, { currency: e.target.value })}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full gap-2 border-dashed" onClick={addUpsell}>
            <Plus size={16} /> Ajouter un upsell
          </Button>
        </TabsContent>

        {/* ===== INFO TAB ===== */}
        <TabsContent value="info" className="space-y-4 mt-4">
          <Card className="glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Home size={14} /> Informations</CardTitle>
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Règles du logement</CardTitle>
                <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={addHouseRule}>
                  <Plus size={12} /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {(form.houseRules || []).map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={rule}
                    onChange={e => updateHouseRule(idx, e.target.value)}
                    placeholder="Règle..."
                    className="h-8 text-sm flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive"
                    onClick={() => removeHouseRule(idx)}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
              {(!form.houseRules || form.houseRules.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-3">Aucune règle ajoutée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
