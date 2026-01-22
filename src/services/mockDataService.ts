import { CustomerProfile, ImporterProfile, TechnicianProfile, UserType } from '@/models/User';

// Mock user profiles for demonstration
export const mockProfiles = {
  customer: {
    id: 'mock-customer-id',
    email: 'customer@example.com',
    userType: 'customer' as UserType,
    firstName: 'Client',
    lastName: 'Demo',
    phoneNumber: '+212 600000000',
    subscriptionTier: 'standard',
    purchaseHistory: [
      { productId: 'prod-1', date: '2024-07-01', price: 2500 },
      { productId: 'prod-2', date: '2024-06-15', price: 1800 }
    ],
    favoriteProducts: ['prod-1', 'prod-3', 'prod-5'],
    recentSearches: ['iPhone 13', 'Samsung Galaxy', 'écouteurs sans fil'],
    notificationPreferences: {
      email: true,
      inApp: true,
      whatsapp: true
    }
  } as CustomerProfile,
  
  importer: {
    id: 'mock-importer-id',
    email: 'importer@example.com',
    userType: 'importer' as UserType,
    firstName: 'Importateur',
    lastName: 'Demo',
    phoneNumber: '+212 600000001',
    subscriptionTier: 'professional',
    storeIds: ['store-1', 'store-2'],
    purchaseHistory: [],
    favoriteProducts: [],
    recentSearches: [],
    servicesOffered: [],
    specialties: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    rating: 4.8,
    reviewCount: 24,
    notificationPreferences: {
      email: true,
      inApp: true,
      whatsapp: false
    }
  } as ImporterProfile,
  
  technician: {
    id: 'mock-technician-id',
    email: 'technician@example.com',
    userType: 'technician' as UserType,
    firstName: 'Technicien',
    lastName: 'Demo',
    phoneNumber: '+212 600000002',
    subscriptionTier: 'standard',
    purchaseHistory: [],
    favoriteProducts: [],
    recentSearches: [],
    storeIds: [],
    servicesOffered: [
      'Réparation d\'écran',
      'Remplacement de batterie',
      'Récupération de données',
      'Déblocage de téléphone'
    ],
    specialties: ['Apple', 'Samsung', 'Xiaomi'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    rating: 4.9,
    reviewCount: 56,
    notificationPreferences: {
      email: true,
      inApp: true,
      whatsapp: true
    }
  } as TechnicianProfile
};

// Function to get a mock profile based on user type
export const getMockProfile = (userType: UserType) => {
  return mockProfiles[userType];
};

// Mock stores data
export const mockStores = [
  {
    id: 'store-1',
    name: 'TechStore Casablanca',
    description: 'Spécialiste en téléphones et accessoires',
    city: 'Casablanca',
    productCount: 128
  },
  {
    id: 'store-2',
    name: 'Mobile Center Rabat',
    description: 'Importateur officiel de plusieurs marques',
    city: 'Rabat',
    productCount: 85
  }
];

// Mock service requests
export const mockServiceRequests = [
  {
    id: 'req-1',
    customerName: 'Ahmed Alaoui',
    service: 'Réparation d\'écran',
    device: 'iPhone 12',
    status: 'pending',
    date: '2024-07-25'
  },
  {
    id: 'req-2',
    customerName: 'Fatima Zahra',
    service: 'Remplacement de batterie',
    device: 'Samsung Galaxy S21',
    status: 'accepted',
    date: '2024-07-23'
  },
  {
    id: 'req-3',
    customerName: 'Karim Benjelloun',
    service: 'Déblocage de téléphone',
    device: 'Xiaomi Redmi Note 10',
    status: 'completed',
    date: '2024-07-20'
  }
];

// Mock products data
export const mockProducts = [
  {
    id: 'prod-1',
    sellerId: 'mock-importer-id',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Dernier iPhone avec puce A16 Bionic, écran Super Retina XDR',
    price: 14999,
    currency: 'MAD',
    condition: 'new' as const,
    category: 'phones',
    subcategory: 'smartphones',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80'],
    specifications: { storage: '256GB', color: 'Deep Purple', ram: '6GB' },
    location: 'Casablanca',
    city: 'Casablanca',
    isAvailable: true,
    viewCount: 245,
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    sellerId: 'mock-importer-id',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'Smartphone haut de gamme avec S Pen intégré',
    price: 12999,
    currency: 'MAD',
    condition: 'new' as const,
    category: 'phones',
    subcategory: 'smartphones',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'],
    specifications: { storage: '256GB', color: 'Phantom Black', ram: '12GB' },
    location: 'Rabat',
    city: 'Rabat',
    isAvailable: true,
    viewCount: 189,
    createdAt: '2024-07-02T10:00:00Z',
    updatedAt: '2024-07-02T10:00:00Z'
  },
  {
    id: 'prod-3',
    sellerId: 'mock-importer-id',
    title: 'Xiaomi Redmi Note 12 Pro',
    description: 'Excellent rapport qualité-prix avec caméra 108MP',
    price: 3499,
    currency: 'MAD',
    condition: 'new' as const,
    category: 'phones',
    subcategory: 'smartphones',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 Pro',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
    specifications: { storage: '128GB', color: 'Midnight Black', ram: '8GB' },
    location: 'Marrakech',
    city: 'Marrakech',
    isAvailable: true,
    viewCount: 312,
    createdAt: '2024-07-03T10:00:00Z',
    updatedAt: '2024-07-03T10:00:00Z'
  },
  {
    id: 'prod-4',
    sellerId: 'mock-importer-id',
    title: 'AirPods Pro 2ème génération',
    description: 'Écouteurs sans fil avec réduction de bruit active',
    price: 2999,
    currency: 'MAD',
    condition: 'new' as const,
    category: 'accessories',
    subcategory: 'earphones',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80'],
    specifications: { type: 'In-ear', connectivity: 'Bluetooth 5.3' },
    location: 'Casablanca',
    city: 'Casablanca',
    isAvailable: true,
    viewCount: 156,
    createdAt: '2024-07-04T10:00:00Z',
    updatedAt: '2024-07-04T10:00:00Z'
  },
  {
    id: 'prod-5',
    sellerId: 'mock-importer-id',
    title: 'iPhone 12 - Occasion',
    description: 'iPhone 12 en excellent état, batterie 89%',
    price: 5999,
    currency: 'MAD',
    condition: 'used' as const,
    category: 'phones',
    subcategory: 'smartphones',
    brand: 'Apple',
    model: 'iPhone 12',
    images: ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80'],
    specifications: { storage: '128GB', color: 'Blue', batteryHealth: '89%' },
    location: 'Fès',
    city: 'Fès',
    isAvailable: true,
    viewCount: 98,
    createdAt: '2024-07-05T10:00:00Z',
    updatedAt: '2024-07-05T10:00:00Z'
  },
  {
    id: 'prod-6',
    sellerId: 'mock-importer-id',
    title: 'Écran LCD iPhone 11',
    description: 'Écran de remplacement original pour iPhone 11',
    price: 899,
    currency: 'MAD',
    condition: 'new' as const,
    category: 'spare_parts',
    subcategory: 'screens',
    brand: 'Apple',
    model: 'iPhone 11 Screen',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
    specifications: { type: 'LCD', compatibility: 'iPhone 11' },
    location: 'Casablanca',
    city: 'Casablanca',
    isAvailable: true,
    viewCount: 67,
    createdAt: '2024-07-06T10:00:00Z',
    updatedAt: '2024-07-06T10:00:00Z'
  }
];