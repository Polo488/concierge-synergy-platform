
import { useState, useEffect } from 'react';
import { 
  Clock, 
  Zap, 
  Hand,
  ChevronRight,
  ChevronLeft,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessagingRule, 
  MessageTemplate,
  TriggerType,
  TimeRelativeTo,
  EventType,
  MessageChannel,
  PropertyScope,
  EVENT_TYPE_LABELS,
  CHANNEL_LABELS,
  TEMPLATE_VARIABLES
} from '@/types/guestExperience';
import { cn } from '@/lib/utils';

interface RuleBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: MessagingRule | null;
  templates: MessageTemplate[];
  onSave: (rule: Omit<MessagingRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>) => void;
}

const STEPS = [
  { id: 1, name: 'Identité', description: 'Nom et description' },
  { id: 2, name: 'Déclencheur', description: 'Quand envoyer' },
  { id: 3, name: 'Portée', description: 'Quelles propriétés' },
  { id: 4, name: 'Canaux', description: 'Où envoyer' },
  { id: 5, name: 'Message', description: 'Contenu' },
  { id: 6, name: 'Options', description: 'Configuration' },
];

export function RuleBuilderDialog({
  open,
  onOpenChange,
  rule,
  templates,
  onSave,
}: RuleBuilderDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('time-based');
  const [relativeTo, setRelativeTo] = useState<TimeRelativeTo>('checkin');
  const [dayOffset, setDayOffset] = useState(0);
  const [time, setTime] = useState('09:00');
  const [eventType, setEventType] = useState<EventType>('reservation_created');
  const [delayMinutes, setDelayMinutes] = useState(5);
  const [propertyScope, setPropertyScope] = useState<PropertyScope>('all');
  const [channels, setChannels] = useState<MessageChannel[]>(['email']);
  const [templateId, setTemplateId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [allowManualOverride, setAllowManualOverride] = useState(true);
  
  // Reset form when dialog opens/closes or rule changes
  useEffect(() => {
    if (open) {
      if (rule) {
        setName(rule.name);
        setDescription(rule.description || '');
        setTriggerType(rule.triggerType);
        if (rule.timeTrigger) {
          setRelativeTo(rule.timeTrigger.relativeTo);
          setDayOffset(rule.timeTrigger.dayOffset);
          setTime(rule.timeTrigger.time);
        }
        if (rule.eventTrigger) {
          setEventType(rule.eventTrigger.eventType);
          setDelayMinutes(rule.eventTrigger.delayMinutes || 5);
        }
        setPropertyScope(rule.propertyScope);
        setChannels(rule.channels);
        setTemplateId(rule.templateId || '');
        setCustomMessage(rule.customMessage || '');
        setUseTemplate(!!rule.templateId);
        setPreventDuplicates(rule.preventDuplicates);
        setAllowManualOverride(rule.allowManualOverride);
      } else {
        // Reset to defaults for new rule
        setName('');
        setDescription('');
        setTriggerType('time-based');
        setRelativeTo('checkin');
        setDayOffset(0);
        setTime('09:00');
        setEventType('reservation_created');
        setDelayMinutes(5);
        setPropertyScope('all');
        setChannels(['email']);
        setTemplateId('');
        setCustomMessage('');
        setUseTemplate(true);
        setPreventDuplicates(true);
        setAllowManualOverride(true);
      }
      setCurrentStep(1);
    }
  }, [open, rule]);

  const handleChannelToggle = (channel: MessageChannel) => {
    setChannels(prev => 
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVariable(variable);
    setTimeout(() => setCopiedVariable(null), 2000);
  };

  const handleSave = () => {
    const ruleData: Omit<MessagingRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'> = {
      name,
      description,
      status: rule?.status || 'draft',
      triggerType,
      propertyScope,
      channels,
      preventDuplicates,
      allowManualOverride,
      lastExecutedAt: rule?.lastExecutedAt,
    };

    if (triggerType === 'time-based') {
      ruleData.timeTrigger = { relativeTo, dayOffset, time };
    } else if (triggerType === 'event-based') {
      ruleData.eventTrigger = { eventType, delayMinutes };
    }

    if (useTemplate && templateId) {
      ruleData.templateId = templateId;
    } else {
      ruleData.customMessage = customMessage;
    }

    onSave(ruleData);
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return channels.length > 0;
      case 5:
        return useTemplate ? !!templateId : customMessage.trim().length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Modifier la règle' : 'Créer une règle de messagerie'}
          </DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  currentStep === step.id 
                    ? "bg-primary text-primary-foreground" 
                    : currentStep > step.id
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div 
                  className={cn(
                    "w-12 h-0.5 mx-1",
                    currentStep > step.id ? "bg-primary/20" : "bg-muted"
                  )} 
                />
              )}
            </div>
          ))}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {/* Step 1: Identity */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la règle *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Bienvenue - Jour d'arrivée"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez ce que fait cette règle..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Trigger */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base">Type de déclencheur</Label>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setTriggerType('time-based')}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      triggerType === 'time-based' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Clock className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">Programmé</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      À un moment précis
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriggerType('event-based')}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      triggerType === 'event-based' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Zap className="h-8 w-8 mb-2 text-amber-500" />
                    <span className="font-medium">Événement</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Après une action
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriggerType('manual')}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      triggerType === 'manual' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Hand className="h-8 w-8 mb-2 text-green-500" />
                    <span className="font-medium">Manuel</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Déclenché à la main
                    </span>
                  </button>
                </div>
              </div>

              {triggerType === 'time-based' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Relatif à</Label>
                    <Select value={relativeTo} onValueChange={(v) => setRelativeTo(v as TimeRelativeTo)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkin">Check-in</SelectItem>
                        <SelectItem value="checkout">Check-out</SelectItem>
                        <SelectItem value="booking_date">Date de réservation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Décalage (jours)</Label>
                      <Select value={dayOffset.toString()} onValueChange={(v) => setDayOffset(parseInt(v))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-7">7 jours avant</SelectItem>
                          <SelectItem value="-3">3 jours avant</SelectItem>
                          <SelectItem value="-2">2 jours avant</SelectItem>
                          <SelectItem value="-1">1 jour avant</SelectItem>
                          <SelectItem value="0">Le jour même</SelectItem>
                          <SelectItem value="1">1 jour après</SelectItem>
                          <SelectItem value="2">2 jours après</SelectItem>
                          <SelectItem value="3">3 jours après</SelectItem>
                          <SelectItem value="7">7 jours après</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Heure d'envoi</Label>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {triggerType === 'event-based' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Événement déclencheur</Label>
                    <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Délai après l'événement (minutes)</Label>
                    <Input
                      type="number"
                      value={delayMinutes}
                      onChange={(e) => setDelayMinutes(parseInt(e.target.value) || 0)}
                      min={0}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {triggerType === 'manual' && (
                <div className="p-4 bg-muted/50 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Cette règle sera déclenchée manuellement depuis la fiche de réservation ou le panneau de messagerie.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Scope */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Label className="text-base">Appliquer à</Label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="scope"
                    checked={propertyScope === 'all'}
                    onChange={() => setPropertyScope('all')}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">Toutes les propriétés</p>
                    <p className="text-sm text-muted-foreground">
                      Cette règle s'appliquera à toutes vos propriétés
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="scope"
                    checked={propertyScope === 'selected'}
                    onChange={() => setPropertyScope('selected')}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">Propriétés sélectionnées</p>
                    <p className="text-sm text-muted-foreground">
                      Choisir des propriétés spécifiques
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <input
                    type="radio"
                    name="scope"
                    checked={propertyScope === 'groups'}
                    onChange={() => setPropertyScope('groups')}
                    className="h-4 w-4"
                  />
                  <div>
                    <p className="font-medium">Groupes de propriétés</p>
                    <p className="text-sm text-muted-foreground">
                      Appliquer à des groupes prédéfinis
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Channels */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Label className="text-base">Canaux de diffusion</Label>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les canaux sur lesquels ce message sera envoyé
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.entries(CHANNEL_LABELS).map(([channel, label]) => (
                  <label
                    key={channel}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      channels.includes(channel as MessageChannel)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={channels.includes(channel as MessageChannel)}
                      onCheckedChange={() => handleChannelToggle(channel as MessageChannel)}
                    />
                    <span className="font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Message */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <Tabs value={useTemplate ? 'template' : 'custom'} onValueChange={(v) => setUseTemplate(v === 'template')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="template">Utiliser un modèle</TabsTrigger>
                  <TabsTrigger value="custom">Message personnalisé</TabsTrigger>
                </TabsList>
                
                <TabsContent value="template" className="space-y-4 mt-4">
                  <div>
                    <Label>Sélectionner un modèle</Label>
                    <Select value={templateId} onValueChange={setTemplateId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choisir un modèle..." />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {templateId && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Aperçu :</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {templates.find(t => t.id === templateId)?.content.slice(0, 200)}...
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4 mt-4">
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Rédigez votre message..."
                      className="mt-1 min-h-[150px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Variables disponibles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TEMPLATE_VARIABLES.slice(0, 10).map(variable => (
                        <Badge
                          key={variable}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleCopyVariable(variable)}
                        >
                          {copiedVariable === variable ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 6: Options */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Prévenir les doublons</p>
                  <p className="text-sm text-muted-foreground">
                    Ne pas renvoyer si un message similaire a déjà été envoyé
                  </p>
                </div>
                <Switch
                  checked={preventDuplicates}
                  onCheckedChange={setPreventDuplicates}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Autoriser le déclenchement manuel</p>
                  <p className="text-sm text-muted-foreground">
                    Permettre d'envoyer ce message manuellement
                  </p>
                </div>
                <Switch
                  checked={allowManualOverride}
                  onCheckedChange={setAllowManualOverride}
                />
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={!canProceed()}>
                {rule ? 'Enregistrer' : 'Créer la règle'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
