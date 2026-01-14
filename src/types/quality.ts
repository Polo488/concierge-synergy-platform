
// Quality Stats Module Types

export type CleaningTaskStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type QualityTag = 
  | 'dust' 
  | 'bathroom' 
  | 'linen' 
  | 'kitchen' 
  | 'smell' 
  | 'floors' 
  | 'missing_items'
  | 'windows'
  | 'appliances'
  | 'general';

export type RatingSource = 'manager' | 'owner' | 'guest';

export interface CleaningTaskExtended {
  id: string;
  property_id: string;
  property_name: string;
  assigned_agent_id: string;
  assigned_agent_name: string;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  status: CleaningTaskStatus;
  checklist_completion_rate: number; // 0-100
  photos_uploaded_count: number;
  issues_reported_count: number;
  manager_rating?: number; // 1-5
  owner_rating?: number; // 1-5
  guest_rating?: number; // 1-5
  rating_comment?: string;
  rating_source?: RatingSource;
  quality_tags: QualityTag[];
  rework_required: boolean;
  rework_reason?: string;
  rework_followup_task_id?: string;
  late_minutes: number; // computed
  early_finish_minutes: number; // computed
  channel?: string;
}

export interface AgentProfile {
  agent_id: string;
  agent_name: string;
  avatar?: string;
  active_status: boolean;
  average_rating_overall: number;
  average_rating_last_30_days: number;
  tasks_completed_total: number;
  rework_rate: number; // percentage
  on_time_rate: number; // percentage
  photo_compliance_rate: number; // percentage
}

export interface PropertyQualityStats {
  property_id: string;
  property_name: string;
  average_cleaning_rating_overall: number;
  average_cleaning_rating_last_30_days: number;
  rework_rate: number;
  on_time_rate: number;
  issues_per_stay: number;
  total_cleanings: number;
}

export interface QualityKPIs {
  average_rating_overall: number;
  average_rating_last_30_days: number;
  rework_rate: number;
  on_time_rate: number;
  average_cleaning_duration_minutes: number;
  average_variance_minutes: number;
  issues_per_task: number;
  photo_compliance_rate: number;
  tasks_completed: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface IssueFrequency {
  tag: QualityTag;
  count: number;
  percentage: number;
}

export interface QualityFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  properties: string[];
  agents: string[];
  ratingSource: RatingSource | 'all';
  status: CleaningTaskStatus | 'all';
  channel: string | 'all';
  includeReworkFollowups: boolean;
}

export interface CleaningRatingInput {
  task_id: string;
  rating: number;
  comment?: string;
  tags: QualityTag[];
  rework_required: boolean;
  rework_reason?: string;
  source: RatingSource;
}
