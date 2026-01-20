import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Tag, Home, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';

interface Property {
  id: string;
  name: string;
}

interface AgendaEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: AgendaEntry | null;
  properties: Property[];
  onSave: (entry: Omit<AgendaEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (id: string) => void;
  defaultDate?: Date;
}

export const AgendaEntryDialog = ({
  open,
  onOpenChange,
  entry,
  properties,
  onSave,
  onDelete,
  defaultDate,
}: AgendaEntryDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [linkedPropertyIds, setLinkedPropertyIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
      setStartDate(new Date(entry.startDate));
      setEndDate(new Date(entry.endDate));
      setStartTime(entry.startTime || '');
      setEndTime(entry.endTime || '');
      setLinkedPropertyIds(entry.linkedPropertyIds);
      setTags(entry.tags);
    } else {
      const date = defaultDate || new Date();
      setTitle('');
      setDescription('');
      setStartDate(date);
      setEndDate(date);
      setStartTime('');
      setEndTime('');
      setLinkedPropertyIds([]);
      setTags([]);
    }
  }, [entry, defaultDate, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      authorId: 'current-user',
      authorName: 'Utilisateur actuel',
      linkedPropertyIds,
      tags,
    });
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleProperty = (propertyId: string) => {
    setLinkedPropertyIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Modifier la note' : 'Nouvelle note'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Réunion d'équipe, Rappel, Note..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails, instructions, informations..."
              rows={3}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "d MMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        if (date > endDate) setEndDate(date);
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "d MMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date < startDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heure de début
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Ajouter
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Linked Properties */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Propriétés liées
            </Label>
            <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
              {properties.map(property => (
                <div key={property.id} className="flex items-center gap-2">
                  <Checkbox
                    id={property.id}
                    checked={linkedPropertyIds.includes(property.id)}
                    onCheckedChange={() => toggleProperty(property.id)}
                  />
                  <label
                    htmlFor={property.id}
                    className="text-sm cursor-pointer"
                  >
                    {property.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {entry && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(entry.id);
                onOpenChange(false);
              }}
              className="mr-auto"
            >
              Supprimer
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {entry ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
