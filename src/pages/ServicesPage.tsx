import { useState, useEffect } from 'react';
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
import { getRepairServices, ServiceWithRelations, getServiceName, getStoreName } from '@/lib/supabase/stores';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { cn } from '@/lib/utils';
import {
  Wrench,
  MapPin,
  Search,
  Store,
  User,
  Phone,
  MessageCircle,
  Clock,
  Star,
  AlertCircle,
} from 'lucide-react';

export default function ServicesPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const [services, setServices] = useState<ServiceWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [cityId, setCityId] = useState(searchParams.get('city') || '');
  const [page, setPage] = useState(1);

  const labels = {
    title: isRTL ? 'خدمات الإصلاح' : 'Services de Réparation',
    subtitle: isRTL ? 'تقنيون ومحترفون في إصلاح الهواتف' : 'Techniciens et professionnels de la réparation',
    search: isRTL ? 'ابحث عن خدمة...' : 'Rechercher un service...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    noResults: isRTL ? 'لا توجد خدمات متاحة' : 'Aucun service disponible',
    noResultsHint: isRTL ? 'حاول تغيير معايير البحث' : 'Essayez de modifier vos critères',
    loadMore: isRTL ? 'تحميل المزيد' : 'Charger plus',
    results: isRTL ? 'نتيجة' : 'résultats',
    shop: isRTL ? 'متجر' : 'Boutique',
    individual: isRTL ? 'فرد' : 'Particulier',
    priceOnRequest: isRTL ? 'السعر عند الطلب' : 'Prix sur demande',
    duration: isRTL ? 'المدة' : 'Durée',
    emergency: isRTL ? 'خدمة طوارئ' : 'Service urgence',
    viewStore: isRTL ? 'عرض المتجر' : 'Voir la boutique',
  };

  useEffect(() => {
    const loadCities = async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const filters: any = {};
      if (keyword) filters.keyword = keyword;
      if (cityId) filters.cityId = cityId;

      const { data, count } = await getRepairServices(filters, { page, limit: 12 });
      setServices(page === 1 ? data : [...services, ...data]);
      setTotalCount(count);
      setLoading(false);
    };
    loadServices();
  }, [keyword, cityId, page]);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (cityId) params.set('city', cityId);
    setSearchParams(params);
  };

  const formatPrice = (price: number | null, priceOnRequest: boolean) => {
    if (priceOnRequest || !price) return labels.priceOnRequest;
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency', currency: 'MAD', maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      <BannerSlot page="services" slot="top" />

      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className={cn('flex items-center gap-3 mb-4', isRTL && 'flex-row-reverse')}>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className={cn('text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
              <p className={cn('text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className={cn('flex flex-wrap gap-4 mt-6', isRTL && 'flex-row-reverse')}>
            <div className="flex-1 min-w-[200px]">
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
              <SelectTrigger className="w-[180px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder={labels.allCities} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allCities}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>{getCityName(city, language)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>
              <Search className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
              {isRTL ? 'بحث' : 'Rechercher'}
            </Button>
          </div>

          <div className={cn('mt-4 text-sm text-gray-600', isRTL && 'text-right')}>
            {totalCount} {labels.results}
          </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
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
                  <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Service Name */}
                      <h3 className={cn('text-xl font-semibold mb-2', isRTL && 'text-right')}>
                        {getServiceName(service, language)}
                      </h3>

                      {/* Store Info */}
                      {service.store && (
                        <Link to={`/stores/${service.store.slug}`} className="block mb-4">
                          <div className={cn('flex items-center gap-2 text-sm text-gray-600 hover:text-primary', isRTL && 'flex-row-reverse')}>
                            {service.store.store_type === 'shop' ? (
                              <Store className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                            <span>{getStoreName(service.store, language)}</span>
                            {service.store.rating_avg > 0 && (
                              <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                {service.store.rating_avg.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </Link>
                      )}

                      {/* Location */}
                      {service.city && (
                        <p className={cn('text-sm text-gray-600 flex items-center gap-1 mb-3', isRTL && 'flex-row-reverse justify-end')}>
                          <MapPin className="h-3 w-3" />
                          {getCityName(service.city as City, language)}
                          {service.neighborhood_custom && ` - ${service.neighborhood_custom}`}
                        </p>
                      )}

                      {/* Device Types */}
                      {service.device_types && service.device_types.length > 0 && (
                        <div className={cn('flex flex-wrap gap-1 mb-3', isRTL && 'flex-row-reverse')}>
                          {service.device_types.slice(0, 3).map((device, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {device}
                            </Badge>
                          ))}
                          {service.device_types.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.device_types.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Price & Duration */}
                      <div className={cn('flex items-center justify-between mb-4', isRTL && 'flex-row-reverse')}>
                        <span className="font-bold text-lg text-orange-600">
                          {formatPrice(service.price, service.price_on_request)}
                        </span>
                        {service.estimated_duration && (
                          <span className={cn('text-sm text-gray-500 flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                            <Clock className="h-3 w-3" />
                            {service.estimated_duration}
                          </span>
                        )}
                      </div>

                      {/* Emergency Service Badge */}
                      {service.store?.emergency_service && (
                        <Badge variant="destructive" className={cn('mb-4 flex items-center gap-1 w-fit', isRTL && 'flex-row-reverse')}>
                          <AlertCircle className="h-3 w-3" />
                          {labels.emergency}
                        </Badge>
                      )}

                      {/* Contact Buttons */}
                      <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                        {service.whatsapp && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(`https://wa.me/${service.whatsapp}`, '_blank')}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {service.phone && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => window.open(`tel:${service.phone}`, '_blank')}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {services.length < totalCount && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" onClick={() => setPage(p => p + 1)} disabled={loading}>
                    {loading ? (isRTL ? 'جاري التحميل...' : 'Chargement...') : labels.loadMore}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <BannerSlot page="services" slot="bottom" />

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  );
}
