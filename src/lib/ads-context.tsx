import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Ad, AdPlacement, AdStatus } from '@/types/ads';

// Mock data for demonstration
const mockAds: Ad[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - Offre Spéciale',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=728&q=80',
    size: 'large-banner',
    placement: 'homepage',
    status: 'approved',
    duration: 'monthly',
    redirectUrl: 'https://example.com/iphone',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z',
    views: 12450,
    clicks: 342,
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24 Ultra',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80',
    size: 'medium-rectangle',
    placement: 'sidebar',
    status: 'approved',
    duration: 'weekly',
    redirectUrl: 'https://example.com/samsung',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    expiresAt: '2024-01-25T14:30:00Z',
    views: 5230,
    clicks: 128,
  },
  {
    id: '3',
    title: 'Accessoires Premium',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=250&q=80',
    size: 'small-square',
    placement: 'product',
    status: 'pending',
    duration: 'monthly',
    redirectUrl: 'https://example.com/accessories',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    views: 0,
    clicks: 0,
  },
  {
    id: '4',
    title: 'Réparation Express',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=728&q=80',
    size: 'large-banner',
    placement: 'footer',
    status: 'approved',
    duration: 'unlimited',
    redirectUrl: 'https://example.com/repair',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    views: 8920,
    clicks: 215,
  },
  {
    id: '5',
    title: 'Xiaomi Mi 14',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    size: 'medium-rectangle',
    placement: 'category',
    status: 'rejected',
    duration: 'weekly',
    redirectUrl: 'https://example.com/xiaomi',
    enabled: false,
    sortOrder: 2,
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T18:00:00Z',
    views: 0,
    clicks: 0,
  },
  {
    id: '6',
    title: 'Promo Vendeur VIP',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=250&q=80',
    size: 'small-square',
    placement: 'vendor-profile',
    status: 'approved',
    duration: 'monthly',
    redirectUrl: 'https://example.com/vip',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-12T08:30:00Z',
    expiresAt: '2024-02-12T08:30:00Z',
    views: 3450,
    clicks: 89,
  },
  {
    id: '7',
    title: 'Recherche Sponsorisée',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=728&q=80',
    size: 'large-banner',
    placement: 'search',
    status: 'approved',
    duration: 'weekly',
    redirectUrl: 'https://example.com/search-promo',
    enabled: true,
    sortOrder: 1,
    createdAt: '2024-01-17T13:20:00Z',
    updatedAt: '2024-01-17T13:20:00Z',
    expiresAt: '2024-01-24T13:20:00Z',
    views: 6780,
    clicks: 156,
  },
];

interface AdsContextType {
  ads: Ad[];
  getAdsByPlacement: (placement: AdPlacement) => Ad[];
  getApprovedAdsByPlacement: (placement: AdPlacement) => Ad[];
  addAd: (ad: Omit<Ad, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks'>) => void;
  updateAd: (id: string, updates: Partial<Ad>) => void;
  deleteAd: (id: string) => void;
  toggleAdEnabled: (id: string) => void;
  updateAdStatus: (id: string, status: AdStatus) => void;
  recordView: (id: string) => void;
  recordClick: (id: string) => void;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export function AdsProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>(mockAds);

  const getAdsByPlacement = useCallback((placement: AdPlacement) => {
    return ads
      .filter(ad => ad.placement === placement)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [ads]);

  const getApprovedAdsByPlacement = useCallback((placement: AdPlacement) => {
    return ads
      .filter(ad => ad.placement === placement && ad.status === 'approved' && ad.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [ads]);

  const addAd = useCallback((adData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'clicks'>) => {
    const newAd: Ad = {
      ...adData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };
    setAds(prev => [...prev, newAd]);
  }, []);

  const updateAd = useCallback((id: string, updates: Partial<Ad>) => {
    setAds(prev => prev.map(ad => 
      ad.id === id 
        ? { ...ad, ...updates, updatedAt: new Date().toISOString() }
        : ad
    ));
  }, []);

  const deleteAd = useCallback((id: string) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  }, []);

  const toggleAdEnabled = useCallback((id: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === id 
        ? { ...ad, enabled: !ad.enabled, updatedAt: new Date().toISOString() }
        : ad
    ));
  }, []);

  const updateAdStatus = useCallback((id: string, status: AdStatus) => {
    setAds(prev => prev.map(ad => 
      ad.id === id 
        ? { ...ad, status, updatedAt: new Date().toISOString() }
        : ad
    ));
  }, []);

  const recordView = useCallback((id: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === id 
        ? { ...ad, views: ad.views + 1 }
        : ad
    ));
  }, []);

  const recordClick = useCallback((id: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === id 
        ? { ...ad, clicks: ad.clicks + 1 }
        : ad
    ));
  }, []);

  return (
    <AdsContext.Provider value={{
      ads,
      getAdsByPlacement,
      getApprovedAdsByPlacement,
      addAd,
      updateAd,
      deleteAd,
      toggleAdEnabled,
      updateAdStatus,
      recordView,
      recordClick,
    }}>
      {children}
    </AdsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAds() {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
}
