
export type InspectionStatus = 'good' | 'needs_attention' | 'urgent';

export interface InspectionSectionData {
  status: InspectionStatus;
  notes: string;
  photos: string[];
  videos: string[];
}

export interface InspectionSections {
  generalCondition: InspectionSectionData;
  cleanliness: InspectionSectionData;
  furnitureEquipment: InspectionSectionData;
  electricalAppliances: InspectionSectionData;
  bathroomPlumbing: InspectionSectionData;
  wallsPaintDamage: InspectionSectionData;
  safetyCompliance: InspectionSectionData;
  stockLevel: InspectionSectionData;
  photosMedia: InspectionSectionData;
  additionalNotes: InspectionSectionData;
}

export type InspectionSectionKey = keyof InspectionSections;

export const SECTION_LABELS: Record<InspectionSectionKey, string> = {
  generalCondition: 'État général',
  cleanliness: 'Propreté',
  furnitureEquipment: 'Mobilier & Équipements',
  electricalAppliances: 'Électricité & Appareils',
  bathroomPlumbing: 'Salle de bain & Plomberie',
  wallsPaintDamage: 'Murs / Peinture / Dégâts',
  safetyCompliance: 'Sécurité & Conformité',
  stockLevel: 'Niveau de stock',
  photosMedia: 'Photos & Médias',
  additionalNotes: 'Notes complémentaires',
};

export const SECTION_ICONS: Record<InspectionSectionKey, string> = {
  generalCondition: 'Home',
  cleanliness: 'Sparkles',
  furnitureEquipment: 'Sofa',
  electricalAppliances: 'Zap',
  bathroomPlumbing: 'Droplets',
  wallsPaintDamage: 'PaintBucket',
  safetyCompliance: 'ShieldCheck',
  stockLevel: 'Package',
  photosMedia: 'Camera',
  additionalNotes: 'FileText',
};

export interface PropertyCheck {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  inspectorId: string;
  inspectorName: string;
  scheduledDate?: string;
  performedAt: string;
  completedAt?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  sections: InspectionSections;
  healthScore: number; // 0-100
  issuesDetected: number;
  actionsCreated: number;
  timeSpentMinutes?: number;
  nextRecommendedDate?: string;
  createdActions: CheckAction[];
  propertyChanges: PropertyChangeLog[];
}

export interface CheckAction {
  id: string;
  checkId: string;
  sectionKey: InspectionSectionKey;
  actionType: 'maintenance' | 'cleaning_repasse' | 'stock_restock' | 'operational_reminder';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  propertyId: string;
  propertyName: string;
}

export interface PropertyChangeLog {
  id: string;
  checkId: string;
  field: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

export const createEmptySectionData = (): InspectionSectionData => ({
  status: 'good',
  notes: '',
  photos: [],
  videos: [],
});

export const createEmptyInspection = (): InspectionSections => ({
  generalCondition: createEmptySectionData(),
  cleanliness: createEmptySectionData(),
  furnitureEquipment: createEmptySectionData(),
  electricalAppliances: createEmptySectionData(),
  bathroomPlumbing: createEmptySectionData(),
  wallsPaintDamage: createEmptySectionData(),
  safetyCompliance: createEmptySectionData(),
  stockLevel: createEmptySectionData(),
  photosMedia: createEmptySectionData(),
  additionalNotes: createEmptySectionData(),
});
