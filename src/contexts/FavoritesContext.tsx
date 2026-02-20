import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { trackFavoriteAdded } from '@/services/analyticsService';

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
  dateAdded?: string;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mobilemorocco-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('mobilemorocco-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === product.id)) {
        return prev; // Already in favorites
      }
      // Track favorite added
      trackFavoriteAdded(product.id);
      return [...prev, product];
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(fav => fav.id === productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites
    }),
    [favorites, addToFavorites, removeFromFavorites, isFavorite, clearFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};