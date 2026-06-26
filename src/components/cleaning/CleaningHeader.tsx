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
  Sparkles,
  ClipboardList,
  Users,
  Bell,
  Settings,
  Tag,
  Download,
  HelpCircle,
} from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';
import { useAuth } from '@/contexts/AuthContext';
import { CleaningNotificationsDialog } from './CleaningNotificationsDialog';
import { CleaningAssignmentDialog } from './CleaningAssignmentDialog';
import { CleaningAgenciesDialog } from './CleaningAgenciesDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const CleaningHeader = () => {
  const { openLabelsDialog, handleExport, handleSync, setAddTaskDialogOpen } = useCleaning();
  const { hasPermission } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [agenciesOpen, setAgenciesOpen] = useState(false);
  const canConfigure = hasPermission('cleaningNotifications');

  const today = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });
  const dayLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="w-full box-border px-4 pt-4 pb-2">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[26px] md:text-[30px] font-bold tracking-tight text-foreground leading-none">
                Ménage
              </h1>
              <HelpCircle className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-[12px] text-muted-foreground mt-1.5">{dayLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => setAddTaskDialogOpen(true)}
            className="h-10 rounded-[10px] text-[13px] font-semibold gap-1.5 px-4"
          >
            <Plus className="h-4 w-4" />
            Ajouter un ménage
          </Button>
          <Button
            variant="outline"
            onClick={handleSync}
            className="h-10 rounded-[10px] text-[13px] font-medium gap-1.5 px-3.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Synchroniser</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-[10px]"
                aria-label="Plus d'options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {canConfigure && (
                <>
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Configuration
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setAssignOpen(true)}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Assignation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAgenciesOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Agences
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNotifOpen(true)}>
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Outils
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={openLabelsDialog}>
                <Tag className="h-4 w-4 mr-2" />
                Étiquettes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
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
