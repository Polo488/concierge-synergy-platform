
import { useState, useMemo, useCallback } from 'react';
import { 
  CleaningTaskExtended, 
  AgentProfile, 
  PropertyQualityStats, 
  QualityKPIs, 
  QualityFilters,
  RatingDistribution,
  TrendDataPoint,
  IssueFrequency,
  QualityTag,
} from '@/types/quality';
import { subDays, isWithinInterval, parseISO, format } from 'date-fns';

// Mock data generator
const generateMockTasks = (): CleaningTaskExtended[] => {
  const properties = [
    { id: 'prop-1', name: 'Appartement Bellecour' },
    { id: 'prop-2', name: 'Studio Part-Dieu' },
    { id: 'prop-3', name: 'Loft Confluence' },
    { id: 'prop-4', name: 'T2 Croix-Rousse' },
    { id: 'prop-5', name: 'Duplex Vieux Lyon' },
  ];
  
  const agents = [
    { id: 'agent-1', name: 'Marie Dupont' },
    { id: 'agent-2', name: 'Jean Martin' },
    { id: 'agent-3', name: 'Sophie Bernard' },
    { id: 'agent-4', name: 'Pierre Dubois' },
  ];
  
  const qualityTags: QualityTag[] = ['dust', 'bathroom', 'linen', 'kitchen', 'smell', 'floors', 'missing_items', 'windows'];
  const channels = ['Airbnb', 'Booking.com', 'Direct', 'VRBO'];
  
  const tasks: CleaningTaskExtended[] = [];
  
  for (let i = 0; i < 150; i++) {
    const property = properties[Math.floor(Math.random() * properties.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const date = subDays(new Date(), daysAgo);
    
    const scheduledStart = 9 + Math.floor(Math.random() * 4);
    const scheduledEnd = scheduledStart + 2 + Math.floor(Math.random() * 2);
    const actualVariance = Math.floor(Math.random() * 60) - 20;
    
    const rating = Math.random() > 0.1 ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1;
    const repasseRequired = rating <= 2 && Math.random() > 0.5;
    
    const taskTags: QualityTag[] = rating <= 3 
      ? qualityTags.filter(() => Math.random() > 0.7).slice(0, 3)
      : [];
    
    tasks.push({
      id: `task-${i + 1}`,
      property_id: property.id,
      property_name: property.name,
      assigned_agent_id: agent.id,
      assigned_agent_name: agent.name,
      scheduled_date: format(date, 'yyyy-MM-dd'),
      scheduled_start_time: `${scheduledStart.toString().padStart(2, '0')}:00`,
      scheduled_end_time: `${scheduledEnd.toString().padStart(2, '0')}:00`,
      actual_start_time: `${(scheduledStart + Math.floor(actualVariance / 60)).toString().padStart(2, '0')}:${Math.abs(actualVariance % 60).toString().padStart(2, '0')}`,
      actual_end_time: `${(scheduledEnd + Math.floor(actualVariance / 60)).toString().padStart(2, '0')}:${Math.abs(actualVariance % 60).toString().padStart(2, '0')}`,
      status: 'completed',
      checklist_completion_rate: 70 + Math.floor(Math.random() * 30),
      photos_uploaded_count: Math.floor(Math.random() * 10),
      issues_reported_count: Math.floor(Math.random() * 3),
      manager_rating: rating,
      rating_comment: rating <= 3 ? 'Quelques points à améliorer' : undefined,
      rating_source: 'manager',
      quality_tags: taskTags,
      rework_required: repasseRequired,
      rework_reason: repasseRequired ? 'Nettoyage insuffisant' : undefined,
      late_minutes: Math.max(0, actualVariance),
      early_finish_minutes: Math.max(0, -actualVariance),
      channel: channels[Math.floor(Math.random() * channels.length)],
    });
  }
  
  return tasks;
};

const generateAgentProfiles = (tasks: CleaningTaskExtended[]): AgentProfile[] => {
  const agentMap = new Map<string, { tasks: CleaningTaskExtended[], name: string }>();
  
  tasks.forEach(task => {
    if (!agentMap.has(task.assigned_agent_id)) {
      agentMap.set(task.assigned_agent_id, { tasks: [], name: task.assigned_agent_name });
    }
    agentMap.get(task.assigned_agent_id)!.tasks.push(task);
  });
  
  const profiles: AgentProfile[] = [];
  const thirtyDaysAgo = subDays(new Date(), 30);
  
  agentMap.forEach((data, agentId) => {
    const allRatings = data.tasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    const recentTasks = data.tasks.filter(t => parseISO(t.scheduled_date) >= thirtyDaysAgo);
    const recentRatings = recentTasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    
    const repasseCount = data.tasks.filter(t => t.rework_required).length;
    
    profiles.push({
      agent_id: agentId,
      agent_name: data.name,
      active_status: true,
      average_rating_overall: allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0,
      average_rating_last_30_days: recentRatings.length > 0 ? recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length : 0,
      tasks_completed_total: data.tasks.length,
      repasse_rate: data.tasks.length > 0 ? (repasseCount / data.tasks.length) * 100 : 0,
    });
  });
  
  return profiles;
};

const generatePropertyStats = (tasks: CleaningTaskExtended[]): PropertyQualityStats[] => {
  const propertyMap = new Map<string, { tasks: CleaningTaskExtended[], name: string }>();
  
  tasks.forEach(task => {
    if (!propertyMap.has(task.property_id)) {
      propertyMap.set(task.property_id, { tasks: [], name: task.property_name });
    }
    propertyMap.get(task.property_id)!.tasks.push(task);
  });
  
  const stats: PropertyQualityStats[] = [];
  const thirtyDaysAgo = subDays(new Date(), 30);
  
  propertyMap.forEach((data, propertyId) => {
    const allRatings = data.tasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    const recentTasks = data.tasks.filter(t => parseISO(t.scheduled_date) >= thirtyDaysAgo);
    const recentRatings = recentTasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    
    const repasseCount = data.tasks.filter(t => t.rework_required).length;
    const totalIssues = data.tasks.reduce((sum, t) => sum + t.issues_reported_count, 0);
    
    stats.push({
      property_id: propertyId,
      property_name: data.name,
      average_cleaning_rating_overall: allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0,
      average_cleaning_rating_last_30_days: recentRatings.length > 0 ? recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length : 0,
      repasse_rate: data.tasks.length > 0 ? (repasseCount / data.tasks.length) * 100 : 0,
      issues_per_stay: data.tasks.length > 0 ? totalIssues / data.tasks.length : 0,
      total_cleanings: data.tasks.length,
    });
  });
  
  return stats;
};

export function useQualityStats() {
  const [tasks] = useState<CleaningTaskExtended[]>(() => generateMockTasks());
  const [filters, setFilters] = useState<QualityFilters>({
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    properties: [],
    agents: [],
    ratingSource: 'all',
    status: 'completed',
    channel: 'all',
    includeRepasseFollowups: true,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.scheduled_date);
      
      // Date range filter
      if (!isWithinInterval(taskDate, { start: filters.dateRange.start, end: filters.dateRange.end })) {
        return false;
      }
      
      // Property filter
      if (filters.properties.length > 0 && !filters.properties.includes(task.property_id)) {
        return false;
      }
      
      // Agent filter
      if (filters.agents.length > 0 && !filters.agents.includes(task.assigned_agent_id)) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      
      // Channel filter
      if (filters.channel !== 'all' && task.channel !== filters.channel) {
        return false;
      }
      
      // Repasse followups filter
      if (!filters.includeRepasseFollowups && task.rework_followup_task_id) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filters]);

  const agentProfiles = useMemo(() => generateAgentProfiles(filteredTasks), [filteredTasks]);
  const propertyStats = useMemo(() => generatePropertyStats(filteredTasks), [filteredTasks]);

  const kpis = useMemo((): QualityKPIs => {
    const ratedTasks = filteredTasks.filter(t => t.manager_rating);
    const allRatings = ratedTasks.map(t => t.manager_rating!);
    
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentTasks = filteredTasks.filter(t => parseISO(t.scheduled_date) >= thirtyDaysAgo);
    const recentRatings = recentTasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    
    const repasseCount = filteredTasks.filter(t => t.rework_required).length;
    const totalIssues = filteredTasks.reduce((sum, t) => sum + t.issues_reported_count, 0);
    
    return {
      average_rating_overall: allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0,
      average_rating_last_30_days: recentRatings.length > 0 ? recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length : 0,
      repasse_rate: filteredTasks.length > 0 ? (repasseCount / filteredTasks.length) * 100 : 0,
      issues_per_task: filteredTasks.length > 0 ? totalIssues / filteredTasks.length : 0,
      tasks_completed: filteredTasks.length,
    };
  }, [filteredTasks]);

  const ratingDistribution = useMemo((): RatingDistribution[] => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredTasks.forEach(task => {
      if (task.manager_rating) {
        distribution[task.manager_rating]++;
      }
    });
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));
  }, [filteredTasks]);

  const ratingTrend = useMemo((): TrendDataPoint[] => {
    const trendMap = new Map<string, number[]>();
    
    filteredTasks.forEach(task => {
      if (task.manager_rating) {
        const weekStart = format(parseISO(task.scheduled_date), 'yyyy-MM-dd');
        if (!trendMap.has(weekStart)) {
          trendMap.set(weekStart, []);
        }
        trendMap.get(weekStart)!.push(task.manager_rating);
      }
    });
    
    return Array.from(trendMap.entries())
      .map(([date, ratings]) => ({
        date,
        value: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTasks]);

  const repasseTrend = useMemo((): TrendDataPoint[] => {
    const trendMap = new Map<string, { total: number, repasse: number }>();
    
    filteredTasks.forEach(task => {
      const date = task.scheduled_date;
      if (!trendMap.has(date)) {
        trendMap.set(date, { total: 0, repasse: 0 });
      }
      trendMap.get(date)!.total++;
      if (task.rework_required) {
        trendMap.get(date)!.repasse++;
      }
    });
    
    return Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        value: data.total > 0 ? (data.repasse / data.total) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTasks]);

  const issueFrequency = useMemo((): IssueFrequency[] => {
    const tagCount: Record<QualityTag, number> = {
      dust: 0, bathroom: 0, linen: 0, kitchen: 0, smell: 0, 
      floors: 0, missing_items: 0, windows: 0, appliances: 0, general: 0
    };
    
    filteredTasks.forEach(task => {
      task.quality_tags.forEach(tag => {
        tagCount[tag]++;
      });
    });
    
    const totalTags = Object.values(tagCount).reduce((a, b) => a + b, 0);
    
    return Object.entries(tagCount)
      .filter(([_, count]) => count > 0)
      .map(([tag, count]) => ({
        tag: tag as QualityTag,
        count,
        percentage: totalTags > 0 ? (count / totalTags) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTasks]);

  const updateFilters = useCallback((newFilters: Partial<QualityFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getPropertyDetails = useCallback((propertyId: string) => {
    const propertyTasks = filteredTasks.filter(t => t.property_id === propertyId);
    const stats = propertyStats.find(p => p.property_id === propertyId);
    
    // Get agents who cleaned this property
    const agentPerformance = new Map<string, { ratings: number[], repasses: number, total: number, name: string }>();
    
    propertyTasks.forEach(task => {
      if (!agentPerformance.has(task.assigned_agent_id)) {
        agentPerformance.set(task.assigned_agent_id, { 
          ratings: [], repasses: 0, total: 0, name: task.assigned_agent_name 
        });
      }
      const perf = agentPerformance.get(task.assigned_agent_id)!;
      perf.total++;
      if (task.manager_rating) perf.ratings.push(task.manager_rating);
      if (task.rework_required) perf.repasses++;
    });
    
    return {
      stats,
      tasks: propertyTasks,
      agentPerformance: Array.from(agentPerformance.entries()).map(([id, data]) => ({
        agent_id: id,
        agent_name: data.name,
        average_rating: data.ratings.length > 0 ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length : 0,
        repasse_rate: data.total > 0 ? (data.repasses / data.total) * 100 : 0,
        tasks_count: data.total,
      })),
    };
  }, [filteredTasks, propertyStats]);

  const getAgentDetails = useCallback((agentId: string) => {
    const agentTasks = filteredTasks.filter(t => t.assigned_agent_id === agentId);
    const profile = agentProfiles.find(a => a.agent_id === agentId);
    
    // Get performance by property
    const propertyPerformance = new Map<string, { ratings: number[], repasses: number, total: number, name: string }>();
    
    agentTasks.forEach(task => {
      if (!propertyPerformance.has(task.property_id)) {
        propertyPerformance.set(task.property_id, { 
          ratings: [], repasses: 0, total: 0, name: task.property_name 
        });
      }
      const perf = propertyPerformance.get(task.property_id)!;
      perf.total++;
      if (task.manager_rating) perf.ratings.push(task.manager_rating);
      if (task.rework_required) perf.repasses++;
    });
    
    return {
      profile,
      tasks: agentTasks,
      propertyPerformance: Array.from(propertyPerformance.entries()).map(([id, data]) => ({
        property_id: id,
        property_name: data.name,
        average_rating: data.ratings.length > 0 ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length : 0,
        repasse_rate: data.total > 0 ? (data.repasses / data.total) * 100 : 0,
        tasks_count: data.total,
      })),
    };
  }, [filteredTasks, agentProfiles]);

  // Get unique values for filters
  const availableProperties = useMemo(() => {
    const props = new Map<string, string>();
    tasks.forEach(t => props.set(t.property_id, t.property_name));
    return Array.from(props.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  const availableAgents = useMemo(() => {
    const agents = new Map<string, string>();
    tasks.forEach(t => agents.set(t.assigned_agent_id, t.assigned_agent_name));
    return Array.from(agents.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  const availableChannels = useMemo(() => {
    const channels = new Set<string>();
    tasks.forEach(t => { if (t.channel) channels.add(t.channel); });
    return Array.from(channels);
  }, [tasks]);

  // Calculate portfolio average for benchmarking
  const portfolioAverageRating = useMemo(() => {
    const allRatings = filteredTasks.filter(t => t.manager_rating).map(t => t.manager_rating!);
    return allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
  }, [filteredTasks]);

  return {
    // Data
    tasks: filteredTasks,
    agentProfiles,
    propertyStats,
    kpis,
    ratingDistribution,
    ratingTrend,
    repasseTrend,
    issueFrequency,
    portfolioAverageRating,
    
    // Filters
    filters,
    updateFilters,
    availableProperties,
    availableAgents,
    availableChannels,
    
    // Detail getters
    getPropertyDetails,
    getAgentDetails,
  };
}
