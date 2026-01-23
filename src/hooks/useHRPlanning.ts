
import { useState, useCallback, useMemo } from 'react';
import { 
  HRTeam, 
  HREmployee, 
  PlanningDay, 
  PlanningStatusCode,
  EmployeeMonthlySummary,
  TeamMonthlySummary,
  BulkEditPayload,
  CellSelection,
  PLANNING_STATUSES,
  WorkPattern,
  DEFAULT_WORK_PATTERNS,
} from '@/types/hrPlanning';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const MOCK_TEAMS: HRTeam[] = [
  { id: 'management', name: 'Management', displayOrder: 1, color: 'hsl(220, 70%, 50%)' },
  { id: 'operations', name: 'Opérations', displayOrder: 2, color: 'hsl(142, 60%, 45%)' },
  { id: 'maintenance', name: 'Maintenance', displayOrder: 3, color: 'hsl(25, 80%, 50%)' },
  { id: 'cleaning', name: 'Ménage', displayOrder: 4, color: 'hsl(280, 60%, 50%)' },
  { id: 'alternants', name: 'Alternants', displayOrder: 5, color: 'hsl(180, 50%, 45%)' },
];

const MOCK_EMPLOYEES: HREmployee[] = [
  // Management
  { id: 'emp1', firstName: 'Marie', lastName: 'Dupont', displayName: 'Marie Dupont', teamId: 'management', role: 'Directrice', contractType: 'CDI', weeklyHoursTarget: 39, active: true },
  { id: 'emp2', firstName: 'Thomas', lastName: 'Martin', displayName: 'Thomas Martin', teamId: 'management', role: 'Responsable RH', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  // Operations
  { id: 'emp3', firstName: 'Sophie', lastName: 'Bernard', displayName: 'Sophie Bernard', teamId: 'operations', role: 'City Manager', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp4', firstName: 'Lucas', lastName: 'Petit', displayName: 'Lucas Petit', teamId: 'operations', role: 'City Manager', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp5', firstName: 'Emma', lastName: 'Leroy', displayName: 'Emma Leroy', teamId: 'operations', role: 'Superviseur', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp6', firstName: 'Hugo', lastName: 'Moreau', displayName: 'Hugo Moreau', teamId: 'operations', role: 'Agent', contractType: 'CDD', weeklyHoursTarget: 35, active: true },
  // Maintenance
  { id: 'emp7', firstName: 'Paul', lastName: 'Garcia', displayName: 'Paul Garcia', teamId: 'maintenance', role: 'Technicien senior', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp8', firstName: 'Julie', lastName: 'Roux', displayName: 'Julie Roux', teamId: 'maintenance', role: 'Technicien', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp9', firstName: 'Antoine', lastName: 'Fournier', displayName: 'Antoine Fournier', teamId: 'maintenance', role: 'Technicien', contractType: 'CDD', weeklyHoursTarget: 35, active: true },
  // Cleaning
  { id: 'emp10', firstName: 'Camille', lastName: 'Vincent', displayName: 'Camille Vincent', teamId: 'cleaning', role: 'Chef d\'équipe', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp11', firstName: 'Léa', lastName: 'Mercier', displayName: 'Léa Mercier', teamId: 'cleaning', role: 'Agent', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  { id: 'emp12', firstName: 'Nathan', lastName: 'Blanc', displayName: 'Nathan Blanc', teamId: 'cleaning', role: 'Agent', contractType: 'CDD', weeklyHoursTarget: 25, active: true },
  { id: 'emp13', firstName: 'Chloé', lastName: 'Guérin', displayName: 'Chloé Guérin', teamId: 'cleaning', role: 'Agent', contractType: 'CDI', weeklyHoursTarget: 35, active: true },
  // Alternants
  { id: 'emp14', firstName: 'Maxime', lastName: 'Robin', displayName: 'Maxime Robin', teamId: 'alternants', role: 'Alternant opérations', contractType: 'Alternant', weeklyHoursTarget: 35, active: true },
  { id: 'emp15', firstName: 'Inès', lastName: 'Faure', displayName: 'Inès Faure', teamId: 'alternants', role: 'Alternant marketing', contractType: 'Alternant', weeklyHoursTarget: 35, active: true },
];

// Generate mock planning data
const generateMockPlanningData = (employees: HREmployee[], month: Date): PlanningDay[] => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const planningData: PlanningDay[] = [];

  employees.forEach(employee => {
    days.forEach(day => {
      const dayOfWeek = getDay(day); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let status: PlanningStatusCode = 'P';
      let overtimeMinutes: number | undefined;
      
      if (isWeekend) {
        status = 'R';
      } else {
        // Add some variation
        const random = Math.random();
        if (random < 0.02) status = 'S'; // 2% sick
        else if (random < 0.07) status = 'C'; // 5% leave
        else if (random < 0.10) status = 'TR'; // 3% training
        else if (random < 0.15) status = 'TT'; // 5% remote
        else {
          status = 'P';
          // Random overtime
          if (Math.random() < 0.2) {
            overtimeMinutes = Math.floor(Math.random() * 4) * 30 + 30; // 30, 60, 90, or 120 min
          }
        }
      }

      planningData.push({
        id: `${employee.id}-${format(day, 'yyyy-MM-dd')}`,
        employeeId: employee.id,
        date: format(day, 'yyyy-MM-dd'),
        status,
        overtimeMinutes,
      });
    });
  });

  return planningData;
};

export function useHRPlanning() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [teams] = useState<HRTeam[]>(MOCK_TEAMS);
  const [employees] = useState<HREmployee[]>(MOCK_EMPLOYEES);
  const [planningData, setPlanningData] = useState<PlanningDay[]>(() => 
    generateMockPlanningData(MOCK_EMPLOYEES, new Date())
  );
  const [selectedCells, setSelectedCells] = useState<CellSelection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [collapsedTeams, setCollapsedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Get days of the current month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (!emp.active) return false;
      if (selectedTeamIds.length > 0 && !selectedTeamIds.includes(emp.teamId)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return emp.displayName.toLowerCase().includes(query) ||
               emp.role?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [employees, selectedTeamIds, searchQuery]);

  // Group employees by team
  const employeesByTeam = useMemo(() => {
    const grouped: Record<string, HREmployee[]> = {};
    teams.forEach(team => {
      grouped[team.id] = filteredEmployees.filter(emp => emp.teamId === team.id);
    });
    return grouped;
  }, [teams, filteredEmployees]);

  // Get planning for a specific cell
  const getPlanningDay = useCallback((employeeId: string, date: string): PlanningDay | undefined => {
    return planningData.find(p => p.employeeId === employeeId && p.date === date);
  }, [planningData]);

  // Update a planning day
  const updatePlanningDay = useCallback((
    employeeId: string,
    date: string,
    updates: Partial<PlanningDay>
  ) => {
    setPlanningData(prev => {
      const existing = prev.find(p => p.employeeId === employeeId && p.date === date);
      if (existing) {
        return prev.map(p => 
          p.employeeId === employeeId && p.date === date
            ? { ...p, ...updates, updatedAt: new Date() }
            : p
        );
      } else {
        return [...prev, {
          id: `${employeeId}-${date}`,
          employeeId,
          date,
          status: updates.status || 'UNK',
          ...updates,
          createdAt: new Date(),
        } as PlanningDay];
      }
    });
    toast({
      title: 'Planning mis à jour',
      description: 'Les modifications ont été enregistrées',
    });
  }, [toast]);

  // Bulk update
  const bulkUpdatePlanningDays = useCallback((payload: BulkEditPayload) => {
    setPlanningData(prev => {
      const updated = [...prev];
      payload.dates.forEach(date => {
        const existingIndex = updated.findIndex(
          p => p.employeeId === payload.employeeId && p.date === date
        );
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: payload.status,
            overtimeMinutes: payload.overtimeMinutes,
            note: payload.note,
            updatedAt: new Date(),
          };
        } else {
          updated.push({
            id: `${payload.employeeId}-${date}`,
            employeeId: payload.employeeId,
            date,
            status: payload.status,
            overtimeMinutes: payload.overtimeMinutes,
            note: payload.note,
            createdAt: new Date(),
          });
        }
      });
      return updated;
    });
    toast({
      title: 'Mise à jour groupée',
      description: `${payload.dates.length} jour(s) mis à jour`,
    });
    setSelectedCells([]);
  }, [toast]);

  // Apply pattern to employee for the month
  const applyPattern = useCallback((
    employeeIds: string[],
    pattern: WorkPattern
  ) => {
    setPlanningData(prev => {
      const updated = [...prev];
      employeeIds.forEach(employeeId => {
        monthDays.forEach(day => {
          const dayOfWeek = getDay(day); // 0 = Sunday
          const patternIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon = 0
          const status = pattern.pattern[patternIndex];
          const date = format(day, 'yyyy-MM-dd');
          
          const existingIndex = updated.findIndex(
            p => p.employeeId === employeeId && p.date === date
          );
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              status,
              updatedAt: new Date(),
            };
          } else {
            updated.push({
              id: `${employeeId}-${date}`,
              employeeId,
              date,
              status,
              createdAt: new Date(),
            });
          }
        });
      });
      return updated;
    });
    toast({
      title: 'Modèle appliqué',
      description: `${pattern.name} appliqué à ${employeeIds.length} employé(s)`,
    });
  }, [monthDays, toast]);

  // Duplicate from previous month
  const duplicateFromPreviousMonth = useCallback((employeeIds: string[]) => {
    const prevMonth = subMonths(currentMonth, 1);
    const prevStart = startOfMonth(prevMonth);
    const prevEnd = endOfMonth(prevMonth);
    const prevDays = eachDayOfInterval({ start: prevStart, end: prevEnd });
    
    setPlanningData(prev => {
      const updated = [...prev];
      employeeIds.forEach(employeeId => {
        monthDays.forEach((day, index) => {
          if (index < prevDays.length) {
            const prevDate = format(prevDays[index], 'yyyy-MM-dd');
            const prevData = prev.find(p => p.employeeId === employeeId && p.date === prevDate);
            
            if (prevData) {
              const date = format(day, 'yyyy-MM-dd');
              const existingIndex = updated.findIndex(
                p => p.employeeId === employeeId && p.date === date
              );
              
              if (existingIndex >= 0) {
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  status: prevData.status,
                  overtimeMinutes: prevData.overtimeMinutes,
                  note: prevData.note,
                  updatedAt: new Date(),
                };
              } else {
                updated.push({
                  id: `${employeeId}-${date}`,
                  employeeId,
                  date,
                  status: prevData.status,
                  overtimeMinutes: prevData.overtimeMinutes,
                  note: prevData.note,
                  createdAt: new Date(),
                });
              }
            }
          }
        });
      });
      return updated;
    });
    toast({
      title: 'Données dupliquées',
      description: `Planning du mois précédent copié pour ${employeeIds.length} employé(s)`,
    });
  }, [currentMonth, monthDays, toast]);

  // Calculate employee summary
  const getEmployeeSummary = useCallback((employeeId: string): EmployeeMonthlySummary => {
    const employeeData = planningData.filter(
      p => p.employeeId === employeeId && 
           monthDays.some(d => format(d, 'yyyy-MM-dd') === p.date)
    );
    
    return {
      employeeId,
      presentDays: employeeData.filter(p => p.status === 'P').length,
      restDays: employeeData.filter(p => p.status === 'R').length,
      paidLeaveDays: employeeData.filter(p => p.status === 'C').length,
      sickDays: employeeData.filter(p => p.status === 'S').length,
      trainingDays: employeeData.filter(p => p.status === 'TR').length,
      remoteDays: employeeData.filter(p => p.status === 'TT').length,
      unknownDays: employeeData.filter(p => p.status === 'UNK').length,
      totalOvertimeMinutes: employeeData.reduce((sum, p) => sum + (p.overtimeMinutes || 0), 0),
    };
  }, [planningData, monthDays]);

  // Calculate team summary
  const getTeamSummary = useCallback((teamId: string): TeamMonthlySummary => {
    const team = teams.find(t => t.id === teamId);
    const teamEmployees = employees.filter(e => e.teamId === teamId && e.active);
    
    let totalOvertime = 0;
    let totalPresence = 0;
    let workingDaysCount = 0;
    
    teamEmployees.forEach(emp => {
      const summary = getEmployeeSummary(emp.id);
      totalOvertime += summary.totalOvertimeMinutes;
      totalPresence += summary.presentDays + summary.trainingDays + summary.remoteDays;
      workingDaysCount += monthDays.filter(d => getDay(d) !== 0 && getDay(d) !== 6).length;
    });

    return {
      teamId,
      teamName: team?.name || '',
      employeeCount: teamEmployees.length,
      totalOvertimeMinutes: totalOvertime,
      averagePresence: workingDaysCount > 0 ? (totalPresence / workingDaysCount) * 100 : 0,
    };
  }, [teams, employees, getEmployeeSummary, monthDays]);

  // Global summary
  const globalSummary = useMemo(() => {
    let totalOvertime = 0;
    let totalEmployees = 0;
    
    filteredEmployees.forEach(emp => {
      const summary = getEmployeeSummary(emp.id);
      totalOvertime += summary.totalOvertimeMinutes;
      totalEmployees++;
    });

    return {
      totalEmployees,
      totalOvertimeMinutes: totalOvertime,
      totalOvertimeHours: Math.floor(totalOvertime / 60),
      remainingMinutes: totalOvertime % 60,
    };
  }, [filteredEmployees, getEmployeeSummary]);

  // Navigation
  const goToPreviousMonth = useCallback(() => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setPlanningData(generateMockPlanningData(MOCK_EMPLOYEES, newMonth));
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setPlanningData(generateMockPlanningData(MOCK_EMPLOYEES, newMonth));
  }, [currentMonth]);

  const goToMonth = useCallback((date: Date) => {
    setCurrentMonth(date);
    setPlanningData(generateMockPlanningData(MOCK_EMPLOYEES, date));
  }, []);

  // Selection handlers
  const toggleCellSelection = useCallback((employeeId: string, date: string) => {
    setSelectedCells(prev => {
      const exists = prev.some(c => c.employeeId === employeeId && c.date === date);
      if (exists) {
        return prev.filter(c => !(c.employeeId === employeeId && c.date === date));
      }
      return [...prev, { employeeId, date }];
    });
  }, []);

  const selectRange = useCallback((employeeId: string, startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const dates = eachDayOfInterval({ 
      start: start <= end ? start : end, 
      end: start <= end ? end : start 
    });
    
    setSelectedCells(
      dates.map(d => ({ employeeId, date: format(d, 'yyyy-MM-dd') }))
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCells([]);
  }, []);

  // Team collapse
  const toggleTeamCollapse = useCallback((teamId: string) => {
    setCollapsedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  }, []);

  return {
    // State
    currentMonth,
    teams,
    employees: filteredEmployees,
    employeesByTeam,
    monthDays,
    planningData,
    selectedCells,
    isSelecting,
    collapsedTeams,
    searchQuery,
    selectedTeamIds,
    globalSummary,
    workPatterns: DEFAULT_WORK_PATTERNS,
    
    // Setters
    setSearchQuery,
    setSelectedTeamIds,
    setIsSelecting,
    
    // Actions
    getPlanningDay,
    updatePlanningDay,
    bulkUpdatePlanningDays,
    applyPattern,
    duplicateFromPreviousMonth,
    getEmployeeSummary,
    getTeamSummary,
    
    // Navigation
    goToPreviousMonth,
    goToNextMonth,
    goToMonth,
    
    // Selection
    toggleCellSelection,
    selectRange,
    clearSelection,
    
    // Teams
    toggleTeamCollapse,
  };
}
