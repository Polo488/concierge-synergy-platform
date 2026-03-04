
import React, { useState } from 'react';
import {
  InspectionSectionKey,
  InspectionStatus,
  SECTION_LABELS,
} from '@/types/checkApartment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Sparkles,
  Sofa,
  Zap,
  Droplets,
  PaintBucket,
  ShieldCheck,
  Package,
  Camera,
  FileText,
  Mic,
  MicOff,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Image,
} from 'lucide-react';

const SECTION_ICON_MAP: Record<InspectionSectionKey, React.ElementType> = {
  generalCondition: Home,
  cleanliness: Sparkles,
  furnitureEquipment: Sofa,
  electricalAppliances: Zap,
  bathroomPlumbing: Droplets,
  wallsPaintDamage: PaintBucket,
  safetyCompliance: ShieldCheck,
  stockLevel: Package,
  photosMedia: Camera,
  additionalNotes: FileText,
};

const STATUS_CONFIG: Record<InspectionStatus, { label: string; icon: React.ElementType; color: string }> = {
  good: { label: 'Bon', icon: CheckCircle2, color: 'bg-status-success/10 text-status-success border-status-success/30' },
  needs_attention: { label: 'À surveiller', icon: AlertTriangle, color: 'bg-status-warning/10 text-status-warning border-status-warning/30' },
  urgent: { label: 'Urgent', icon: AlertCircle, color: 'bg-status-error/10 text-status-error border-status-error/30' },
};

interface InspectionSectionProps {
  sectionKey: InspectionSectionKey;
  status: InspectionStatus;
  notes: string;
  photos: string[];
  onStatusChange: (status: InspectionStatus) => void;
  onNotesChange: (notes: string) => void;
  onPhotosChange: (photos: string[]) => void;
  onCreateAction?: () => void;
}

export const InspectionSection: React.FC<InspectionSectionProps> = ({
  sectionKey,
  status,
  notes,
  photos,
  onStatusChange,
  onNotesChange,
  onPhotosChange,
  onCreateAction,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const Icon = SECTION_ICON_MAP[sectionKey];
  const label = SECTION_LABELS[sectionKey];

  const startVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La dictée vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'fr-FR';
    rec.continuous = true;
    rec.interimResults = true;

    let finalTranscript = notes;

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onNotesChange(finalTranscript + interim);
    };

    rec.onend = () => {
      setIsRecording(false);
      onNotesChange(finalTranscript.trim());
    };

    rec.start();
    setRecognition(rec);
    setIsRecording(true);
  };

  const stopVoiceDictation = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const mockPhoto = `https://picsum.photos/400/300?random=${Date.now()}`;
    onPhotosChange([...photos, mockPhoto]);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{label}</h3>
        </div>
        {status !== 'good' && onCreateAction && (
          <Button variant="outline" size="sm" onClick={onCreateAction} className="text-xs">
            Créer action
          </Button>
        )}
      </div>

      {/* Status toggles */}
      <div className="flex gap-2">
        {(Object.keys(STATUS_CONFIG) as InspectionStatus[]).map((s) => {
          const config = STATUS_CONFIG[s];
          const StatusIcon = config.icon;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                status === s ? config.color : 'border-border/50 text-muted-foreground hover:bg-accent/50'
              )}
            >
              <StatusIcon size={16} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Notes with voice dictation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Notes</label>
          <Button
            variant={isRecording ? 'destructive' : 'outline'}
            size="sm"
            onClick={isRecording ? stopVoiceDictation : startVoiceDictation}
            className="gap-2"
          >
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            {isRecording ? 'Arrêter' : 'Dictée vocale'}
          </Button>
        </div>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Décrivez l'état observé..."
          className="min-h-[100px] text-base rounded-xl resize-none"
        />
        {isRecording && (
          <div className="flex items-center gap-2 text-sm text-status-error animate-pulse">
            <div className="h-2 w-2 rounded-full bg-status-error" />
            Enregistrement en cours...
          </div>
        )}
      </div>

      {/* Photo upload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Photos</label>
          <Button variant="outline" size="sm" onClick={handlePhotoUpload} className="gap-2">
            <Upload size={14} />
            Ajouter
          </Button>
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted relative group">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onPhotosChange(photos.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground/70 text-background flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {photos.length === 0 && (
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center">
            <Image size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Aucune photo ajoutée</p>
          </div>
        )}
      </div>
    </div>
  );
};
