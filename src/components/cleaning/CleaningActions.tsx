
import { Button } from '@/components/ui/button';
import { Tag, Download, Calendar as CalendarIcon, Sparkles, Plus } from 'lucide-react';
import { useCleaning } from '@/contexts/CleaningContext';

interface CleaningActionsProps {
  onAddTask?: () => void;
}

export const CleaningActions = ({ onAddTask }: CleaningActionsProps) => {
  const { 
    openLabelsDialog, 
    handleExport, 
    openCalendarDialog, 
    handleSync, 
    setAddTaskDialogOpen 
  } = useCleaning();

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ménage</h1>
          <p className="text-muted-foreground mt-1">
            Planification et suivi des ménages
          </p>
        </div>
        <Button onClick={() => setAddTaskDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un ménage
        </Button>
      </div>
      
      <div className="w-full flex justify-end gap-2 mt-4">
        <Button size="sm" variant="outline" className="gap-1" onClick={openLabelsDialog}>
          <Tag className="h-4 w-4" />
          Étiquettes
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={openCalendarDialog}>
          <CalendarIcon className="h-4 w-4" />
          Calendrier
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={handleSync}>
          <Sparkles className="h-5 w-5" />
          Synchroniser
        </Button>
      </div>
    </div>
  );
};
