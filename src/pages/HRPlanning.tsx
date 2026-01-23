
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useHRPlanning } from '@/hooks/useHRPlanning';
import { PlanningHeader } from '@/components/hr-planning/PlanningHeader';
import { PlanningGrid } from '@/components/hr-planning/PlanningGrid';
import { PlanningRecapPanel } from '@/components/hr-planning/PlanningRecapPanel';
import { OvertimeSummaryCards } from '@/components/hr-planning/OvertimeSummaryCards';
import { BulkEditPanel } from '@/components/hr-planning/BulkEditPanel';
import { ApplyPatternDialog } from '@/components/hr-planning/ApplyPatternDialog';
import { downloadPlanningPDF, getPlanningPDFBlob } from '@/components/hr-planning/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const HRPlanning = () => {
  const hrPlanning = useHRPlanning();
  const [showRecap, setShowRecap] = useState(true);
  const [patternDialogOpen, setPatternDialogOpen] = useState(false);
  const { toast } = useToast();

  // Export handlers
  const handleExportPDF = useCallback(() => {
    downloadPlanningPDF({
      currentMonth: hrPlanning.currentMonth,
      teams: hrPlanning.teams,
      employeesByTeam: hrPlanning.employeesByTeam,
      monthDays: hrPlanning.monthDays,
      getPlanningDay: hrPlanning.getPlanningDay,
      getEmployeeSummary: hrPlanning.getEmployeeSummary,
    });
    toast({
      title: 'PDF exporté',
      description: 'Le planning a été téléchargé au format PDF',
    });
  }, [hrPlanning, toast]);

  const handleExportCSV = useCallback(() => {
    const { teams, employeesByTeam, monthDays, getPlanningDay, getEmployeeSummary, currentMonth } = hrPlanning;
    
    // Build CSV headers
    const dateHeaders = monthDays.map(d => format(d, 'dd/MM'));
    const headers = ['Équipe', 'Employé', ...dateHeaders, 'P', 'R', 'C', 'S', 'TR', 'H+ (min)'];
    
    // Build rows
    const rows: string[][] = [];
    teams.forEach(team => {
      const teamEmployees = employeesByTeam[team.id] || [];
      teamEmployees.forEach(emp => {
        const summary = getEmployeeSummary(emp.id);
        const row = [
          team.name,
          emp.displayName,
          ...monthDays.map(day => {
            const planning = getPlanningDay(emp.id, format(day, 'yyyy-MM-dd'));
            return planning?.status || '';
          }),
          summary.presentDays.toString(),
          summary.restDays.toString(),
          summary.paidLeaveDays.toString(),
          summary.sickDays.toString(),
          summary.trainingDays.toString(),
          summary.totalOvertimeMinutes.toString(),
        ];
        rows.push(row);
      });
    });
    
    // Generate CSV
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planning-rh-${format(currentMonth, 'yyyy-MM')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'CSV exporté',
      description: 'Le planning a été téléchargé au format CSV',
    });
  }, [hrPlanning, toast]);

  const handlePrint = useCallback(() => {
    const blob = getPlanningPDFBlob({
      currentMonth: hrPlanning.currentMonth,
      teams: hrPlanning.teams,
      employeesByTeam: hrPlanning.employeesByTeam,
      monthDays: hrPlanning.monthDays,
      getPlanningDay: hrPlanning.getPlanningDay,
      getEmployeeSummary: hrPlanning.getEmployeeSummary,
    });
    
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }, [hrPlanning]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <PlanningHeader 
        currentMonth={hrPlanning.currentMonth}
        onPreviousMonth={hrPlanning.goToPreviousMonth}
        onNextMonth={hrPlanning.goToNextMonth}
        onGoToMonth={hrPlanning.goToMonth}
        searchQuery={hrPlanning.searchQuery}
        onSearchChange={hrPlanning.setSearchQuery}
        teams={hrPlanning.teams}
        selectedTeamIds={hrPlanning.selectedTeamIds}
        onTeamFilterChange={hrPlanning.setSelectedTeamIds}
        onApplyPattern={() => setPatternDialogOpen(true)}
        onToggleRecap={() => setShowRecap(!showRecap)}
        showRecap={showRecap}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Overtime Summary Cards */}
      <OvertimeSummaryCards 
        globalSummary={hrPlanning.globalSummary}
        teams={hrPlanning.teams}
        getTeamSummary={hrPlanning.getTeamSummary}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Planning Grid */}
        <div className={cn(
          "flex-1 overflow-hidden transition-all duration-300",
          showRecap ? "mr-0" : ""
        )}>
          <PlanningGrid 
            teams={hrPlanning.teams}
            employeesByTeam={hrPlanning.employeesByTeam}
            monthDays={hrPlanning.monthDays}
            getPlanningDay={hrPlanning.getPlanningDay}
            updatePlanningDay={hrPlanning.updatePlanningDay}
            selectedCells={hrPlanning.selectedCells}
            toggleCellSelection={hrPlanning.toggleCellSelection}
            selectRange={hrPlanning.selectRange}
            collapsedTeams={hrPlanning.collapsedTeams}
            toggleTeamCollapse={hrPlanning.toggleTeamCollapse}
            getEmployeeSummary={hrPlanning.getEmployeeSummary}
          />
        </div>

        {/* Recap Panel */}
        {showRecap && (
          <PlanningRecapPanel 
            employees={hrPlanning.employees}
            getEmployeeSummary={hrPlanning.getEmployeeSummary}
            onClose={() => setShowRecap(false)}
          />
        )}
      </div>

      {/* Bulk Edit Panel (appears when cells are selected) */}
      {hrPlanning.selectedCells.length > 0 && (
        <BulkEditPanel 
          selectedCells={hrPlanning.selectedCells}
          onBulkUpdate={hrPlanning.bulkUpdatePlanningDays}
          onClearSelection={hrPlanning.clearSelection}
        />
      )}

      {/* Apply Pattern Dialog */}
      <ApplyPatternDialog 
        open={patternDialogOpen}
        onOpenChange={setPatternDialogOpen}
        employees={hrPlanning.employees}
        patterns={hrPlanning.workPatterns}
        onApplyPattern={hrPlanning.applyPattern}
        onDuplicateFromPreviousMonth={hrPlanning.duplicateFromPreviousMonth}
      />
    </div>
  );
};

export default HRPlanning;
