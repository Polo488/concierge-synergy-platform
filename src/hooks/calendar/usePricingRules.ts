import { useState, useCallback, useMemo } from 'react';
import { startOfDay, addDays, isSameDay, isWithinInterval, getDay } from 'date-fns';
import type { PricingRule, DailyPricing, CellNote, Channel } from '@/types/pricing';
import type { CalendarProperty } from '@/types/calendar';

// Mock pricing rules
const generateMockRules = (): PricingRule[] => {
  const today = startOfDay(new Date());
  
  return [
    {
      id: 'rule-1',
      propertyId: 'all',
      name: 'Minimum 2 nuits (défaut)',
      type: 'min_stay',
      enabled: true,
      priority: 1,
      minStay: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rule-2',
      propertyId: 1,
      name: 'Haute saison été - Prix +30%',
      type: 'price_override',
      enabled: true,
      priority: 10,
      startDate: new Date(2026, 6, 1),
      endDate: new Date(2026, 7, 31),
      priceAdjustment: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rule-3',
      propertyId: 'all',
      name: 'Long séjour 7+ nuits -10%',
      type: 'promotion',
      enabled: true,
      priority: 5,
      promotionType: 'long_stay',
      promotionMinNights: 7,
      priceAdjustment: -10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rule-4',
      propertyId: 2,
      name: 'Airbnb min 3 nuits',
      type: 'min_stay',
      enabled: true,
      priority: 15,
      channels: ['airbnb'],
      minStay: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rule-5',
      propertyId: 'all',
      name: 'Last minute -15%',
      type: 'promotion',
      enabled: true,
      priority: 8,
      promotionType: 'last_minute',
      promotionDaysBeforeArrival: 3,
      priceAdjustment: -15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'rule-6',
      propertyId: 3,
      name: 'Booking.com prix +5%',
      type: 'price_override',
      enabled: true,
      priority: 12,
      channels: ['booking'],
      priceAdjustment: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Mock cell notes
const generateMockNotes = (): CellNote[] => {
  const today = startOfDay(new Date());
  
  return [
    {
      id: 'note-1',
      propertyId: 1,
      date: addDays(today, 2),
      content: 'Vérification technique prévue',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'note-2',
      propertyId: 3,
      date: addDays(today, 5),
      content: 'Visite propriétaire',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

interface UsePricingRulesReturn {
  // Rules management
  rules: PricingRule[];
  addRule: (rule: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRule: (id: string, updates: Partial<PricingRule>) => void;
  deleteRule: (id: string) => void;
  duplicateRule: (id: string, targetPropertyIds: number[]) => void;
  
  // Notes management
  notes: CellNote[];
  addNote: (propertyId: number, date: Date, content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNoteForCell: (propertyId: number, date: Date) => CellNote | undefined;
  
  // Pricing calculation
  getDailyPricing: (property: CalendarProperty, date: Date) => DailyPricing;
  getChannelPrice: (property: CalendarProperty, date: Date, channel: Channel) => number;
  getMinStay: (propertyId: number, date: Date, channel?: Channel) => number;
  
  // Bulk actions
  applyRuleToAll: (ruleId: string) => void;
}

export function usePricingRules(properties: CalendarProperty[]): UsePricingRulesReturn {
  const [rules, setRules] = useState<PricingRule[]>(generateMockRules);
  const [notes, setNotes] = useState<CellNote[]>(generateMockNotes);

  // Add a new rule
  const addRule = useCallback((rule: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: PricingRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRules(prev => [...prev, newRule]);
  }, []);

  // Update an existing rule
  const updateRule = useCallback((id: string, updates: Partial<PricingRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, ...updates, updatedAt: new Date() }
        : rule
    ));
  }, []);

  // Delete a rule
  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  // Duplicate a rule to other properties
  const duplicateRule = useCallback((id: string, targetPropertyIds: number[]) => {
    const sourceRule = rules.find(r => r.id === id);
    if (!sourceRule) return;

    const newRules = targetPropertyIds.map(propertyId => ({
      ...sourceRule,
      id: `rule-${Date.now()}-${propertyId}`,
      propertyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setRules(prev => [...prev, ...newRules]);
  }, [rules]);

  // Add a note
  const addNote = useCallback((propertyId: number, date: Date, content: string) => {
    const newNote: CellNote = {
      id: `note-${Date.now()}`,
      propertyId,
      date: startOfDay(date),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  // Update a note
  const updateNote = useCallback((id: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, content, updatedAt: new Date() }
        : note
    ));
  }, []);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  // Get note for a specific cell
  const getNoteForCell = useCallback((propertyId: number, date: Date): CellNote | undefined => {
    const dayStart = startOfDay(date);
    return notes.find(note => 
      note.propertyId === propertyId && isSameDay(note.date, dayStart)
    );
  }, [notes]);

  // Get applicable rules for a property/date combination
  const getApplicableRules = useCallback((propertyId: number, date: Date, channel?: Channel): PricingRule[] => {
    const dayStart = startOfDay(date);
    const dayOfWeek = getDay(date);

    return rules
      .filter(rule => {
        if (!rule.enabled) return false;
        
        // Check property match
        if (rule.propertyId !== 'all' && rule.propertyId !== propertyId) return false;
        
        // Check date range
        if (rule.startDate && rule.endDate) {
          if (!isWithinInterval(dayStart, { start: startOfDay(rule.startDate), end: startOfDay(rule.endDate) })) {
            return false;
          }
        }
        
        // Check day of week
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          if (!rule.daysOfWeek.includes(dayOfWeek)) return false;
        }
        
        // Check channel
        if (channel && rule.channels && rule.channels.length > 0) {
          if (!rule.channels.includes(channel) && !rule.channels.includes('all')) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [rules]);

  // Calculate daily pricing
  const getDailyPricing = useCallback((property: CalendarProperty, date: Date): DailyPricing => {
    const applicableRules = getApplicableRules(property.id, date);
    const basePrice = property.pricePerNight;
    
    let finalPrice = basePrice;
    const adjustments: DailyPricing['adjustments'] = [];
    let minStay = 1;
    let maxStay: number | undefined;
    let isBlocked = false;
    let blockReason: string | undefined;
    const channelPrices: Record<Channel, number> = {
      airbnb: basePrice,
      booking: basePrice,
      vrbo: basePrice,
      direct: basePrice,
      all: basePrice,
    };

    for (const rule of applicableRules) {
      switch (rule.type) {
        case 'price_override':
          if (rule.priceAdjustment) {
            const adjustment = basePrice * (rule.priceAdjustment / 100);
            finalPrice += adjustment;
            adjustments.push({
              ruleId: rule.id,
              ruleName: rule.name,
              type: rule.type,
              adjustment: rule.priceAdjustment,
              isPercentage: true,
            });
            
            // Apply to specific channels if defined
            if (rule.channels && rule.channels.length > 0) {
              for (const channel of rule.channels) {
                if (channel !== 'all') {
                  channelPrices[channel] += adjustment;
                }
              }
            }
          }
          break;
          
        case 'min_stay':
          if (rule.minStay && rule.minStay > minStay) {
            minStay = rule.minStay;
          }
          break;
          
        case 'max_stay':
          if (rule.maxStay) {
            maxStay = maxStay ? Math.min(maxStay, rule.maxStay) : rule.maxStay;
          }
          break;
          
        case 'closing_block':
          isBlocked = true;
          blockReason = rule.blockReason || rule.name;
          break;
          
        case 'promotion':
          if (rule.priceAdjustment) {
            const promoAdjustment = basePrice * (rule.priceAdjustment / 100);
            adjustments.push({
              ruleId: rule.id,
              ruleName: rule.name,
              type: rule.promotionType || rule.type,
              adjustment: rule.priceAdjustment,
              isPercentage: true,
            });
          }
          break;
      }
    }

    return {
      propertyId: property.id,
      date,
      basePrice,
      finalPrice: Math.round(finalPrice),
      adjustments,
      minStay,
      maxStay,
      isBlocked,
      blockReason,
      channelPrices,
    };
  }, [getApplicableRules]);

  // Get channel-specific price
  const getChannelPrice = useCallback((property: CalendarProperty, date: Date, channel: Channel): number => {
    const pricing = getDailyPricing(property, date);
    return pricing.channelPrices?.[channel] || pricing.finalPrice;
  }, [getDailyPricing]);

  // Get minimum stay requirement
  const getMinStay = useCallback((propertyId: number, date: Date, channel?: Channel): number => {
    const applicableRules = getApplicableRules(propertyId, date, channel);
    let minStay = 1;

    for (const rule of applicableRules) {
      if (rule.type === 'min_stay' && rule.minStay && rule.minStay > minStay) {
        minStay = rule.minStay;
      }
    }

    return minStay;
  }, [getApplicableRules]);

  // Apply a rule to all properties
  const applyRuleToAll = useCallback((ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    updateRule(ruleId, { propertyId: 'all' });
  }, [rules, updateRule]);

  return {
    rules,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteForCell,
    getDailyPricing,
    getChannelPrice,
    getMinStay,
    applyRuleToAll,
  };
}
