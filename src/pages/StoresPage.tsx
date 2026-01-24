import { useState, useEffect, useRef, useCallback } from 'react';
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
import { getStores, StoreWithRelations, getStoreName } from '@/lib/supabase/stores';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { getNeighborhoodsByCity, Neighborhood } from '@/lib/supabase/neighborhoods';
import { apiCache, SimpleCache } from '@/lib/cache';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  Store,
  User,
  MapPin,
  Search,
  Filter,
  Star,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function StoresPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const [stores, setStores] = useState<StoreWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [cityId, setCityId] = useState(searchParams.get('city') || '');
  const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get('neighborhood') || '');
  const [storeType, setStoreType] = useState<'all' | 'shop' | 'individual'>(
    (searchParams.get('type') as 'all' | 'shop' | 'individual') || 'all'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Debounce search keyword for better performance
  const debouncedKeyword = useDebounce(keyword, 400);
  const loadingRef = useRef(false);
  const ITEMS_PER_PAGE = 12;

  const labels = {
    title: isRTL ? 'المتاجر والبائعين' : 'Boutiques et Vendeurs',
    subtitle: isRTL ? 'تصفح جميع المتاجر والبائعين المعتمدين' : 'Parcourez toutes les boutiques et vendeurs vérifiés',
    search: isRTL ? 'ابحث عن متجر...' : 'Rechercher une boutique...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    allNeighborhoods: isRTL ? 'جميع الأحياء' : 'Tous les quartiers',
    allTypes: isRTL ? 'جميع الأنواع' : 'Tous les types',
    shop: isRTL ? 'متجر' : 'Boutique',
    individual: isRTL ? 'فرد' : 'Particulier',
    noResults: isRTL ? 'لا توجد متاجر متاحة' : 'Aucune boutique disponible',
    noResultsHint: isRTL ? 'حاول تغيير معايير البحث' : 'Essayez de modifier vos critères',
    loadMore: isRTL ? 'تحميل المزيد' : 'Charger plus',
    results: isRTL ? 'نتيجة' : 'résultats',
    viewStore: isRTL ? 'عرض المتجر' : 'Voir la boutique',
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

  const loadStores = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    const filters: any = {};
    if (debouncedKeyword) filters.keyword = debouncedKeyword;
    if (cityId) filters.cityId = cityId;
    if (neighborhoodId) filters.neighborhoodId = neighborhoodId;
    if (storeType !== 'all') filters.storeType = storeType;

    // Generate cache key
    const cacheKey = SimpleCache.generateKey('stores', { ...filters, page, limit: ITEMS_PER_PAGE });
    
    // Check cache first
    const cached = apiCache.get<{ data: StoreWithRelations[]; count: number }>(cacheKey);
    if (cached) {
      setStores(cached.data);
      setTotalCount(cached.count);
      setTotalPages(Math.ceil(cached.count / ITEMS_PER_PAGE));
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    try {
      const { data, count } = await getStores(filters, { page, limit: ITEMS_PER_PAGE });
      
      // Cache the result
      apiCache.set(cacheKey, { data, count }, 3 * 60 * 1000); // 3 minutes cache
      
      setStores(data);
      setTotalCount(count);
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [debouncedKeyword, cityId, neighborhoodId, storeType, page]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (cityId) params.set('city', cityId);
    if (neighborhoodId) params.set('neighborhood', neighborhoodId);
    if (storeType !== 'all') params.set('type', storeType);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      <BannerSlot page="stores" slot="top" />

      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className={cn('flex items-center gap-3 mb-4', isRTL && 'flex-row-reverse')}>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className={cn('text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
              <p className={cn('text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className={cn('flex flex-wrap gap-3', isRTL && 'flex-row-reverse')}>
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
              <SelectTrigger className="w-full sm:w-[180px]">
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

            {/* Neighborhood filter - only show when city is selected */}
            {cityId && (
              <Select value={neighborhoodId || 'all'} onValueChange={(v) => { setNeighborhoodId(v === 'all' ? '' : v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
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

            <Select value={storeType} onValueChange={(v) => { setStoreType(v as any); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allTypes}</SelectItem>
                <SelectItem value="shop">{labels.shop}</SelectItem>
                <SelectItem value="individual">{labels.individual}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="w-full sm:w-auto">
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
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-16">
              <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{labels.noResults}</h3>
              <p className="text-gray-500">{labels.noResultsHint}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {stores.map((store) => (
                  <Link key={store.id} to={`/stores/${store.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6">
                        {/* Store Avatar */}
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {store.images && store.images[0] ? (
                            <img src={store.images[0].image_url} alt={getStoreName(store, language)} className="w-full h-full object-cover rounded-full" />
                          ) : store.store_type === 'shop' ? (
                            <Store className="h-10 w-10 text-primary" />
                          ) : (
                            <User className="h-10 w-10 text-primary" />
                          )}
                        </div>

                        {/* Store Name */}
                        <h3 className="text-xl font-semibold text-center mb-2">
                          {getStoreName(store, language)}
                        </h3>

                        {/* Type Badge */}
                        <div className="flex justify-center mb-3">
                          <Badge variant="secondary">
                            {store.store_type === 'shop' ? (
                              <><Store className="h-3 w-3 mr-1" />{labels.shop}</>
                            ) : (
                              <><User className="h-3 w-3 mr-1" />{labels.individual}</>
                            )}
                          </Badge>
                        </div>

                        {/* Rating */}
                        {store.rating_avg > 0 && (
                          <div className="flex items-center justify-center gap-1 mb-3">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{store.rating_avg.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({store.rating_count})</span>
                          </div>
                        )}

                        {/* Location */}
                        {store.city && (
                          <p className="text-sm text-gray-600 text-center mb-4 flex items-center justify-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {getCityName(store.city as City, language)}
                            {(store.neighborhood || store.neighborhood_custom) && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{store.neighborhood ? store.neighborhood.name : store.neighborhood_custom}</span>
                              </>
                            )}
                          </p>
                        )}

                        {/* Contact Buttons */}
                        <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                          {store.whatsapp && (
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://wa.me/${store.whatsapp}`, '_blank');
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {store.phone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`tel:${store.phone}`, '_blank');
                              }}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                  >
                    {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {isRTL ? `${page} من ${totalPages}` : `${page} sur ${totalPages}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                  >
                    {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <BannerSlot page="stores" slot="bottom" />

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  );
}
