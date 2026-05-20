import { useEffect, useState, useCallback } from 'react';
import { addDays, startOfDay } from 'date-fns';
import type { BlockRequest, BlockMode, BlockMotif } from '@/types/blockRequest';

// ---------------------------------------------------------------------------
// Mock module-level store (no persistence) — shared between admin & owner views.
// ---------------------------------------------------------------------------

const today = startOfDay(new Date());

let _seq = 1000;
let _globalMode: BlockMode = 'request';
const _propertyMode = new Map<number, BlockMode>(); // overrides

let _requests: BlockRequest[] = [
  {
    id: ++_seq,
    propertyId: 1,
    propertyName: 'Appartement Vieux-Port',
    ownerId: '7',
    ownerName: 'Marie Dupont',
    startDate: addDays(today, 12),
    endDate: addDays(today, 16),
    motif: 'personal',
    comment: 'Séjour en famille',
    status: 'pending',
    requestedAt: addDays(today, -1),
  },
  {
    id: ++_seq,
    propertyId: 3,
    propertyName: 'Studio Panier',
    ownerId: '7',
    ownerName: 'Marie Dupont',
    startDate: addDays(today, 25),
    endDate: addDays(today, 27),
    motif: 'maintenance',
    comment: 'Remplacement chauffe-eau',
    status: 'pending',
    requestedAt: addDays(today, -2),
  },
];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const blockRequestsStore = {
  list(): BlockRequest[] {
    return [..._requests];
  },
  listForOwner(ownerId: string): BlockRequest[] {
    return _requests.filter((r) => r.ownerId === ownerId);
  },
  pendingCount(): number {
    return _requests.filter((r) => r.status === 'pending').length;
  },
  globalMode(): BlockMode {
    return _globalMode;
  },
  setGlobalMode(mode: BlockMode) {
    _globalMode = mode;
    notify();
  },
  modeFor(propertyId: number): BlockMode {
    return _propertyMode.get(propertyId) ?? _globalMode;
  },
  setPropertyMode(propertyId: number, mode: BlockMode | null) {
    if (mode === null) _propertyMode.delete(propertyId);
    else _propertyMode.set(propertyId, mode);
    notify();
  },
  propertyOverrides(): Array<[number, BlockMode]> {
    return Array.from(_propertyMode.entries());
  },
  create(input: {
    propertyId: number;
    propertyName: string;
    ownerId: string;
    ownerName: string;
    startDate: Date;
    endDate: Date;
    motif: BlockMotif;
    comment?: string;
  }): BlockRequest {
    const req: BlockRequest = {
      id: ++_seq,
      ...input,
      status: 'pending',
      requestedAt: new Date(),
    };
    _requests = [req, ..._requests];
    notify();
    return req;
  },
  approve(id: number, note?: string) {
    _requests = _requests.map((r) =>
      r.id === id ? { ...r, status: 'approved', decidedAt: new Date(), decisionNote: note } : r
    );
    notify();
  },
  reject(id: number, note?: string) {
    _requests = _requests.map((r) =>
      r.id === id ? { ...r, status: 'rejected', decidedAt: new Date(), decisionNote: note } : r
    );
    notify();
  },
};

export function useBlockRequests() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const getPendingForProperty = useCallback(
    (propertyId: number, day: Date): BlockRequest | null => {
      const d = startOfDay(day).getTime();
      return (
        _requests.find(
          (r) =>
            r.propertyId === propertyId &&
            r.status === 'pending' &&
            startOfDay(r.startDate).getTime() <= d &&
            startOfDay(r.endDate).getTime() >= d
        ) ?? null
      );
    },
    []
  );

  return {
    requests: blockRequestsStore.list(),
    pendingCount: blockRequestsStore.pendingCount(),
    globalMode: blockRequestsStore.globalMode(),
    setGlobalMode: blockRequestsStore.setGlobalMode,
    modeFor: blockRequestsStore.modeFor,
    setPropertyMode: blockRequestsStore.setPropertyMode,
    propertyOverrides: blockRequestsStore.propertyOverrides(),
    create: blockRequestsStore.create,
    approve: blockRequestsStore.approve,
    reject: blockRequestsStore.reject,
    listForOwner: blockRequestsStore.listForOwner,
    getPendingForProperty,
  };
}
