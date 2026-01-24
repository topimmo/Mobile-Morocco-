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
import { getItems, ItemWithRelations, getItemTitle } from '@/lib/supabase/stores';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { getNeighborhoodsByCity, Neighborhood } from '@/lib/supabase/neighborhoods';
import { cn } from '@/lib/utils';
import {
  Settings,
  MapPin,
  Search,
  Filter,
  Store,
  User,
  Phone,
  MessageCircle,
} from 'lucide-react';

export default function SparePartsPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const [items, setItems] = useState<ItemWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [cityId, setCityId] = useState(searchParams.get('city') || '');
  const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get('neighborhood') || '');
  const [condition, setCondition] = useState<'all' | 'new' | 'used'>(
    (searchParams.get('condition') as 'all' | 'new' | 'used') || 'all'
  );
  const [page, setPage] = useState(1);

  const labels = {
    title: isRTL ? 'قطع الغيار' : 'Pièces Détachées',
    subtitle: isRTL ? 'شاشات، بطاريات، وقطع غيار أصلية' : 'Écrans, batteries et pièces de rechange',
    search: isRTL ? 'ابحث عن قطعة غيار...' : 'Rechercher une pièce...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    allNeighborhoods: isRTL ? 'جميع الأحياء' : 'Tous les quartiers',
    allConditions: isRTL ? 'جميع الحالات' : 'Toutes conditions',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    noResults: isRTL ? 'لا توجد قطع غيار متاحة' : 'Aucune pièce disponible',
    noResultsHint: isRTL ? 'حاول تغيير معايير البحث' : 'Essayez de modifier vos critères',
    loadMore: isRTL ? 'تحميل المزيد' : 'Charger plus',
    results: isRTL ? 'نتيجة' : 'résultats',
    shop: isRTL ? 'متجر' : 'Boutique',
    individual: isRTL ? 'فرد' : 'Particulier',
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
      try {
        const neighborhoodsData = await getNeighborhoodsByCity(cityId);
        setNeighborhoods(neighborhoodsData);
      } catch (error) {
        console.error('Error loading neighborhoods:', error);
        setNeighborhoods([]);
      }
    };
    loadNeighborhoods();
  }, [cityId]);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const filters: any = { itemType: 'spare_part' };
      if (keyword) filters.keyword = keyword;
      if (cityId) filters.cityId = cityId;
      if (neighborhoodId) filters.neighborhoodId = neighborhoodId;
      if (condition !== 'all') filters.condition = condition;

      const { data, count } = await getItems(filters, { page, limit: 12 });
      setItems(page === 1 ? data : [...items, ...data]);
      setTotalCount(count);
      setLoading(false);
    };
    loadItems();
  }, [keyword, cityId, neighborhoodId, condition, page]);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (cityId) params.set('city', cityId);
    if (neighborhoodId) params.set('neighborhood', neighborhoodId);
    if (condition !== 'all') params.set('condition', condition);
    setSearchParams(params);
  };

  const formatPrice = (price: number | null, priceText?: string | null) => {
    if (priceText) return priceText;
    if (!price) return isRTL ? 'السعر غير محدد' : 'Prix non spécifié';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency', currency: 'MAD', maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      <BannerSlot page="spare_parts" slot="top" />

      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className={cn('flex items-center gap-3 mb-4', isRTL && 'flex-row-reverse')}>
            <div className="p-3 bg-green-100 rounded-lg">
              <Settings className="h-8 w-8 text-green-600" />
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

            <Select value={condition} onValueChange={(v) => { setCondition(v as any); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{labels.allConditions}</SelectItem>
                <SelectItem value="new">{labels.new}</SelectItem>
                <SelectItem value="used">{labels.used}</SelectItem>
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
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{labels.noResults}</h3>
              <p className="text-gray-500">{labels.noResultsHint}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((item) => (
                  <Link key={item.id} to={`/items/${item.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                      <div className="relative h-48 bg-gray-200">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0].image_url} alt={getItemTitle(item, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Settings className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <Badge className={cn('absolute top-2', isRTL ? 'left-2' : 'right-2', item.condition === 'new' ? 'bg-green-600' : 'bg-orange-500')}>
                          {item.condition === 'new' ? labels.new : labels.used}
                        </Badge>
                        {item.store && (
                          <Badge variant="secondary" className={cn('absolute top-2', isRTL ? 'right-2' : 'left-2')}>
                            {item.store.store_type === 'shop' ? <><Store className="h-3 w-3 mr-1" />{labels.shop}</> : <><User className="h-3 w-3 mr-1" />{labels.individual}</>}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className={cn('font-medium line-clamp-2 mb-2 min-h-[48px]', isRTL && 'text-right')}>{getItemTitle(item, language)}</h3>
                        {item.city && (
                          <p className={cn('text-sm text-gray-600 flex items-center gap-1 mb-2', isRTL && 'flex-row-reverse justify-end')}>
                            <MapPin className="h-3 w-3" />
                            {getCityName(item.city as City, language)}
                            {(item.neighborhood || item.neighborhood_custom) && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{item.neighborhood ? item.neighborhood.name : item.neighborhood_custom}</span>
                              </>
                            )}
                          </p>
                        )}
                        <p className={cn('font-bold text-lg text-green-600', isRTL && 'text-right')}>{formatPrice(item.price, item.price_text)}</p>
                        <div className={cn('flex gap-2 mt-3', isRTL && 'flex-row-reverse')}>
                          {item.whatsapp && (
                            <Button size="sm" variant="outline" className="flex-1 text-green-600 border-green-600 hover:bg-green-50" onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/${item.whatsapp}`, '_blank'); }}>
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {item.phone && (
                            <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.preventDefault(); window.open(`tel:${item.phone}`, '_blank'); }}>
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {items.length < totalCount && (
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

      <BannerSlot page="spare_parts" slot="bottom" />

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  );
}
