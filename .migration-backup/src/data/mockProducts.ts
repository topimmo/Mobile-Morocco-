export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  condition: "new" | "used" | "refurbished";
  image: string;
  images: string[];
  sellerName: string;
  sellerRating: number;
  location: string;
  phoneNumber: string;
  showPhoneNumber: boolean;
  enableWhatsApp: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  category: string;
  subcategory: string;
  specs: {
    brand?: string;
    model?: string;
    storage?: string;
    ram?: string;
    display?: string;
    camera?: string;
    battery?: string;
    os?: string;
    color?: string;
    warranty?: string;
  };
}

export const mockProducts: Product[] = [
  // Téléphones neufs
  {
    id: "phone-new-1",
    title: "iPhone 15 Pro Max - 256GB",
    price: 14999,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
    ],
    sellerName: "Apple Store Casablanca",
    sellerRating: 4.9,
    location: "Casablanca",
    phoneNumber: "0522123456",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: true,
    isFeatured: true,
    category: "phones",
    subcategory: "new-phones",
    specs: {
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      storage: "256GB",
      ram: "8GB",
      display: "6.7 pouces Super Retina XDR",
      camera: "48MP + 12MP + 12MP",
      battery: "4441 mAh",
      os: "iOS 17",
      color: "Titane Naturel",
      warranty: "1 an"
    }
  },
  {
    id: "phone-new-2",
    title: "Samsung Galaxy S24 Ultra - 512GB",
    price: 13499,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"
    ],
    sellerName: "Samsung Official Store",
    sellerRating: 4.8,
    location: "Rabat",
    phoneNumber: "0537654321",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: true,
    isFeatured: false,
    category: "phones",
    subcategory: "new-phones",
    specs: {
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      storage: "512GB",
      ram: "12GB",
      display: "6.8 pouces Dynamic AMOLED 2X",
      camera: "200MP + 50MP + 12MP + 10MP",
      battery: "5000 mAh",
      os: "Android 14",
      color: "Violet Titane",
      warranty: "2 ans"
    }
  },
  {
    id: "phone-new-3",
    title: "Google Pixel 8 Pro - 128GB",
    price: 8999,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80"
    ],
    sellerName: "TechWorld Marrakech",
    sellerRating: 4.6,
    location: "Marrakech",
    phoneNumber: "0524987654",
    showPhoneNumber: false,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: true,
    category: "phones",
    subcategory: "new-phones",
    specs: {
      brand: "Google",
      model: "Pixel 8 Pro",
      storage: "128GB",
      ram: "12GB",
      display: "6.7 pouces LTPO OLED",
      camera: "50MP + 48MP + 48MP",
      battery: "5050 mAh",
      os: "Android 14",
      color: "Bay",
      warranty: "1 an"
    }
  },

  // Téléphones d'occasion
  {
    id: "phone-used-1",
    title: "iPhone 13 Pro - 128GB",
    price: 6999,
    currency: "MAD",
    condition: "used",
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80"
    ],
    sellerName: "Mohamed Tech",
    sellerRating: 4.3,
    location: "Fès",
    phoneNumber: "0635123456",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: false,
    category: "phones",
    subcategory: "used-phones",
    specs: {
      brand: "Apple",
      model: "iPhone 13 Pro",
      storage: "128GB",
      ram: "6GB",
      display: "6.1 pouces Super Retina XDR",
      camera: "12MP + 12MP + 12MP",
      battery: "3095 mAh",
      os: "iOS 17",
      color: "Bleu Alpin",
      warranty: "3 mois"
    }
  },
  {
    id: "phone-used-2",
    title: "Samsung Galaxy S22 - 256GB",
    price: 4999,
    currency: "MAD",
    condition: "used",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"
    ],
    sellerName: "Aicha Mobile",
    sellerRating: 4.1,
    location: "Tanger",
    phoneNumber: "0639876543",
    showPhoneNumber: false,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: false,
    category: "phones",
    subcategory: "used-phones",
    specs: {
      brand: "Samsung",
      model: "Galaxy S22",
      storage: "256GB",
      ram: "8GB",
      display: "6.1 pouces Dynamic AMOLED 2X",
      camera: "50MP + 12MP + 10MP",
      battery: "3700 mAh",
      os: "Android 14",
      color: "Phantom Black",
      warranty: "6 mois"
    }
  },

  // Accessoires
  {
    id: "accessory-1",
    title: "AirPods Pro 2ème génération",
    price: 2499,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80"
    ],
    sellerName: "Audio Pro",
    sellerRating: 4.7,
    location: "Casablanca",
    phoneNumber: "0522456789",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: true,
    isFeatured: false,
    category: "accessories",
    subcategory: "chargers-earphones",
    specs: {
      brand: "Apple",
      model: "AirPods Pro 2",
      warranty: "1 an",
      color: "Blanc"
    }
  },
  {
    id: "accessory-2",
    title: "Chargeur sans fil 15W",
    price: 299,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=800&q=80"
    ],
    sellerName: "Accessoires Plus",
    sellerRating: 4.2,
    location: "Rabat",
    phoneNumber: "0537789123",
    showPhoneNumber: false,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: false,
    category: "accessories",
    subcategory: "chargers-earphones",
    specs: {
      brand: "Generic",
      model: "Wireless Charger 15W",
      warranty: "6 mois",
      color: "Noir"
    }
  },
  {
    id: "accessory-3",
    title: "Coque iPhone 15 Pro Max - Cuir",
    price: 199,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80"
    ],
    sellerName: "Protection Mobile",
    sellerRating: 4.4,
    location: "Marrakech",
    phoneNumber: "0524321654",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: false,
    category: "accessories",
    subcategory: "cases-protectors",
    specs: {
      brand: "Premium",
      model: "Leather Case",
      warranty: "3 mois",
      color: "Marron"
    }
  },

  // Pièces détachées
  {
    id: "spare-1",
    title: "Écran iPhone 13 - OLED Original",
    price: 1299,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80"
    ],
    sellerName: "Pièces Pro",
    sellerRating: 4.6,
    location: "Casablanca",
    phoneNumber: "0522654987",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: true,
    isFeatured: false,
    category: "spare-parts",
    subcategory: "new-spare-parts",
    specs: {
      brand: "Apple",
      model: "iPhone 13 OLED Display",
      warranty: "6 mois",
      color: "Noir"
    }
  },
  {
    id: "spare-2",
    title: "Batterie Samsung Galaxy S21",
    price: 399,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=800&q=80"
    ],
    sellerName: "Réparation Express",
    sellerRating: 4.3,
    location: "Fès",
    phoneNumber: "0635789456",
    showPhoneNumber: false,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: false,
    category: "spare-parts",
    subcategory: "new-spare-parts",
    specs: {
      brand: "Samsung",
      model: "Galaxy S21 Battery",
      warranty: "3 mois"
    }
  },

  // Équipement de réparation
  {
    id: "equipment-1",
    title: "Kit d'outils de réparation iPhone",
    price: 899,
    currency: "MAD",
    condition: "new",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
    ],
    sellerName: "Outils Tech",
    sellerRating: 4.5,
    location: "Rabat",
    phoneNumber: "0537123789",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: false,
    isFeatured: true,
    category: "repair-equipment",
    subcategory: "new-equipment",
    specs: {
      brand: "Professional",
      model: "iPhone Repair Kit",
      warranty: "1 an"
    }
  },
  {
    id: "equipment-2",
    title: "Station de soudure numérique",
    price: 2499,
    currency: "MAD",
    condition: "used",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
    ],
    sellerName: "Équipement Pro",
    sellerRating: 4.7,
    location: "Tanger",
    phoneNumber: "0639456123",
    showPhoneNumber: true,
    enableWhatsApp: true,
    isPremium: true,
    isFeatured: false,
    category: "repair-equipment",
    subcategory: "used-equipment",
    specs: {
      brand: "Weller",
      model: "Digital Soldering Station",
      warranty: "6 mois"
    }
  }
];

export const getProductsByCategory = (category: string, subcategory?: string) => {
  return mockProducts.filter(product => {
    if (subcategory) {
      return product.category === category && product.subcategory === subcategory;
    }
    return product.category === category;
  });
};

export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.isFeatured);
};

export const getPremiumProducts = () => {
  return mockProducts.filter(product => product.isPremium);
};

export const getProductById = (id: string) => {
  return mockProducts.find(product => product.id === id);
};