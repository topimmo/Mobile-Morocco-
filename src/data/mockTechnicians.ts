export interface Technician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  phoneNumber: string;
  whatsappNumber: string;
  specialties: string[];
  experience: string;
  description: string;
  services: {
    name: string;
    price: number;
    duration: string;
    description: string;
  }[];
  availability: {
    status: 'available' | 'busy' | 'offline';
    nextAvailable?: string;
  };
  certifications: string[];
  languages: string[];
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  isPremium: boolean;
  isVerified: boolean;
  responseTime: string;
  completedJobs: number;
  joinedDate: string;
  gallery: string[];
}

export const mockTechnicians: Technician[] = [
  {
    id: "tech-1",
    name: "Ahmed Benali",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    rating: 4.9,
    reviewCount: 127,
    location: "Casablanca",
    phoneNumber: "0522123456",
    whatsappNumber: "212522123456",
    specialties: ["iPhone", "Samsung", "Réparation d'écran", "Changement de batterie"],
    experience: "8 ans",
    description: "Technicien expert en réparation de smartphones avec plus de 8 ans d'expérience. Spécialisé dans les réparations iPhone et Samsung.",
    services: [
      {
        name: "Réparation d'écran iPhone",
        price: 800,
        duration: "1-2 heures",
        description: "Remplacement complet de l'écran avec garantie 6 mois"
      },
      {
        name: "Changement de batterie",
        price: 300,
        duration: "30 minutes",
        description: "Remplacement de batterie avec batterie originale"
      },
      {
        name: "Réparation carte mère",
        price: 1200,
        duration: "2-3 jours",
        description: "Diagnostic et réparation des problèmes de carte mère"
      }
    ],
    availability: {
      status: 'available'
    },
    certifications: ["Certifié Apple", "Formation Samsung"],
    languages: ["Arabe", "Français", "Anglais"],
    workingHours: {
      monday: "9h00 - 18h00",
      tuesday: "9h00 - 18h00",
      wednesday: "9h00 - 18h00",
      thursday: "9h00 - 18h00",
      friday: "9h00 - 18h00",
      saturday: "10h00 - 16h00",
      sunday: "Fermé"
    },
    isPremium: true,
    isVerified: true,
    responseTime: "< 1 heure",
    completedJobs: 1250,
    joinedDate: "2020-03-15",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80"
    ]
  },
  {
    id: "tech-2",
    name: "Fatima Zahra",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
    rating: 4.7,
    reviewCount: 89,
    location: "Rabat",
    phoneNumber: "0537654321",
    whatsappNumber: "212537654321",
    specialties: ["Huawei", "Xiaomi", "Réparation logicielle", "Déblocage"],
    experience: "5 ans",
    description: "Spécialiste en réparation de smartphones Android et déblocage. Experte en réparations logicielles.",
    services: [
      {
        name: "Déblocage téléphone",
        price: 200,
        duration: "1 heure",
        description: "Déblocage sécurisé de tous types de téléphones"
      },
      {
        name: "Réparation logicielle",
        price: 400,
        duration: "2-4 heures",
        description: "Résolution des problèmes système et logiciels"
      },
      {
        name: "Installation ROM custom",
        price: 500,
        duration: "3-5 heures",
        description: "Installation de ROM personnalisée avec sauvegarde"
      }
    ],
    availability: {
      status: 'available'
    },
    certifications: ["Formation Huawei", "Certification Android"],
    languages: ["Arabe", "Français"],
    workingHours: {
      monday: "8h30 - 17h30",
      tuesday: "8h30 - 17h30",
      wednesday: "8h30 - 17h30",
      thursday: "8h30 - 17h30",
      friday: "8h30 - 17h30",
      saturday: "9h00 - 15h00",
      sunday: "Fermé"
    },
    isPremium: false,
    isVerified: true,
    responseTime: "< 2 heures",
    completedJobs: 650,
    joinedDate: "2021-07-20",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80"
    ]
  },
  {
    id: "tech-3",
    name: "Youssef Alami",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=youssef",
    rating: 4.8,
    reviewCount: 156,
    location: "Marrakech",
    phoneNumber: "0524987654",
    whatsappNumber: "212524987654",
    specialties: ["Réparation d'écran", "Caméra", "Haut-parleur", "Toutes marques"],
    experience: "10 ans",
    description: "Technicien expérimenté avec 10 ans dans le domaine. Spécialisé dans toutes les réparations hardware.",
    services: [
      {
        name: "Réparation caméra",
        price: 600,
        duration: "2-3 heures",
        description: "Réparation ou remplacement de caméra avant/arrière"
      },
      {
        name: "Réparation haut-parleur",
        price: 250,
        duration: "1 heure",
        description: "Remplacement haut-parleur interne ou externe"
      },
      {
        name: "Nettoyage complet",
        price: 150,
        duration: "45 minutes",
        description: "Nettoyage interne et externe du téléphone"
      }
    ],
    availability: {
      status: 'busy',
      nextAvailable: "Demain 14h00"
    },
    certifications: ["10 ans d'expérience", "Formation continue"],
    languages: ["Arabe", "Français", "Berbère"],
    workingHours: {
      monday: "9h00 - 19h00",
      tuesday: "9h00 - 19h00",
      wednesday: "9h00 - 19h00",
      thursday: "9h00 - 19h00",
      friday: "9h00 - 19h00",
      saturday: "10h00 - 18h00",
      sunday: "10h00 - 16h00"
    },
    isPremium: true,
    isVerified: true,
    responseTime: "< 30 minutes",
    completedJobs: 2100,
    joinedDate: "2019-01-10",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80",
      "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=400&q=80"
    ]
  },
  {
    id: "tech-4",
    name: "Aicha Benkirane",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aicha",
    rating: 4.6,
    reviewCount: 73,
    location: "Fès",
    phoneNumber: "0535123789",
    whatsappNumber: "212535123789",
    specialties: ["Oppo", "Vivo", "OnePlus", "Réparation rapide"],
    experience: "4 ans",
    description: "Jeune technicienne dynamique spécialisée dans les marques chinoises et les réparations express.",
    services: [
      {
        name: "Diagnostic complet",
        price: 100,
        duration: "30 minutes",
        description: "Diagnostic complet avec rapport détaillé"
      },
      {
        name: "Réparation express",
        price: 400,
        duration: "1 heure",
        description: "Réparations simples en moins d'une heure"
      },
      {
        name: "Mise à jour logicielle",
        price: 150,
        duration: "1-2 heures",
        description: "Mise à jour système et applications"
      }
    ],
    availability: {
      status: 'available'
    },
    certifications: ["Formation technique", "Certification qualité"],
    languages: ["Arabe", "Français"],
    workingHours: {
      monday: "10h00 - 18h00",
      tuesday: "10h00 - 18h00",
      wednesday: "10h00 - 18h00",
      thursday: "10h00 - 18h00",
      friday: "10h00 - 18h00",
      saturday: "11h00 - 17h00",
      sunday: "Fermé"
    },
    isPremium: false,
    isVerified: false,
    responseTime: "< 3 heures",
    completedJobs: 320,
    joinedDate: "2022-09-05",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80"
    ]
  },
  {
    id: "tech-5",
    name: "Omar Tazi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar",
    rating: 4.9,
    reviewCount: 203,
    location: "Tanger",
    phoneNumber: "0539456123",
    whatsappNumber: "212539456123",
    specialties: ["Réparation avancée", "Microsoudure", "Récupération de données"],
    experience: "12 ans",
    description: "Expert en réparations complexes et récupération de données. Spécialisé en microsoudure.",
    services: [
      {
        name: "Microsoudure",
        price: 1500,
        duration: "1-2 jours",
        description: "Réparation de composants électroniques par microsoudure"
      },
      {
        name: "Récupération de données",
        price: 800,
        duration: "2-5 jours",
        description: "Récupération de données perdues ou corrompues"
      },
      {
        name: "Réparation carte mère avancée",
        price: 2000,
        duration: "3-7 jours",
        description: "Réparation complexe de carte mère avec garantie"
      }
    ],
    availability: {
      status: 'available'
    },
    certifications: ["Expert microsoudure", "Certification récupération données"],
    languages: ["Arabe", "Français", "Anglais", "Espagnol"],
    workingHours: {
      monday: "8h00 - 17h00",
      tuesday: "8h00 - 17h00",
      wednesday: "8h00 - 17h00",
      thursday: "8h00 - 17h00",
      friday: "8h00 - 17h00",
      saturday: "9h00 - 14h00",
      sunday: "Fermé"
    },
    isPremium: true,
    isVerified: true,
    responseTime: "< 1 heure",
    completedJobs: 1800,
    joinedDate: "2018-05-12",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80",
      "https://images.unsplash.com/photo-1609592806596-4d8b5b1d7e7e?w=400&q=80"
    ]
  }
];

export const getTechniciansByLocation = (location: string) => {
  return mockTechnicians.filter(tech => 
    tech.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const getTechniciansBySpecialty = (specialty: string) => {
  return mockTechnicians.filter(tech => 
    tech.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};

export const getAvailableTechnicians = () => {
  return mockTechnicians.filter(tech => tech.availability.status === 'available');
};

export const getPremiumTechnicians = () => {
  return mockTechnicians.filter(tech => tech.isPremium);
};

export const getVerifiedTechnicians = () => {
  return mockTechnicians.filter(tech => tech.isVerified);
};

export const getTechnicianById = (id: string) => {
  return mockTechnicians.find(tech => tech.id === id);
};