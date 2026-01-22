import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { SearchBar, CitySelector, NeighborhoodAutocomplete } from '@/components/search';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { SEO } from '@/components/SEO';
import { getRepairShops, RepairShopWithRelations } from '@/lib/supabase/repairShops';
import { getCityName, City } from '@/lib/supabase/cities';
import { apiCache, SimpleCache } from '@/lib/cache';
import { useDebounce } from '@/hooks/useDebounce';
import { MapPin, Phone, MessageCircle, Wrench, ChevronLeft, ChevronRight, Star, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function RepairShopsPage() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [shops, setShops] = useState<RepairShopWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [cityId, setCityId] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const labels = {
    title: isRTL ? 'محلات الإصلاح' : 'Boutiques de réparation',
    noResults: isRTL ? 'لم يتم العثور على محلات' : 'Aucune boutique trouvée',
    results: isRTL ? 'نتيجة' : 'résultat(s)',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir les détails',
    specialties: isRTL ? 'التخصصات' : 'Spécialités',
    page: isRTL ? 'صفحة' : 'Page',
    of: isRTL ? 'من' : 'sur',
    filters: isRTL ? 'الفلاتر' : 'Filtres',
    city: isRTL ? 'المدينة' : 'Ville',
    neighborhood: isRTL ? 'الحي' : 'Quartier',
    reset: isRTL ? 'إعادة تعيين' : 'Réinitialiser',
    searchPlaceholder: isRTL ? 'بحث عن محل إصلاح...' : 'Rechercher une boutique...',
  };

  const fetchShops = useCallback(async () => {
    setLoading(true);
    
    const { data, count, totalPages: pages } = await getRepairShops(
      {
        search: keyword || undefined,
        cityId: cityId || undefined,
        neighborhoodId: neighborhoodId || undefined,
      },
      { page: currentPage, limit: 12 }
    );

    setShops(data || []);
    setTotalCount(count || 0);
    setTotalPages(pages);
    setLoading(false);
  }, [keyword, cityId, neighborhoodId, currentPage]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleCityChange = (id: string) => {
    setCityId(id);
    setNeighborhoodId('');
    setCurrentPage(1);
  };

  const handleNeighborhoodChange = (id: string) => {
    setNeighborhoodId(id);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setCityId('');
    setNeighborhoodId('');
    setKeyword('');
    setCurrentPage(1);
  };

  const FiltersContent = () => (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <Label className={isRTL ? 'text-right block' : ''}>{labels.city}</Label>
        <CitySelector
          value={cityId}
          onChange={handleCityChange}
          language={language}
          groupByRegion
        />
      </div>

      {cityId && (
        <div className="space-y-2">
          <Label className={isRTL ? 'text-right block' : ''}>{labels.neighborhood}</Label>
          <NeighborhoodAutocomplete
            cityId={cityId}
            value={neighborhoodId}
            onChange={handleNeighborhoodChange}
            language={language}
          />
        </div>
      )}

      {(cityId || neighborhoodId || keyword) && (
        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
          {labels.reset}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isRTL ? 'محلات الإصلاح - فنيين معتمدين' : 'Boutiques de réparation - Techniciens certifiés'}
        description={isRTL 
          ? 'اعثر على أفضل محلات إصلاح الهواتف في المغرب. فنيين معتمدين لإصلاح iPhone و Samsung وجميع العلامات التجارية.'
          : 'Trouvez les meilleures boutiques de réparation de téléphones au Maroc. Techniciens certifiés pour iPhone, Samsung et toutes marques.'
        }
        canonical="/repair-shops"
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="repair_shops" slot="top" />

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className={cn('text-3xl font-bold mb-4', isRTL && 'text-right')}>
              {labels.title}
            </h1>
            
            {/* Search Bar */}
            <SearchBar
              value={keyword}
              onChange={setKeyword}
              onSearch={handleSearch}
              language={language}
              placeholder={labels.searchPlaceholder}
              className="mb-4"
            />

            {/* Results count */}
            <div className={cn(
              'flex items-center justify-between gap-4 flex-wrap',
              isRTL && 'flex-row-reverse'
            )}>
              <span className="text-muted-foreground">
                {totalCount} {labels.results}
              </span>
              
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {labels.filters}
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <Card>
                <CardContent className="p-4">
                  <FiltersContent />
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background p-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{labels.filters}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    ✕
                  </Button>
                </div>
                <FiltersContent />
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowMobileFilters(false)}
                >
                  {isRTL ? 'تطبيق' : 'Appliquer'}
                </Button>
              </div>
            )}

            {/* Shops Grid */}
            <main className="flex-1">
              {loading ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-6 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : shops.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">{labels.noResults}</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {shops.map((shop) => (
                      <Link key={shop.id} to={`/repair-shops/${shop.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                          <CardContent className="p-0">
                            {/* Image */}
                            <div className="relative h-48 bg-muted">
                              {shop.images && shop.images[0] ? (
                                <img
                                  src={shop.images[0].image_url}
                                  alt={isRTL ? shop.name_ar : shop.name_fr}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <Wrench className="h-12 w-12" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h3 className={cn(
                                'font-semibold text-lg line-clamp-1 mb-1',
                                isRTL && 'text-right'
                              )}>
                                {isRTL ? shop.name_ar : shop.name_fr}
                              </h3>

                              {shop.city && (
                                <p className={cn(
                                  'text-sm text-muted-foreground flex items-center gap-1 mb-2',
                                  isRTL && 'flex-row-reverse justify-end'
                                )}>
                                  <MapPin className="h-3 w-3" />
                                  {getCityName(shop.city as City, language)}
                                  {shop.neighborhood && ` - ${shop.neighborhood.name}`}
                                </p>
                              )}

                              {/* Specialties */}
                              {shop.specialties && shop.specialties.length > 0 && (
                                <div className={cn(
                                  'flex flex-wrap gap-1 mt-2',
                                  isRTL && 'justify-end'
                                )}>
                                  {shop.specialties.slice(0, 3).map((spec, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                  {shop.specialties.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{shop.specialties.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Contact Icons */}
                              <div className={cn(
                                'flex items-center gap-3 mt-3 pt-3 border-t',
                                isRTL && 'flex-row-reverse'
                              )}>
                                {shop.whatsapp && (
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                )}
                                {shop.phone && (
                                  <Phone className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={cn(
                      'flex items-center justify-center gap-2 mt-8',
                      isRTL && 'flex-row-reverse'
                    )}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm">
                        {labels.page} {currentPage} {labels.of} {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      <BannerSlot page="repair_shops" slot="bottom" />
    </div>
  );
}
