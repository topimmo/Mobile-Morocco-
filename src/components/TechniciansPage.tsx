import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navigation from './Navigation';
import TechnicianListing from './TechnicianListing';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { MapPin, Star, Phone, Mail, MessageCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTechnicians, Technician } from '../data/mockTechnicians';
import { SEO } from './SEO';
import { supabase } from '@/lib/supabase/client';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDebounce } from '@/hooks/useDebounce';
import { apiCache, SimpleCache } from '@/lib/cache';
import { cn } from '@/lib/utils';

// DB Technician interface for future database integration
interface DBTechnician {
  id: string;
  user_id: string;
  name_fr: string;
  name_ar: string;
  specialty_fr: string;
  specialty_ar: string;
  city_id: string | null;
  neighborhood_custom: string | null;
  phone: string;
  whatsapp: string | null;
  rating_avg: number;
  rating_count: number;
  is_verified: boolean;
  is_premium: boolean;
  status: 'approved' | 'pending' | 'rejected';
  city?: City | null;
}

// Convert DB technician to UI format
function convertDBTechnicianToUI(dbTech: DBTechnician, language: 'fr' | 'ar'): Technician {
  return {
    id: dbTech.id,
    name: language === 'ar' ? dbTech.name_ar : dbTech.name_fr,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbTech.id}`,
    rating: dbTech.rating_avg || 4.5,
    reviewCount: dbTech.rating_count || 0,
    location: dbTech.city ? getCityName(dbTech.city, language) : (dbTech.neighborhood_custom || ''),
    phoneNumber: dbTech.phone,
    whatsappNumber: dbTech.whatsapp || dbTech.phone,
    specialties: [(language === 'ar' ? dbTech.specialty_ar : dbTech.specialty_fr)],
    experience: '5+ ans',
    description: language === 'ar' ? dbTech.specialty_ar : dbTech.specialty_fr,
    services: [],
    availability: { status: 'available' },
    certifications: [],
    languages: ['Arabe', 'Français'],
    workingHours: { monday: '9:00-18:00', tuesday: '9:00-18:00', wednesday: '9:00-18:00', thursday: '9:00-18:00', friday: '9:00-18:00', saturday: '9:00-14:00', sunday: 'Fermé' },
    isPremium: dbTech.is_premium,
    isVerified: dbTech.is_verified,
    responseTime: '< 1h',
    completedJobs: dbTech.rating_count * 3 || 0,
    joinedDate: '2024',
    gallery: []
  };
}

export default function TechniciansPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(mockTechnicians);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(true);
  
  // Filter states
  const [locationFilter, setLocationFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  
  // Debounce search for better performance
  const debouncedSearch = useDebounce(searchQuery, 400);

  const featuredTechnicians = [
    {
      id: 1,
      name: "Ahmed Benali",
      specialty: "Réparation iPhone",
      rating: 4.8,
      reviews: 156,
      location: "Casablanca",
      phone: "+212 6 12 34 56 78",
      email: "ahmed@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      specialty: "Réparation Samsung",
      rating: 4.9,
      reviews: 203,
      location: "Rabat",
      phone: "+212 6 87 65 43 21",
      email: "fatima@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima"
    },
    {
      id: 3,
      name: "Omar Alami",
      specialty: "Déblocage & Software",
      rating: 4.7,
      reviews: 89,
      location: "Marrakech",
      phone: "+212 6 11 22 33 44",
      email: "omar@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar"
    }
  ];

  const applyFilters = () => {
    let filtered = [...technicians];

    // Location filter
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(tech => 
        tech.location && tech.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Specialty filter
    if (specialtyFilter && specialtyFilter !== 'all') {
      filtered = filtered.filter(tech => 
        tech.specialties && tech.specialties.some(specialty => 
          specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
        )
      );
    }

    // Availability filter
    if (availabilityFilter && availabilityFilter !== 'all') {
      filtered = filtered.filter(tech => 
        tech.availability && tech.availability.status === availabilityFilter
      );
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(tech => tech.rating >= ratingFilter);
    }

    // Search filter (use debounced value)
    if (debouncedSearch) {
      filtered = filtered.filter(tech =>
        (tech.name && tech.name.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (tech.specialties && tech.specialties.some(specialty => 
          specialty.toLowerCase().includes(debouncedSearch.toLowerCase())
        )) ||
        (tech.description && tech.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'experience':
        filtered.sort((a, b) => {
          const aExp = parseInt(a.experience || '0');
          const bExp = parseInt(b.experience || '0');
          return bExp - aExp;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const aMinPrice = a.services && a.services.length > 0 ? Math.min(...a.services.map(s => s.price || 0)) : 0;
          const bMinPrice = b.services && b.services.length > 0 ? Math.min(...b.services.map(s => s.price || 0)) : 0;
          return aMinPrice - bMinPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aMaxPrice = a.services && a.services.length > 0 ? Math.max(...a.services.map(s => s.price || 0)) : 0;
          const bMaxPrice = b.services && b.services.length > 0 ? Math.max(...b.services.map(s => s.price || 0)) : 0;
          return bMaxPrice - aMaxPrice;
        });
        break;
      default:
        // Sort by premium status and rating by default
        filtered.sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    setFilteredTechnicians(filtered);
  };

  // Try to load technicians from DB, fallback to mock data
  useEffect(() => {
    const loadTechnicians = async () => {
      setLoading(true);
      try {
        // Load cities for filtering
        const citiesData = await getCities();
        setCities(citiesData);

        // Try to fetch technicians from profiles table (if available)
        // This is prepared for future DB integration
        const { data: dbTechnicians, error }: { data: any[] | null; error: any } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('user_type', 'technician')
          .eq('status', 'approved');

        if (!error && dbTechnicians && dbTechnicians.length > 0) {
          // Convert DB technicians to UI format
          const convertedTechnicians = dbTechnicians.map((t: any) => convertDBTechnicianToUI(t, language as 'fr' | 'ar'));
          setTechnicians(convertedTechnicians);
          setFilteredTechnicians(convertedTechnicians);
          setUsingMockData(false);
        } else {
          // Fallback to mock data
          setTechnicians(mockTechnicians);
          setFilteredTechnicians(mockTechnicians);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error loading technicians:', err);
        // Fallback to mock data
        setTechnicians(mockTechnicians);
        setFilteredTechnicians(mockTechnicians);
        setUsingMockData(true);
      }
      setLoading(false);
    };
    loadTechnicians();
  }, [language]);

  // Apply filters whenever dependencies change (use debounced search)
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [locationFilter, specialtyFilter, availabilityFilter, ratingFilter, debouncedSearch, sortBy, technicians]);

  const labels = {
    title: isRTL ? 'فنيون معتمدون' : 'Techniciens Certifiés',
    subtitle: isRTL ? 'ابحث عن فني مؤهل بالقرب منك' : 'Trouvez des techniciens qualifiés près de chez vous',
    search: isRTL ? 'ابحث عن فني...' : 'Rechercher un technicien...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    allSpecialties: isRTL ? 'جميع التخصصات' : 'Toutes spécialités',
    filterByRating: isRTL ? 'تصفية حسب التقييم' : 'Filtrer par note',
    sortBy: isRTL ? 'ترتيب حسب' : 'Trier par',
    default: isRTL ? 'الافتراضي' : 'Par défaut',
    rating: isRTL ? 'التقييم' : 'Note',
    experience: isRTL ? 'الخبرة' : 'Expérience',
    contact: isRTL ? 'تواصل' : 'Contacter',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    call: isRTL ? 'اتصل' : 'Appeler',
    verified: isRTL ? 'موثق' : 'Vérifié',
    premium: isRTL ? 'مميز' : 'Premium',
    noResults: isRTL ? 'لا توجد نتائج' : 'Aucun résultat',
    demoData: isRTL ? 'بيانات تجريبية' : 'Données de démonstration',
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title="Techniciens Certifiés - Réparation Mobile"
        description="Trouvez des techniciens qualifiés pour réparer votre téléphone au Maroc. iPhone, Samsung, Xiaomi et toutes marques. Réparation écran, batterie, et plus."
        canonical="/technicians"
        keywords="techniciens réparation Maroc, réparation téléphone Casablanca, réparer iPhone Maroc, Samsung repair Morocco"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Techniciens Certifiés</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez des techniciens qualifiés près de chez vous pour tous vos besoins de réparation mobile
          </p>
        </div>

        {/* Featured Technicians */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Techniciens Recommandés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTechnicians.map((tech) => (
              <Card key={tech.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                  <p className="text-sm text-gray-600">{tech.specialty}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tech.rating}</span>
                    <span className="text-gray-500">({tech.reviews} avis)</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {tech.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {tech.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {tech.email}
                  </div>
                  
                  <Button className="w-full mt-4">
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Technicians */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tous les Techniciens</h2>
          <TechnicianListing />
        </div>
      </div>
    </div>
  );
}