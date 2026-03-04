
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, ClipboardCheck } from 'lucide-react';

interface NewCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: { id: string; name: string; address: string }[];
  inspectorName: string;
  onCreateCheck: (propertyId: string, inspectorName: string, scheduledDate?: string) => void;
}

export const NewCheckDialog: React.FC<NewCheckDialogProps> = ({
  open,
  onOpenChange,
  properties,
  inspectorName,
  onCreateCheck,
}) => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleCreate = () => {
    if (!selectedProperty) return;
    onCreateCheck(selectedProperty, inspectorName, isScheduled ? scheduledDate : undefined);
    setSelectedProperty('');
    setScheduledDate('');
    setIsScheduled(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck size={20} className="text-primary" />
            Nouvelle inspection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Propriété *</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une propriété" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Inspecteur</Label>
            <Input value={inspectorName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="schedule"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="schedule" className="cursor-pointer">Planifier à l'avance</Label>
            </div>
            {isScheduled && (
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate} disabled={!selectedProperty}>
            {isScheduled ? 'Planifier' : 'Démarrer l\'inspection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
