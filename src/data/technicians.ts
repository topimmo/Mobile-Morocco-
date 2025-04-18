import { Technician } from "../types/technician";

export const technicians: Technician[] = [
  {
    id: "tech1",
    name: "محمد أمين",
    city: "الدار البيضاء",
    services: ["إصلاح الشاشة", "استبدال البطارية", "إصلاح البرمجيات"],
    contact: {
      phone: "+212 6XX-XXXXXX",
      whatsapp: "+212 6XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    ],
    rating: 4.8,
    reviewCount: 56,
  },
  {
    id: "tech2",
    name: "سمير العلوي",
    city: "الرباط",
    services: ["فتح القفل", "استعادة البيانات", "تثبيت التطبيقات"],
    contact: {
      phone: "+212 7XX-XXXXXX",
      email: "samir@example.com",
    },
    rating: 4.5,
    reviewCount: 42,
  },
  {
    id: "tech3",
    name: "فاطمة الزهراء",
    city: "مراكش",
    services: ["إصلاح الشاشة", "استبدال البطارية", "تشخيص الأعطال"],
    contact: {
      phone: "+212 6XX-XXXXXX",
      whatsapp: "+212 6XX-XXXXXX",
      email: "fatima@example.com",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
    ],
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: "tech4",
    name: "يوسف المرابط",
    city: "طنجة",
    services: ["إصلاح البرمجيات", "تحديث النظام", "إزالة الفيروسات"],
    contact: {
      phone: "+212 6XX-XXXXXX",
    },
    rating: 4.2,
    reviewCount: 31,
  },
  {
    id: "tech5",
    name: "أمينة الحسني",
    city: "فاس",
    services: ["إصلاح الشاشة", "استبدال القطع", "صيانة عامة"],
    contact: {
      phone: "+212 7XX-XXXXXX",
      whatsapp: "+212 7XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    ],
    rating: 4.7,
    reviewCount: 63,
  },
  {
    id: "tech6",
    name: "كريم بنعلي",
    city: "الدار البيضاء",
    services: ["فتح القفل", "تثبيت التطبيقات", "إصلاح البرمجيات"],
    contact: {
      phone: "+212 6XX-XXXXXX",
      email: "karim@example.com",
    },
    rating: 4.6,
    reviewCount: 47,
  },
  {
    id: "tech7",
    name: "نادية الشرقاوي",
    city: "مكناس",
    services: ["استبدال البطارية", "إصلاح الشاشة", "صيانة عامة"],
    contact: {
      phone: "+212 7XX-XXXXXX",
      whatsapp: "+212 7XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    ],
    rating: 4.4,
    reviewCount: 38,
  },
  {
    id: "tech8",
    name: "عبد الله الناصري",
    city: "أكادير",
    services: ["تشخيص الأعطال", "استعادة البيانات", "إزالة الفيروسات"],
    contact: {
      phone: "+212 6XX-XXXXXX",
      email: "abdullah@example.com",
    },
    rating: 4.3,
    reviewCount: 29,
  },
];

// French version of the technicians data
export const techniciensFr: Technician[] = [
  {
    id: "tech1",
    name: "Mohammed Amine",
    city: "Casablanca",
    services: [
      "Réparation d'écran",
      "Remplacement de batterie",
      "Réparation logicielle",
    ],
    contact: {
      phone: "+212 6XX-XXXXXX",
      whatsapp: "+212 6XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    ],
    rating: 4.8,
    reviewCount: 56,
  },
  {
    id: "tech2",
    name: "Samir Alaoui",
    city: "Rabat",
    services: [
      "Déverrouillage",
      "Récupération de données",
      "Installation d'applications",
    ],
    contact: {
      phone: "+212 7XX-XXXXXX",
      email: "samir@example.com",
    },
    rating: 4.5,
    reviewCount: 42,
  },
  {
    id: "tech3",
    name: "Fatima Zahra",
    city: "Marrakech",
    services: [
      "Réparation d'écran",
      "Remplacement de batterie",
      "Diagnostic de pannes",
    ],
    contact: {
      phone: "+212 6XX-XXXXXX",
      whatsapp: "+212 6XX-XXXXXX",
      email: "fatima@example.com",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
    ],
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: "tech4",
    name: "Youssef Morabit",
    city: "Tanger",
    services: [
      "Réparation logicielle",
      "Mise à jour système",
      "Suppression de virus",
    ],
    contact: {
      phone: "+212 6XX-XXXXXX",
    },
    rating: 4.2,
    reviewCount: 31,
  },
  {
    id: "tech5",
    name: "Amina Hassani",
    city: "Fès",
    services: [
      "Réparation d'écran",
      "Remplacement de pièces",
      "Maintenance générale",
    ],
    contact: {
      phone: "+212 7XX-XXXXXX",
      whatsapp: "+212 7XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    ],
    rating: 4.7,
    reviewCount: 63,
  },
  {
    id: "tech6",
    name: "Karim Benali",
    city: "Casablanca",
    services: [
      "Déverrouillage",
      "Installation d'applications",
      "Réparation logicielle",
    ],
    contact: {
      phone: "+212 6XX-XXXXXX",
      email: "karim@example.com",
    },
    rating: 4.6,
    reviewCount: 47,
  },
  {
    id: "tech7",
    name: "Nadia Cherkaoui",
    city: "Meknès",
    services: [
      "Remplacement de batterie",
      "Réparation d'écran",
      "Maintenance générale",
    ],
    contact: {
      phone: "+212 7XX-XXXXXX",
      whatsapp: "+212 7XX-XXXXXX",
    },
    portfolio: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80",
    ],
    rating: 4.4,
    reviewCount: 38,
  },
  {
    id: "tech8",
    name: "Abdallah Nassiri",
    city: "Agadir",
    services: [
      "Diagnostic de pannes",
      "Récupération de données",
      "Suppression de virus",
    ],
    contact: {
      phone: "+212 6XX-XXXXXX",
      email: "abdullah@example.com",
    },
    rating: 4.3,
    reviewCount: 29,
  },
];
