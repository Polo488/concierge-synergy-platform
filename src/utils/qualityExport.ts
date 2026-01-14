
import { CleaningTaskExtended, AgentProfile, PropertyQualityStats, QualityTag } from '@/types/quality';
import { format, parseISO } from 'date-fns';

const TAG_LABELS: Record<QualityTag, string> = {
  dust: 'Poussière',
  bathroom: 'Salle de bain',
  linen: 'Linge',
  kitchen: 'Cuisine',
  smell: 'Odeur',
  floors: 'Sols',
  missing_items: 'Objets manquants',
  windows: 'Vitres',
  appliances: 'Électroménager',
  general: 'Général',
};

function escapeCSVField(field: string | number | undefined | null): string {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  // Escape double quotes and wrap in quotes if contains comma, newline, or quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTasksToCSV(tasks: CleaningTaskExtended[]): void {
  const headers = [
    'Date',
    'Propriété',
    'Agent',
    'Statut',
    'Note manager',
    'Note propriétaire',
    'Note client',
    'Commentaire',
    'Tags qualité',
    'Repasse requise',
    'Raison repasse',
    'Problèmes signalés',
    'Canal',
  ];

  const rows = tasks.map(task => [
    format(parseISO(task.scheduled_date), 'yyyy-MM-dd'),
    escapeCSVField(task.property_name),
    escapeCSVField(task.assigned_agent_name),
    task.status,
    task.manager_rating?.toString() || '',
    task.owner_rating?.toString() || '',
    task.guest_rating?.toString() || '',
    escapeCSVField(task.rating_comment),
    escapeCSVField(task.quality_tags.map(t => TAG_LABELS[t]).join('; ')),
    task.rework_required ? 'Oui' : 'Non',
    escapeCSVField(task.rework_reason),
    task.issues_reported_count.toString(),
    task.channel || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const dateStr = format(new Date(), 'yyyy-MM-dd');
  downloadCSV(csvContent, `export-taches-menage-${dateStr}.csv`);
}

export function exportAgentSummaryToCSV(agents: AgentProfile[]): void {
  const headers = [
    'Agent',
    'Note globale',
    'Note 30 derniers jours',
    'Tâches complétées',
    'Taux de repasse (%)',
    'Statut actif',
  ];

  const rows = agents.map(agent => [
    escapeCSVField(agent.agent_name),
    agent.average_rating_overall.toFixed(2),
    agent.average_rating_last_30_days.toFixed(2),
    agent.tasks_completed_total.toString(),
    agent.repasse_rate.toFixed(1),
    agent.active_status ? 'Oui' : 'Non',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const dateStr = format(new Date(), 'yyyy-MM-dd');
  downloadCSV(csvContent, `export-agents-performance-${dateStr}.csv`);
}

export function exportPropertySummaryToCSV(properties: PropertyQualityStats[]): void {
  const headers = [
    'Propriété',
    'Note globale',
    'Note 30 derniers jours',
    'Total nettoyages',
    'Taux de repasse (%)',
    'Problèmes par séjour',
  ];

  const rows = properties.map(prop => [
    escapeCSVField(prop.property_name),
    prop.average_cleaning_rating_overall.toFixed(2),
    prop.average_cleaning_rating_last_30_days.toFixed(2),
    prop.total_cleanings.toString(),
    prop.repasse_rate.toFixed(1),
    prop.issues_per_stay.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const dateStr = format(new Date(), 'yyyy-MM-dd');
  downloadCSV(csvContent, `export-proprietes-qualite-${dateStr}.csv`);
}
