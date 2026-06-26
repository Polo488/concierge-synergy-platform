import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Users,
  Bell,
  Settings,
  Tag,
  Download,
  HelpCircle,
} from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCleaningTeam } from '@/contexts/CleaningTeamContext';
import { CleaningNotificationsDialog } from './CleaningNotificationsDialog';
import { CleaningAssignmentDialog } from './CleaningAssignmentDialog';
import { CleaningAgenciesDialog } from './CleaningAgenciesDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CleaningHeader = () => {
  const { openLabelsDialog, handleExport, handleSync, setAddTaskDialogOpen } = useCleaning();
  const { hasPermission } = useAuth();
  const { autoAssign } = useCleaningTeam();
  const [notifOpen, setNotifOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [agenciesOpen, setAgenciesOpen] = useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const canConfigure = hasPermission('cleaningNotifications');

  const now = new Date();
  const dayLabel = format(now, "EEEE d MMMM", { locale: fr });
  const timeLabel = format(now, 'HH:mm');
  const fullLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1) + ' · ' + timeLabel;

  return (
    <div className="w-full box-border px-4 pt-5 pb-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight text-foreground leading-none">
              Aujourd'hui
            </h1>
            <HelpCircle className="h-4 w-4 text-muted-foreground/50" />
          </div>
          <p className="text-[12px] text-muted-foreground mt-1.5">{fullLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="hidden sm:inline-flex items-center gap-1.5 h-9 rounded-full bg-card border border-border px-3 text-[12px] font-medium text-foreground"
            title={autoAssign ? 'Les nouveaux ménages sont assignés automatiquement' : 'Auto-assignation désactivée'}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${autoAssign ? 'bg-[hsl(142,71%,45%)]' : 'bg-muted-foreground'}`}
            />
            Auto-assignation {autoAssign ? 'active' : 'off'}
          </div>

          {canConfigure && (
            <DropdownMenu open={teamMenuOpen} onOpenChange={setTeamMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 rounded-[10px] text-[13px] font-medium gap-1.5 px-3.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  Équipe & assignation
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setAgenciesOpen(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Agences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAssignOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Règles d'assignation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNotifOpen(true)}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            className="h-9 w-9 rounded-[10px] text-muted-foreground"
            aria-label="Synchroniser"
            title="Synchroniser"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[10px] text-muted-foreground" aria-label="Plus">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Outils
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setAddTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un ménage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openLabelsDialog}>
                <Tag className="h-4 w-4 mr-2" />
                Étiquettes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CleaningNotificationsDialog open={notifOpen} onOpenChange={setNotifOpen} />
      <CleaningAssignmentDialog open={assignOpen} onOpenChange={setAssignOpen} />
      <CleaningAgenciesDialog open={agenciesOpen} onOpenChange={setAgenciesOpen} />
    </div>
  );
};
