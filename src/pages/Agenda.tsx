import { useState, useEffect } from 'react';
import { 
  addDays, 
  addWeeks, 
  addMonths, 
  subDays, 
  subWeeks, 
  subMonths,
  format 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  CalendarDays, 
  CalendarRange, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useAgenda } from '@/hooks/useAgenda';
import { AgendaViewMode, AgendaEntry } from '@/types/agenda';
import { AgendaDayView } from '@/components/agenda/AgendaDayView';
import { AgendaWeekView } from '@/components/agenda/AgendaWeekView';
import { AgendaMonthView } from '@/components/agenda/AgendaMonthView';
import { AgendaListView } from '@/components/agenda/AgendaListView';
import { AgendaFilters } from '@/components/agenda/AgendaFilters';
import { AgendaEntryDialog } from '@/components/agenda/AgendaEntryDialog';

const Agenda = () => {
  const [viewMode, setViewMode] = useState<AgendaViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AgendaEntry | null>(null);
  const [dialogDefaultDate, setDialogDefaultDate] = useState<Date | undefined>();

  const {
    entries,
    filters,
    setFilters,
    allTags,
    properties,
    getEntriesForDate,
    getEntriesForDateRange,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useAgenda();

  useEffect(() => {
    document.title = 'Agenda - GESTION BNB LYON';
  }, []);

  const handlePrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEntryClick = (entry: AgendaEntry) => {
    setSelectedEntry(entry);
    setDialogDefaultDate(undefined);
    setDialogOpen(true);
  };

  const handleAddClick = (date?: Date) => {
    setSelectedEntry(null);
    setDialogDefaultDate(date || currentDate);
    setDialogOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const handleSave = (entryData: Omit<AgendaEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      updateEntry(selectedEntry.id, entryData);
    } else {
      addEntry(entryData);
    }
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
  };

  // Get entries based on current view
  const getViewEntries = () => {
    if (viewMode === 'list') {
      return entries; // Uses filtered entries
    }
    if (viewMode === 'day') {
      return getEntriesForDate(currentDate);
    }
    // Week and month views use the entries from the hook which are already filtered
    return entries;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header — Apple style: title block + primary CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Notes internes, rappels et coordination d'équipe
          </p>
        </div>
        <Button onClick={() => handleAddClick()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle note
        </Button>
      </div>

      {/* Filters */}
      <AgendaFilters
        filters={filters}
        onFiltersChange={setFilters}
        properties={properties}
        allTags={allTags}
      />

      {/* View Controls — toolbar compacte, jamais en overflow */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Navigation — pleine largeur en mobile pour aérer */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={handlePrevious} className="shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday} className="flex-1 sm:flex-none">
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* View mode tabs — segmented control plein largeur en mobile (iOS) */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as AgendaViewMode)} className="w-full sm:w-auto">
            <TabsList className="inline-flex  w-full sm:w-auto sm:inline-flex">
              <TabsTrigger value="day" className="gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Jour</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="gap-1.5">
                <CalendarRange className="h-4 w-4" />
                <span className="hidden sm:inline">Semaine</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Mois</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1.5">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Liste</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* View Content */}
      <div className="min-h-[500px]">
        {viewMode === 'day' && (
          <AgendaDayView
            date={currentDate}
            entries={getEntriesForDate(currentDate)}
            properties={properties}
            onEntryClick={handleEntryClick}
            onAddClick={() => handleAddClick(currentDate)}
          />
        )}
        {viewMode === 'week' && (
          <AgendaWeekView
            date={currentDate}
            entries={entries}
            properties={properties}
            onEntryClick={handleEntryClick}
            onAddClick={handleAddClick}
            onDayClick={handleDayClick}
          />
        )}
        {viewMode === 'month' && (
          <AgendaMonthView
            date={currentDate}
            entries={entries}
            properties={properties}
            onEntryClick={handleEntryClick}
            onAddClick={handleAddClick}
            onDayClick={handleDayClick}
          />
        )}
        {viewMode === 'list' && (
          <AgendaListView
            entries={entries}
            properties={properties}
            onEntryClick={handleEntryClick}
            onAddClick={() => handleAddClick()}
          />
        )}
      </div>

      {/* Entry Dialog */}
      <AgendaEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={selectedEntry}
        properties={properties}
        onSave={handleSave}
        onDelete={handleDelete}
        defaultDate={dialogDefaultDate}
      />
    </div>
  );
};

export default Agenda;
