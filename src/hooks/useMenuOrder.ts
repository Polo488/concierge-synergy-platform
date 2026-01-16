
import { useState, useEffect, useCallback } from 'react';

const MENU_ORDER_KEY = 'bnb-lyon-menu-order';

// Default order of sections
const DEFAULT_ORDER = [
  'pilotage',
  'operations',
  'revenus',
  'experience',
  'organisation'
];

export function useMenuOrder() {
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_ORDER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load order from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MENU_ORDER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate and merge with defaults (handle new sections)
        const validOrder = mergeWithDefaults(parsed, DEFAULT_ORDER);
        setSectionOrder(validOrder);
      }
    } catch (error) {
      console.error('Failed to load menu order:', error);
    }
    setIsLoaded(true);
  }, []);

  // Merge stored order with defaults to handle new sections
  const mergeWithDefaults = (stored: string[], defaults: string[]): string[] => {
    // Keep stored order for existing sections
    const result = stored.filter(id => defaults.includes(id));
    
    // Add any new sections at the end
    defaults.forEach(id => {
      if (!result.includes(id)) {
        result.push(id);
      }
    });
    
    return result;
  };

  // Update order and persist
  const updateOrder = useCallback((newOrder: string[]) => {
    setSectionOrder(newOrder);
    try {
      localStorage.setItem(MENU_ORDER_KEY, JSON.stringify(newOrder));
    } catch (error) {
      console.error('Failed to save menu order:', error);
    }
  }, []);

  // Reset to default order
  const resetOrder = useCallback(() => {
    setSectionOrder(DEFAULT_ORDER);
    try {
      localStorage.removeItem(MENU_ORDER_KEY);
    } catch (error) {
      console.error('Failed to reset menu order:', error);
    }
  }, []);

  // Get ordered sections based on stored order
  const getOrderedSections = useCallback(<T extends { id: string }>(sections: T[]): T[] => {
    return [...sections].sort((a, b) => {
      const indexA = sectionOrder.indexOf(a.id);
      const indexB = sectionOrder.indexOf(b.id);
      
      // Handle sections not in order (new sections go to end)
      const posA = indexA === -1 ? sectionOrder.length : indexA;
      const posB = indexB === -1 ? sectionOrder.length : indexB;
      
      return posA - posB;
    });
  }, [sectionOrder]);

  return {
    sectionOrder,
    updateOrder,
    resetOrder,
    getOrderedSections,
    isLoaded
  };
}
