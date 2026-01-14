
import { CleaningTask, CleaningStatus, NewCleaningTask, CleaningIssue } from '@/types/cleaning';
import { QualityTag } from '@/types/quality';

export interface CleaningRatingData {
  taskId: number;
  rating: number;
  comment: string;
  tags: QualityTag[];
  reworkRequired: boolean;
  reworkReason: string;
}

export interface CleaningContextType {
  // Task collections
  todayCleaningTasks: CleaningTask[];
  tomorrowCleaningTasks: CleaningTask[];
  completedCleaningTasks: CleaningTask[];
  
  // Issues
  cleaningIssues: CleaningIssue[];
  
  // Dialog states
  currentTask: CleaningTask | null;
  selectedAgent: string;
  problemDescription: string;
  selectedDate: Date;
  activeTab: string;
  selectedTasks: CleaningTask[];
  labelType: "standard" | "detailed" | "qrcode";
  taskComments: string;
  newTask: NewCleaningTask;
  
  // Dialog open/close states
  assignDialogOpen: boolean;
  detailsDialogOpen: boolean;
  problemDialogOpen: boolean;
  calendarDialogOpen: boolean;
  labelsDialogOpen: boolean;
  addTaskDialogOpen: boolean;
  deleteConfirmDialogOpen: boolean;
  editCommentsDialogOpen: boolean;
  ratingDialogOpen: boolean;
  taskToRate: CleaningTask | null;
  issueDialogOpen: boolean;
  issueDialogTask: CleaningTask | null;
  
  // Setters
  setTodayCleaningTasks: (tasks: CleaningTask[]) => void;
  setTomorrowCleaningTasks: (tasks: CleaningTask[]) => void;
  setCompletedCleaningTasks: (tasks: CleaningTask[]) => void;
  setCleaningIssues: (issues: CleaningIssue[]) => void;
  setCurrentTask: (task: CleaningTask | null) => void;
  setSelectedAgent: (agent: string) => void;
  setProblemDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTasks: (tasks: CleaningTask[]) => void;
  setLabelType: (type: "standard" | "detailed" | "qrcode") => void;
  setTaskComments: (comments: string) => void;
  setNewTask: (task: NewCleaningTask) => void;
  
  // Dialog controllers
  setAssignDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  setProblemDialogOpen: (open: boolean) => void;
  setCalendarDialogOpen: (open: boolean) => void;
  setLabelsDialogOpen: (open: boolean) => void;
  setAddTaskDialogOpen: (open: boolean) => void;
  setDeleteConfirmDialogOpen: (open: boolean) => void;
  setEditCommentsDialogOpen: (open: boolean) => void;
  setRatingDialogOpen: (open: boolean) => void;
  setTaskToRate: (task: CleaningTask | null) => void;
  setIssueDialogOpen: (open: boolean) => void;
  setIssueDialogTask: (task: CleaningTask | null) => void;
  
  // Actions
  handleStartCleaning: (task: CleaningTask) => void;
  handleCompleteCleaning: (task: CleaningTask) => void;
  handleAssignAgent: () => void;
  handleReportProblem: () => void;
  handleExport: () => void;
  handleSync: () => void;
  handleDateChange: (date: Date | undefined) => void;
  handlePrintLabels: () => void;
  handleAddTask: () => void;
  handleDeleteTask: () => void;
  handleSaveComments: () => void;
  handleUpdateCheckTimes: (checkoutTime: string, checkinTime: string) => void;
  handleSubmitRating: (ratingData: CleaningRatingData) => void;
  handleCreateIssue: (issue: Omit<CleaningIssue, 'id' | 'createdAt' | 'repasseTaskId'>) => void;
  handleResolveIssue: (issueId: number) => void;
  openIssueDialog: (task?: CleaningTask | null) => void;
  
  // Helpers
  openAssignDialog: (task: CleaningTask) => void;
  openDetailsDialog: (task: CleaningTask) => void;
  openProblemDialog: (task: CleaningTask) => void;
  openCalendarDialog: () => void;
  openLabelsDialog: () => void;
  openDeleteDialog: (task: CleaningTask) => void;
  handleEditComments: () => void;
  handleSelectTask: (task: CleaningTask) => void;
}

export interface CleaningProviderProps {
  children: React.ReactNode;
}
