
import { useState } from 'react';
import { useHRPlanning } from '@/hooks/useHRPlanning';
import { PlanningHeader } from '@/components/hr-planning/PlanningHeader';
import { PlanningGrid } from '@/components/hr-planning/PlanningGrid';
import { PlanningRecapPanel } from '@/components/hr-planning/PlanningRecapPanel';
import { OvertimeSummaryCards } from '@/components/hr-planning/OvertimeSummaryCards';
import { BulkEditPanel } from '@/components/hr-planning/BulkEditPanel';
import { ApplyPatternDialog } from '@/components/hr-planning/ApplyPatternDialog';
import { cn } from '@/lib/utils';

const HRPlanning = () => {
  const hrPlanning = useHRPlanning();
  const [showRecap, setShowRecap] = useState(true);
  const [patternDialogOpen, setPatternDialogOpen] = useState(false);

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
