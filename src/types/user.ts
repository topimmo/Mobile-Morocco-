export type UserType = 'repair_shop' | 'seller' | 'technician' | 'advertiser' | 'visitor';

export interface UserProfile {
  id: string;
  email: string;
  userType: UserType;
  displayName: string;
  shopName?: string;
  city: string;
  phone?: string;
  whatsapp?: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const USER_TYPES: Record<UserType, { label: { fr: string; ar: string }; description: { fr: string; ar: string }; permissions: string[] }> = {
  'repair_shop': {
    label: { fr: 'Atelier de Réparation', ar: 'ورشة إصلاح' },
    description: { fr: 'Proposez vos services de réparation mobile', ar: 'قدم خدمات إصلاح الهواتف' },
    permissions: ['create_service', 'create_listing', 'receive_messages', 'view_analytics'],
  },
  'seller': {
    label: { fr: 'Vendeur / Fournisseur', ar: 'بائع / مورد' },
    description: { fr: 'Vendez des smartphones, accessoires et pièces', ar: 'بيع الهواتف والإكسسوارات والقطع' },
    permissions: ['create_listing', 'receive_messages', 'view_analytics'],
  },
  'technician': {
    label: { fr: 'Technicien / Artisan', ar: 'تقني / حرفي' },
    description: { fr: 'Offrez vos compétences techniques', ar: 'قدم مهاراتك التقنية' },
    permissions: ['create_service', 'receive_messages', 'view_analytics'],
  },
  'advertiser': {
    label: { fr: 'Annonceur', ar: 'معلن' },
    description: { fr: 'Publiez des annonces et promotions', ar: 'نشر الإعلانات والعروض' },
    permissions: ['create_listing', 'receive_messages'],
  },
  'visitor': {
    label: { fr: 'Visiteur', ar: 'زائر' },
    description: { fr: 'Consultez les annonces et contactez les vendeurs', ar: 'تصفح الإعلانات وتواصل مع البائعين' },
    permissions: ['view_listings', 'send_messages'],
  },
};

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Nador',
  'Mohammedia',
  'El Jadida',
  'Béni Mellal',
  'Safi',
  'Khouribga',
  'Laâyoune',
  'Taza',
  'Settat',
];
