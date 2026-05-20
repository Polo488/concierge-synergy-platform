// Owner-initiated date block request workflow (mock).

export type BlockRequestStatus = 'pending' | 'approved' | 'rejected';

export type BlockMode = 'direct' | 'request';

export type BlockMotif = 'personal' | 'maintenance' | 'other';

export const MOTIF_LABELS: Record<BlockMotif, string> = {
  personal: 'Usage personnel',
  maintenance: 'Travaux / maintenance',
  other: 'Autre',
};

export interface BlockRequest {
  id: number;
  propertyId: number;
  propertyName: string;
  ownerId: string;
  ownerName: string;
  startDate: Date;
  endDate: Date;
  motif: BlockMotif;
  comment?: string;
  status: BlockRequestStatus;
  requestedAt: Date;
  decidedAt?: Date;
  decisionNote?: string;
}
