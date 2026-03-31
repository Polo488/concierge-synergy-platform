
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
    <div className="w-full box-border px-4 pt-4 pb-3 space-y-3">
      {/* Title + main button */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-[22px] md:text-3xl font-bold tracking-tight text-foreground">Ménage</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Planification et suivi des ménages
          </p>
        </div>
        <Button 
          onClick={() => setAddTaskDialogOpen(true)} 
          className="w-full md:w-auto h-11 rounded-[10px] text-sm font-semibold gap-1.5 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          Ajouter un ménage
        </Button>
      </div>
      
      {/* Secondary buttons */}
      <div 
        className="flex gap-2 overflow-x-auto pb-1 md:justify-end"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={openLabelsDialog}>
          <Tag className="h-3.5 w-3.5" />
          Étiquettes
        </Button>
        <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Exporter
        </Button>
        <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={openCalendarDialog}>
          <CalendarIcon className="h-3.5 w-3.5" />
          Calendrier
        </Button>
        <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={handleSync}>
          <Sparkles className="h-3.5 w-3.5" />
          Synchroniser
        </Button>
      </div>
    </div>
  );
};
