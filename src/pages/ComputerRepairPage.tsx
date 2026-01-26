import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getComputerRepairServices, ComputerRepairWithRelations } from '@/lib/supabase/computers';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { getNeighborhoodsByCity, Neighborhood } from '@/lib/supabase/neighborhoods';
import { apiCache, SimpleCache } from '@/lib/cache';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  Wrench,
  MapPin,
  Search,
  Filter,
  Store,
  Phone,
  MessageCircle,
  HardDrive,
} from 'lucide-react';

export default function ComputerRepairPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const [services, setServices] = useState<ComputerRepairWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [cityId, setCityId] = useState(searchParams.get('city') || '');
  const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get('neighborhood') || '');
  const [page, setPage] = useState(1);
  
  // Debounce search keyword for better performance
  const debouncedKeyword = useDebounce(keyword, 400);
  const loadingRef = useRef(false);

  const labels = {
    title: isRTL ? 'إصلاح الحواسيب' : 'Réparation Informatique',
    subtitle: isRTL ? 'ابحث عن خدمات إصلاح الحواسيب' : 'Trouvez des services de réparation informatique',
    search: isRTL ? 'ابحث عن خدمة...' : 'Rechercher un service...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    allNeighborhoods: isRTL ? 'جميع الأحياء' : 'Tous les quartiers',
    noResults: isRTL ? 'لا توجد خدمات متاحة' : 'Aucun service disponible',
    noResultsHint: isRTL ? 'حاول تغيير معايير البحث' : 'Essayez de modifier vos critères de recherche',
    loadMore: isRTL ? 'تحميل المزيد' : 'Charger plus',
    results: isRTL ? 'نتيجة' : 'résultats',
    shop: isRTL ? 'متجر' : 'Boutique',
    contact: isRTL ? 'تواصل' : 'Contacter',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir détails',
    from: isRTL ? 'من' : 'À partir de',
  };

  useEffect(() => {
    const loadCities = async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    };
    loadCities();
  }, []);

  // Load neighborhoods when city changes
  useEffect(() => {
    const loadNeighborhoods = async () => {
      if (!cityId) {
        setNeighborhoods([]);
        setNeighborhoodId('');
        return;
      }
      const neighborhoodsData = await getNeighborhoodsByCity(cityId);
      setNeighborhoods(neighborhoodsData);
    };
    loadNeighborhoods();
  }, [cityId]);

  useEffect(() => {
    const loadServices = async () => {
      // Prevent duplicate requests
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      
      const filters: any = {};

      if (debouncedKeyword) filters.search = debouncedKeyword;
      if (cityId) filters.cityId = cityId;

      // Generate cache key
      const cacheKey = SimpleCache.generateKey('computer-repair', { ...filters, page, perPage: 20 });
      
      // Check cache first
      const cached = apiCache.get<{ data: ComputerRepairWithRelations[]; count: number }>(cacheKey);
      if (cached && page === 1) {
        setServices(cached.data || []);
        setTotalCount(cached.count);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      try {
        const { data, count } = await getComputerRepairServices(filters, { page, perPage: 20 });
        
        // Cache the result
        if (page === 1) {
          apiCache.set(cacheKey, { data: data || [], count: count || 0 }, 3 * 60 * 1000); // 3 minutes cache
          setServices(data || []);
        } else {
          setServices(prev => [...prev, ...(data || [])]);
        }
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error loading computer repair services:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadServices();
  }, [debouncedKeyword, cityId, page]);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (cityId) params.set('city', cityId);
    if (neighborhoodId) params.set('neighborhood', neighborhoodId);
    setSearchParams(params);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getServiceName = (service: ComputerRepairWithRelations) => {
    if (language === 'ar' && service.service_name_ar) return service.service_name_ar;
    return service.service_name_fr || service.service_name_ar || '';
  };

  const getServiceDescription = (service: ComputerRepairWithRelations) => {
    if (language === 'ar' && service.description_ar) return service.description_ar;
    return service.description_fr || service.description_ar || '';
  };



  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      <BannerSlot page="computer-repair" slot="top" />

      {/* Header */}
      <section className="py-4 sm:py-6 md:py-8 px-4 md:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className={cn('flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4', isRTL && 'sm:flex-row-reverse')}>
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wrench className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className={cn('text-2xl sm:text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
                <p className={cn('text-sm sm:text-base text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-5xl mx-auto">
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] gap-3', isRTL && 'lg:grid-flow-dense')}>
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400', isRTL ? 'right-3' : 'left-3')} />
                  <Input
                    placeholder={labels.search}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className={cn(isRTL ? 'pr-10' : 'pl-10')}
                  />
                </div>
              </div>

              <Select value={cityId || 'all'} onValueChange={(v) => { setCityId(v === 'all' ? '' : v); setPage(1); }}>
                <SelectTrigger className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={labels.allCities} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{labels.allCities}</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {getCityName(city, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Neighborhood filter - only show when city is selected */}
              {cityId && (
                <Select value={neighborhoodId || 'all'} onValueChange={(v) => { setNeighborhoodId(v === 'all' ? '' : v); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={labels.allNeighborhoods} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{labels.allNeighborhoods}</SelectItem>
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood.id} value={neighborhood.id}>
                        {neighborhood.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}



              <Button onClick={handleSearch} className="w-full lg:w-auto">
                <Search className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                {isRTL ? 'بحث' : 'Rechercher'}
              </Button>
            </div>

            {/* Results count */}
            <div className={cn('mt-3 text-sm text-gray-600', isRTL && 'text-right')}>
              {totalCount} {labels.results}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{labels.noResults}</h3>
              <p className="text-gray-500">{labels.noResultsHint}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-4">
                      <div className={cn('flex items-start gap-3 mb-3', isRTL && 'flex-row-reverse')}>
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <Wrench className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn('font-semibold text-lg line-clamp-2 mb-1', isRTL && 'text-right')}>
                            {getServiceName(service)}
                          </h3>
                          {service.store && (
                            <p className={cn('text-sm text-gray-600 flex items-center gap-1', isRTL && 'flex-row-reverse justify-end')}>
                              <Store className="h-3 w-3" />
                              {language === 'ar' && service.store.name_ar 
                                ? service.store.name_ar 
                                : service.store.name_fr}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Service Type Badge */}
                      <div className={cn('mb-3', isRTL && 'text-right')}>
                        <Badge className="bg-green-600">
                          {isRTL ? 'خدمة إصلاح' : 'Service de réparation'}
                        </Badge>
                      </div>

                      {/* Description */}
                      {getServiceDescription(service) && (
                        <p className={cn('text-sm text-gray-600 line-clamp-3 mb-3', isRTL && 'text-right')}>
                          {getServiceDescription(service)}
                        </p>
                      )}

                      {/* Location */}
                      {service.city && (
                        <p className={cn('text-sm text-gray-600 flex items-center gap-1 mb-3', isRTL && 'flex-row-reverse justify-end')}>
                          <MapPin className="h-3 w-3" />
                          {getCityName(service.city as City, language)}
                          {(service.neighborhood || service.neighborhood_custom) && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{service.neighborhood ? service.neighborhood.name : service.neighborhood_custom}</span>
                            </>
                          )}
                        </p>
                      )}

                      {/* Price */}
                      {service.price && !service.price_on_request && (
                        <p className={cn('font-semibold text-green-600 mb-3', isRTL && 'text-right')}>
                          {labels.from} {formatPrice(service.price)}
                        </p>
                      )}
                      {service.price_on_request && (
                        <p className={cn('font-semibold text-green-600 mb-3', isRTL && 'text-right')}>
                          {isRTL ? 'السعر عند الطلب' : 'Prix sur demande'}
                        </p>
                      )}

                      {/* Contact buttons */}
                      <div className={cn('flex gap-2 mt-3', isRTL && 'flex-row-reverse')}>
                        {service.whatsapp && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`https://wa.me/${service.whatsapp}`, '_blank');
                            }}
                          >
                            <MessageCircle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                            WhatsApp
                          </Button>
                        )}
                        {service.phone && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`tel:${service.phone}`, '_blank');
                            }}
                          >
                            <Phone className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                            {isRTL ? 'اتصال' : 'Appeler'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {services.length < totalCount && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                  >
                    {loading ? (isRTL ? 'جاري التحميل...' : 'Chargement...') : labels.loadMore}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <BannerSlot page="computer-repair" slot="bottom" />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
