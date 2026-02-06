export type AdSize = 'large-banner' | 'medium-rectangle' | 'small-square';
export type AdPlacement = 'homepage' | 'category' | 'product' | 'search' | 'vendor-profile' | 'sidebar' | 'footer';
export type AdStatus = 'pending' | 'approved' | 'rejected';
export type AdDuration = 'daily' | 'weekly' | 'monthly' | 'unlimited' | 'custom';
export type AdMediaType = 'image' | 'video';

export interface Ad {
  id: string;
  title: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  size: AdSize;
  placement: AdPlacement;
  status: AdStatus;
  duration: AdDuration;
  redirectUrl?: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  expiresAt?: string;
  views: number;
  clicks: number;
}

export const AD_SIZE_DIMENSIONS: Record<AdSize, { width: number; height: number; label: { fr: string; ar: string } }> = {
  'large-banner': { width: 728, height: 90, label: { fr: 'Grande Bannière', ar: 'بانر كبير' } },
  'medium-rectangle': { width: 300, height: 250, label: { fr: 'Rectangle Moyen', ar: 'مستطيل متوسط' } },
  'small-square': { width: 250, height: 250, label: { fr: 'Petit Carré', ar: 'مربع صغير' } },
};

export const AD_PLACEMENTS: Record<AdPlacement, { label: { fr: string; ar: string }; description: { fr: string; ar: string } }> = {
  'homepage': { 
    label: { fr: 'Page d\'accueil', ar: 'الصفحة الرئيسية' },
    description: { fr: 'Bannière principale sur la page d\'accueil', ar: 'البانر الرئيسي في الصفحة الرئيسية' }
  },
  'category': { 
    label: { fr: 'Pages de catégories', ar: 'صفحات الفئات' },
    description: { fr: 'Affiché sur les pages de catégories', ar: 'يظهر في صفحات الفئات' }
  },
  'product': { 
    label: { fr: 'Pages de produits', ar: 'صفحات المنتجات' },
    description: { fr: 'Affiché sur les pages de détails produit', ar: 'يظهر في صفحات تفاصيل المنتج' }
  },
  'search': { 
    label: { fr: 'Résultats de recherche', ar: 'نتائج البحث' },
    description: { fr: 'Affiché dans les résultats de recherche', ar: 'يظهر في نتائج البحث' }
  },
  'vendor-profile': { 
    label: { fr: 'Profil vendeur', ar: 'ملف البائع' },
    description: { fr: 'Affiché sur les profils vendeurs', ar: 'يظهر في ملفات البائعين' }
  },
  'sidebar': { 
    label: { fr: 'Barre latérale', ar: 'الشريط الجانبي' },
    description: { fr: 'Affiché dans la barre latérale', ar: 'يظهر في الشريط الجانبي' }
  },
  'footer': { 
    label: { fr: 'Pied de page', ar: 'تذييل الصفحة' },
    description: { fr: 'Affiché dans le pied de page', ar: 'يظهر في تذييل الصفحة' }
  },
};

export const AD_DURATIONS: Record<AdDuration, { label: { fr: string; ar: string }; days: number | null }> = {
  'daily': { label: { fr: 'Quotidien', ar: 'يومي' }, days: 1 },
  'weekly': { label: { fr: 'Hebdomadaire', ar: 'أسبوعي' }, days: 7 },
  'monthly': { label: { fr: 'Mensuel', ar: 'شهري' }, days: 30 },
  'unlimited': { label: { fr: 'Illimité', ar: 'غير محدود' }, days: null },
  'custom': { label: { fr: 'Personnalisé', ar: 'مخصص' }, days: null },
};

export const AD_STATUSES: Record<AdStatus, { label: { fr: string; ar: string }; color: string }> = {
  'pending': { label: { fr: 'En attente', ar: 'قيد الانتظار' }, color: 'bg-yellow-500/20 text-yellow-400' },
  'approved': { label: { fr: 'Approuvé', ar: 'موافق عليه' }, color: 'bg-green-500/20 text-green-400' },
  'rejected': { label: { fr: 'Rejeté', ar: 'مرفوض' }, color: 'bg-red-500/20 text-red-400' },
};
