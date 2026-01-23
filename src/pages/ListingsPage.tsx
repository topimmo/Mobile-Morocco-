import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { SearchBar, FiltersPanel, FilterValues } from '@/components/search';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import { getListings, ListingWithRelations } from '@/lib/supabase/listings';
import { getCityName, City } from '@/lib/supabase/cities';
import { getCategoryName } from '@/lib/supabase/categories';
import { apiCache, SimpleCache } from '@/lib/cache';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, MapPin, Phone, MessageCircle, Eye, ChevronLeft, ChevronRight, Filter, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function ListingsPage() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const [listings, setListings] = useState<ListingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<FilterValues>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Debounce search for performance
  const debouncedKeyword = useDebounce(keyword, 400);
  const loadingRef = useRef(false);

  const labels = {
    title: isRTL ? 'الإعلانات' : 'Annonces',
    noResults: isRTL ? 'لم يتم العثور على إعلانات' : 'Aucune annonce trouvée',
    results: isRTL ? 'نتيجة' : 'résultat(s)',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir les détails',
    contact: isRTL ? 'اتصل' : 'Contacter',
    views: isRTL ? 'مشاهدة' : 'vues',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    page: isRTL ? 'صفحة' : 'Page',
    of: isRTL ? 'من' : 'sur',
    filters: isRTL ? 'الفلاتر' : 'Filtres',
  };

  const conditionLabels: Record<string, string> = {
    new: labels.new,
    used: labels.used,
    refurbished: labels.refurbished,
  };

  const fetchListings = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    
    const filterParams = {
      search: debouncedKeyword || undefined,
      categoryId: filters.categoryId,
      cityId: filters.cityId,
      neighborhoodId: filters.neighborhoodId,
      condition: filters.condition as 'new' | 'used' | 'refurbished' | undefined,
    };

    // Generate cache key
    const cacheKey = SimpleCache.generateKey('listings', { ...filterParams, page: currentPage, limit: 20 });
    
    // Check cache first
    const cached = apiCache.get<{ data: ListingWithRelations[] | null; count: number; totalPages: number }>(cacheKey);
    if (cached) {
      setListings(cached.data || []);
      setTotalCount(cached.count || 0);
      setTotalPages(cached.totalPages);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    try {
      const { data, count, totalPages: pages } = await getListings(
        filterParams,
        { page: currentPage, limit: 20 }
      );

      // Cache the result
      apiCache.set(cacheKey, { data, count, totalPages: pages }, 3 * 60 * 1000);

      setListings(data || []);
      setTotalCount(count || 0);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [debouncedKeyword, filters, currentPage]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return isRTL ? 'السعر غير محدد' : 'Prix non spécifié';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isRTL ? 'إعلانات - هواتف وإكسسوارات' : 'Annonces - Téléphones et accessoires'}
        description={isRTL 
          ? 'تصفح جميع إعلانات الهواتف والإكسسوارات وقطع الغيار في المغرب. فلتر حسب المدينة والسعر والحالة.'
          : 'Parcourez toutes les annonces de téléphones, accessoires et pièces détachées au Maroc. Filtrez par ville, prix et état.'
        }
        canonical="/listings"
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="listings" slot="top" />

      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8">
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
              className="mb-4"
            />

            {/* Results count and view toggle */}
            <div className={cn(
              'flex items-center justify-between gap-4 flex-wrap',
              isRTL && 'flex-row-reverse'
            )}>
              <span className="text-muted-foreground">
                {totalCount} {labels.results}
              </span>
              
              <div className="flex items-center gap-2">
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

                {/* View mode toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <Card>
                <CardContent className="p-4">
                  <FiltersPanel
                    values={filters}
                    onChange={handleFiltersChange}
                    language={language}
                    showCondition
                    showPrice
                  />
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
                <FiltersPanel
                  values={filters}
                  onChange={(v) => {
                    handleFiltersChange(v);
                    setShowMobileFilters(false);
                  }}
                  language={language}
                  showCondition
                  showPrice
                />
              </div>
            )}

            {/* Listings Grid */}
            <main className="flex-1">
              {loading ? (
                <div className={cn(
                  'grid gap-4',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}>
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-6 w-1/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">{labels.noResults}</p>
                </div>
              ) : (
                <>
                  <div className={cn(
                    'grid gap-4',
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}>
                    {listings.map((listing) => (
                      <Link key={listing.id} to={`/listings/${listing.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                          <CardContent className={cn(
                            'p-0',
                            viewMode === 'list' && 'flex'
                          )}>
                            {/* Image */}
                            <div className={cn(
                              'relative bg-muted',
                              viewMode === 'grid' ? 'h-48' : 'w-40 h-32 shrink-0'
                            )}>
                              {listing.images && listing.images[0] ? (
                                <img
                                  src={listing.images[0].image_url}
                                  alt={isRTL ? listing.title_ar : listing.title_fr}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  📱
                                </div>
                              )}
                              {listing.condition && (
                                <Badge className="absolute top-2 right-2" variant="secondary">
                                  {conditionLabels[listing.condition]}
                                </Badge>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1">
                              <h3 className={cn(
                                'font-semibold line-clamp-2 mb-1',
                                isRTL && 'text-right'
                              )}>
                                {isRTL ? listing.title_ar : listing.title_fr}
                              </h3>

                              {listing.city && (
                                <p className={cn(
                                  'text-sm text-muted-foreground flex items-center gap-1 mb-2',
                                  isRTL && 'flex-row-reverse justify-end'
                                )}>
                                  <MapPin className="h-3 w-3" />
                                  {getCityName(listing.city as City, language)}
                                  {listing.neighborhood && ` - ${listing.neighborhood.name}`}
                                </p>
                              )}

                              <p className={cn(
                                'text-lg font-bold text-primary',
                                isRTL && 'text-right'
                              )}>
                                {formatPrice(listing.price)}
                              </p>

                              {viewMode === 'list' && (
                                <div className={cn(
                                  'flex items-center gap-4 mt-2 text-sm text-muted-foreground',
                                  isRTL && 'flex-row-reverse'
                                )}>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {listing.view_count || 0}
                                  </span>
                                </div>
                              )}
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

      <BannerSlot page="listings" slot="bottom" />
    </div>
  );
}
