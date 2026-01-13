
import { useState, useCallback } from 'react';
import { StayRule, BlockingRule, ChannelRestriction, Promotion, PricingRule } from '@/types/pricing';

// Mock data for stay rules
const mockStayRules: StayRule[] = [
  {
    id: '1',
    propertyId: 'all',
    channel: 'all',
    season: 'all',
    minNights: 2,
    maxNights: 30,
    priority: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    propertyId: 1,
    propertyName: 'Appartement Marais',
    channel: 'airbnb',
    season: 'high',
    minNights: 3,
    maxNights: 14,
    priority: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    propertyId: 2,
    propertyName: 'Studio Bastille',
    channel: 'booking',
    season: 'peak',
    minNights: 5,
    maxNights: 21,
    priority: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function usePricingRules() {
  const [stayRules, setStayRules] = useState<StayRule[]>(mockStayRules);
  const [blockingRules, setBlockingRules] = useState<BlockingRule[]>([]);
  const [channelRestrictions, setChannelRestrictions] = useState<ChannelRestriction[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  // Stay Rules CRUD
  const addStayRule = useCallback((rule: Omit<StayRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: StayRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStayRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const updateStayRule = useCallback((id: string, updates: Partial<StayRule>) => {
    setStayRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates, updatedAt: new Date() } : rule
    ));
  }, []);

  const deleteStayRule = useCallback((id: string) => {
    setStayRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  const toggleStayRule = useCallback((id: string) => {
    setStayRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive, updatedAt: new Date() } : rule
    ));
  }, []);

  // Blocking Rules CRUD
  const addBlockingRule = useCallback((rule: Omit<BlockingRule, 'id' | 'createdAt'>) => {
    const newRule: BlockingRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setBlockingRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const deleteBlockingRule = useCallback((id: string) => {
    setBlockingRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  // Channel Restrictions CRUD
  const addChannelRestriction = useCallback((restriction: Omit<ChannelRestriction, 'id' | 'createdAt'>) => {
    const newRestriction: ChannelRestriction = {
      ...restriction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setChannelRestrictions(prev => [...prev, newRestriction]);
    return newRestriction;
  }, []);

  const deleteChannelRestriction = useCallback((id: string) => {
    setChannelRestrictions(prev => prev.filter(r => r.id !== id));
  }, []);

  // Promotions CRUD
  const addPromotion = useCallback((promo: Omit<Promotion, 'id' | 'createdAt'>) => {
    const newPromo: Promotion = {
      ...promo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setPromotions(prev => [...prev, newPromo]);
    return newPromo;
  }, []);

  const deletePromotion = useCallback((id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  }, []);

  // Pricing Rules CRUD
  const addPricingRule = useCallback((rule: Omit<PricingRule, 'id' | 'createdAt'>) => {
    const newRule: PricingRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setPricingRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const deletePricingRule = useCallback((id: string) => {
    setPricingRules(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    // Data
    stayRules,
    blockingRules,
    channelRestrictions,
    promotions,
    pricingRules,
    isLoading,
    
    // Stay Rules
    addStayRule,
    updateStayRule,
    deleteStayRule,
    toggleStayRule,
    
    // Blocking Rules
    addBlockingRule,
    deleteBlockingRule,
    
    // Channel Restrictions
    addChannelRestriction,
    deleteChannelRestriction,
    
    // Promotions
    addPromotion,
    deletePromotion,
    
    // Pricing Rules
    addPricingRule,
    deletePricingRule,
  };
}
