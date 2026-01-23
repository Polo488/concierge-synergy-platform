
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Search, Filter, Calendar, Download, Printer, Copy, PanelRightClose, PanelRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HRTeam, HREmployee, PlanningDay, EmployeeMonthlySummary } from '@/types/hrPlanning';
import { cn } from '@/lib/utils';

interface PlanningHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToMonth: (date: Date) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  teams: HRTeam[];
  selectedTeamIds: string[];
  onTeamFilterChange: (teamIds: string[]) => void;
  onApplyPattern: () => void;
  onToggleRecap: () => void;
  showRecap: boolean;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
}

export function PlanningHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onGoToMonth,
  searchQuery,
  onSearchChange,
  teams,
  selectedTeamIds,
  onTeamFilterChange,
  onApplyPattern,
  onToggleRecap,
  showRecap,
  onExportPDF,
  onExportCSV,
  onPrint,
}: PlanningHeaderProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), i, 1);
    return { value: i.toString(), label: format(date, 'MMMM', { locale: fr }) };
  });

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth.getFullYear(), parseInt(month), 1);
    onGoToMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1);
    onGoToMonth(newDate);
  };

  const toggleTeam = (teamId: string) => {
    if (selectedTeamIds.includes(teamId)) {
      onTeamFilterChange(selectedTeamIds.filter(id => id !== teamId));
    } else {
      onTeamFilterChange([...selectedTeamIds, teamId]);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-card/50">
      <div className="flex items-center justify-between">
        {/* Month navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreviousMonth}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Select
              value={currentMonth.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-32 h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={currentMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-24 h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onGoToMonth(new Date())}
            className="ml-2 h-9"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Aujourd'hui
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onApplyPattern}
            className="h-9"
          >
            <Copy className="h-4 w-4 mr-2" />
            Appliquer un modèle
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border shadow-lg z-50">
              <DropdownMenuItem onClick={onExportPDF} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportCSV} className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onPrint} className="cursor-pointer">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRecap}
            className="h-9 w-9"
          >
            {showRecap ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un employé..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-background"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Équipes
              {selectedTeamIds.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium">
                  {selectedTeamIds.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover border shadow-lg z-50">
            {teams.map(team => (
              <DropdownMenuCheckboxItem
                key={team.id}
                checked={selectedTeamIds.includes(team.id)}
                onCheckedChange={() => toggleTeam(team.id)}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: team.color }}
                />
                {team.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedTeamIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTeamFilterChange([])}
            className="h-9 text-muted-foreground"
          >
            Réinitialiser
          </Button>
        )}

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground">
          Dernière mise à jour : {format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
        </span>
      </div>
    </div>
  );
}
