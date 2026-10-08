import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { trackComparisonAdded } from '@/services/analyticsService';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  condition: "new" | "used" | "refurbished";
  image: string;
  images?: string[];
  sellerName: string;
  sellerRating: number;
  location: string;
  phoneNumber?: string;
  showPhoneNumber?: boolean;
  enableWhatsApp?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
  specs?: any;
}

interface ComparisonContextType {
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const maxItems = 3; // Maximum number of items to compare

  // Load comparison list from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('mobilemorocco-comparison');
    if (savedComparison) {
      try {
        setComparisonList(JSON.parse(savedComparison));
      } catch (error) {
        console.error('Error loading comparison list from localStorage:', error);
      }
    }
  }, []);

  // Save comparison list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mobilemorocco-comparison', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = useCallback((product: Product) => {
    setComparisonList(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in comparison
      }
      // Track comparison added
      trackComparisonAdded(product.id);
      if (prev.length >= maxItems) {
        // Remove the first item and add the new one
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  }, []);

  const removeFromComparison = useCallback((productId: string) => {
    setComparisonList(prev => prev.filter(item => item.id !== productId));
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return comparisonList.some(item => item.id === productId);
  }, [comparisonList]);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const value = useMemo(
    () => ({
      comparisonList,
      addToComparison,
      removeFromComparison,
      isInComparison,
      clearComparison,
      maxItems
    }),
    [comparisonList, addToComparison, removeFromComparison, isInComparison, clearComparison]
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};