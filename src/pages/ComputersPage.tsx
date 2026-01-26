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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { getComputers, ComputerWithRelations } from '@/lib/supabase/computers';
import { getCities, City, getCityName } from '@/lib/supabase/cities';
import { getNeighborhoodsByCity, Neighborhood } from '@/lib/supabase/neighborhoods';
import { apiCache, SimpleCache } from '@/lib/cache';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';
import {
  Laptop,
  MapPin,
  Search,
  Filter,
  Store,
  User,
  Phone,
  MessageCircle,
  Plus,
  Cpu,
  HardDrive,
  DollarSign,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export default function ComputersPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';

  const [items, setItems] = useState<ComputerWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [cityId, setCityId] = useState(searchParams.get('city') || '');
  const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get('neighborhood') || '');
  const [condition, setCondition] = useState<'all' | 'new' | 'used'>(
    (searchParams.get('condition') as 'all' | 'new' | 'used') || 'all'
  );
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minRam, setMinRam] = useState(searchParams.get('minRam') || '');
  const [storageType, setStorageType] = useState(searchParams.get('storageType') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce search keyword for better performance
  const debouncedKeyword = useDebounce(keyword, 400);
  const loadingRef = useRef(false);

  const labels = {
    title: isRTL ? 'الحواسيب' : 'Ordinateurs',
    subtitle: isRTL ? 'تصفح جميع الحواسيب المتاحة' : 'Parcourez tous les ordinateurs disponibles',
    search: isRTL ? 'ابحث عن حاسوب...' : 'Rechercher un ordinateur...',
    allCities: isRTL ? 'جميع المدن' : 'Toutes les villes',
    allNeighborhoods: isRTL ? 'جميع الأحياء' : 'Tous les quartiers',
    allConditions: isRTL ? 'جميع الحالات' : 'Toutes conditions',
    allBrands: isRTL ? 'جميع الماركات' : 'Toutes les marques',
    allRam: isRTL ? 'جميع الذاكرة' : 'Toute la RAM',
    allStorageTypes: isRTL ? 'جميع أنواع التخزين' : 'Tous les types de stockage',
    minPrice: isRTL ? 'السعر الأدنى' : 'Prix min',
    maxPrice: isRTL ? 'السعر الأقصى' : 'Prix max',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    noResults: isRTL ? 'لا توجد نتائج' : 'Aucun résultat trouvé',
    noResultsHint: isRTL ? 'جرب تعديل الفلاتر للحصول على نتائج أفضل' : 'Essayez d\'ajuster vos filtres pour de meilleurs résultats',
    loadMore: isRTL ? 'تحميل المزيد' : 'Charger plus',
    results: isRTL ? 'نتيجة' : 'résultats',
    shop: isRTL ? 'متجر' : 'Boutique',
    individual: isRTL ? 'فرد' : 'Particulier',
    contact: isRTL ? 'تواصل' : 'Contacter',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir détails',
    publishComputer: isRTL ? 'نشر حاسوبي' : 'Publier mon ordinateur',
    ram: isRTL ? 'ذاكرة RAM' : 'RAM',
    storage: isRTL ? 'التخزين' : 'Stockage',
    filters: isRTL ? 'الفلاتر' : 'Filtres',
    applyFilters: isRTL ? 'تطبيق الفلاتر' : 'Appliquer les filtres',
    clearFilters: isRTL ? 'مسح الفلاتر' : 'Réinitialiser les filtres',
    location: isRTL ? 'الموقع' : 'Localisation',
    condition: isRTL ? 'الحالة' : 'État',
    specifications: isRTL ? 'المواصفات' : 'Spécifications',
    priceRange: isRTL ? 'نطاق السعر' : 'Fourchette de prix',
    brand: isRTL ? 'الماركة' : 'Marque',
    activeFilters: isRTL ? 'فلاتر نشطة' : 'filtres actifs',
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
    const loadItems = async () => {
      // Prevent duplicate requests
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      
      const filters: any = {};

      if (debouncedKeyword) filters.search = debouncedKeyword;
      if (cityId) filters.cityId = cityId;
      if (neighborhoodId) filters.neighborhoodId = neighborhoodId;
      if (condition !== 'all') filters.condition = condition;
      if (brand) filters.brand = brand;
      if (minRam) filters.minRam = parseInt(minRam);
      if (storageType) filters.storageType = storageType;
      if (minPrice) filters.minPrice = parseFloat(minPrice);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

      // Generate cache key
      const cacheKey = SimpleCache.generateKey('computers', { ...filters, page, perPage: 20 });
      
      // Check cache first
      const cached = apiCache.get<{ data: ComputerWithRelations[]; count: number }>(cacheKey);
      if (cached && page === 1) {
        setItems(cached.data || []);
        setTotalCount(cached.count);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      try {
        const { data, count } = await getComputers(filters, { page, perPage: 20 });
        
        // Cache the result
        if (page === 1) {
          apiCache.set(cacheKey, { data: data || [], count: count || 0 }, 3 * 60 * 1000); // 3 minutes cache
          setItems(data || []);
        } else {
          setItems(prev => [...prev, ...(data || [])]);
        }
        setTotalCount(count || 0);
      } catch (error) {
        console.error('Error loading computers:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadItems();
  }, [debouncedKeyword, cityId, neighborhoodId, condition, brand, minRam, storageType, minPrice, maxPrice, page]);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (cityId) params.set('city', cityId);
    if (neighborhoodId) params.set('neighborhood', neighborhoodId);
    if (condition !== 'all') params.set('condition', condition);
    if (brand) params.set('brand', brand);
    if (minRam) params.set('minRam', minRam);
    if (storageType) params.set('storageType', storageType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    setSearchParams(params);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCityId('');
    setNeighborhoodId('');
    setCondition('all');
    setBrand('');
    setMinRam('');
    setStorageType('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (keyword) count++;
    if (cityId) count++;
    if (neighborhoodId) count++;
    if (condition !== 'all') count++;
    if (brand) count++;
    if (minRam) count++;
    if (storageType) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    return count;
  };

  const formatPrice = (price: number | null, priceText?: string | null) => {
    if (priceText) return priceText;
    if (!price) return isRTL ? 'السعر غير محدد' : 'Prix non spécifié';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemTitle = (item: ComputerWithRelations) => {
    if (language === 'ar' && item.title_ar) return item.title_ar;
    if (item.title_fr) return item.title_fr;
    return `${item.brand || ''} ${item.model || ''}`.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={labels.title}
        description={labels.subtitle}
        canonical="/computers"
        keywords={isRTL 
          ? 'حواسيب، لابتوب، كمبيوتر، ديل، اتش بي، لينوفو، المغرب، أجهزة حاسوب' 
          : 'ordinateurs, laptops, computers, Dell, HP, Lenovo, Maroc, PC portables'
        }
        type="website"
      />
      <Navigation />

      <BannerSlot page="computers" slot="top" />

      {/* Header */}
      <section className="py-4 sm:py-6 md:py-8 px-4 md:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className={cn('flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4', isRTL && 'sm:flex-row-reverse')}>
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Laptop className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className={cn('text-2xl sm:text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
                <p className={cn('text-sm sm:text-base text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
              </div>
            </div>
            {/* CTA Button */}
            <div className={cn('sm:ml-auto w-full sm:w-auto', isRTL && 'sm:mr-auto sm:ml-0')}>
              <Link to="/publish-computer" className="w-full sm:w-auto">
                <Button className="bg-sky-600 hover:bg-sky-700 w-full sm:w-auto">
                  <Plus className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.publishComputer}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile-friendly Filters */}
          <div className="max-w-5xl mx-auto">
            {/* Quick search bar - always visible */}
            <div className="relative mb-4">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400', isRTL ? 'right-4' : 'left-4')} />
              <Input
                placeholder={labels.search}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={cn('h-12 text-base', isRTL ? 'pr-12' : 'pl-12')}
              />
            </div>

            {/* Filter Button and Active Count */}
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      'flex-1 h-12 text-base font-medium border-2 relative',
                      getActiveFiltersCount() > 0 && 'border-blue-500 bg-blue-50 text-blue-700'
                    )}
                  >
                    <SlidersHorizontal className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                    {labels.filters}
                    {getActiveFiltersCount() > 0 && (
                      <Badge className={cn('bg-blue-600', isRTL ? 'mr-2' : 'ml-2')}>
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[85vh]">
                  <DrawerHeader className={cn(isRTL && 'text-right')}>
                    <DrawerTitle className="text-xl font-bold">{labels.filters}</DrawerTitle>
                    {getActiveFiltersCount() > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {getActiveFiltersCount()} {labels.activeFilters}
                      </p>
                    )}
                  </DrawerHeader>
                  
                  <div className="overflow-y-auto px-4 pb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                    {/* Location Section */}
                    <div className="mb-6">
                      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">{labels.location}</h3>
                      </div>
                      <div className="space-y-3">
                        <Select value={cityId || 'all'} onValueChange={(v) => { setCityId(v === 'all' ? '' : v); setPage(1); }}>
                          <SelectTrigger className="w-full h-12 text-base">
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

                        {cityId && (
                          <Select value={neighborhoodId || 'all'} onValueChange={(v) => { setNeighborhoodId(v === 'all' ? '' : v); setPage(1); }}>
                            <SelectTrigger className="w-full h-12 text-base">
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
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Condition Section */}
                    <div className="mb-6">
                      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
                        <Filter className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">{labels.condition}</h3>
                      </div>
                      <Select value={condition} onValueChange={(v) => { setCondition(v as any); setPage(1); }}>
                        <SelectTrigger className="w-full h-12 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{labels.allConditions}</SelectItem>
                          <SelectItem value="new">{labels.new}</SelectItem>
                          <SelectItem value="used">{labels.used}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-4" />

                    {/* Specifications Section - Key fields highlighted */}
                    <div className="mb-6">
                      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
                        <Laptop className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">{labels.specifications}</h3>
                      </div>
                      <div className="space-y-3">
                        {/* Brand - Highlighted as key field */}
                        <div>
                          <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL && 'text-right')}>
                            {labels.brand}
                          </label>
                          <Select value={brand || 'all'} onValueChange={(v) => { setBrand(v === 'all' ? '' : v); setPage(1); }}>
                            <SelectTrigger className="w-full h-12 text-base font-medium border-2">
                              <SelectValue placeholder={labels.allBrands} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{labels.allBrands}</SelectItem>
                              <SelectItem value="Dell">Dell</SelectItem>
                              <SelectItem value="HP">HP</SelectItem>
                              <SelectItem value="Lenovo">Lenovo</SelectItem>
                              <SelectItem value="Asus">Asus</SelectItem>
                              <SelectItem value="Acer">Acer</SelectItem>
                              <SelectItem value="Apple">Apple</SelectItem>
                              <SelectItem value="MSI">MSI</SelectItem>
                              <SelectItem value="Toshiba">Toshiba</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL && 'text-right')}>
                            <Cpu className={cn('inline h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
                            {labels.ram}
                          </label>
                          <Select value={minRam || 'all'} onValueChange={(v) => { setMinRam(v === 'all' ? '' : v); setPage(1); }}>
                            <SelectTrigger className="w-full h-12 text-base">
                              <SelectValue placeholder={labels.allRam} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{labels.allRam}</SelectItem>
                              <SelectItem value="4">4GB+</SelectItem>
                              <SelectItem value="8">8GB+</SelectItem>
                              <SelectItem value="16">16GB+</SelectItem>
                              <SelectItem value="32">32GB+</SelectItem>
                              <SelectItem value="64">64GB+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL && 'text-right')}>
                            <HardDrive className={cn('inline h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
                            {labels.storage}
                          </label>
                          <Select value={storageType || 'all'} onValueChange={(v) => { setStorageType(v === 'all' ? '' : v); setPage(1); }}>
                            <SelectTrigger className="w-full h-12 text-base">
                              <SelectValue placeholder={labels.allStorageTypes} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{labels.allStorageTypes}</SelectItem>
                              <SelectItem value="SSD">SSD</SelectItem>
                              <SelectItem value="HDD">HDD</SelectItem>
                              <SelectItem value="SSD+HDD">SSD+HDD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Price Range Section - Highlighted as key field */}
                    <div className="mb-6">
                      <div className={cn('flex items-center gap-2 mb-3', isRTL && 'flex-row-reverse')}>
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <h3 className="text-base font-semibold text-gray-900">{labels.priceRange}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL && 'text-right')}>
                            {labels.minPrice}
                          </label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="h-12 text-base font-medium border-2"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL && 'text-right')}>
                            {labels.maxPrice}
                          </label>
                          <Input
                            type="number"
                            placeholder="∞"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="h-12 text-base font-medium border-2"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DrawerFooter className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button 
                        variant="outline" 
                        onClick={handleClearFilters}
                        className="h-12 text-base font-medium"
                      >
                        <X className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                        {labels.clearFilters}
                      </Button>
                      <Button 
                        onClick={handleSearch}
                        className="h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                      >
                        <Search className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                        {labels.applyFilters}
                      </Button>
                    </div>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Results count */}
            <div className={cn('mt-4 text-sm text-gray-600', isRTL && 'text-right')}>
              {totalCount} {labels.results}
            </div>
          </div>
        </div>
      </section>

      {/* Items Grid */}
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
              <Laptop className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
                          <img
                            src={item.images[0].image_url}
                            alt={getItemTitle(item)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Laptop className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <Badge 
                          className={cn(
                            'absolute top-2',
                            isRTL ? 'left-2' : 'right-2',
                            item.condition === 'new' ? 'bg-green-600' : 'bg-orange-500'
                          )}
                        >
                          {item.condition === 'new' ? labels.new : labels.used}
                        </Badge>
                        {item.store && (
                          <Badge 
                            variant="secondary"
                            className={cn('absolute top-2', isRTL ? 'right-2' : 'left-2')}
                          >
                            {item.store.store_type === 'shop' ? (
                              <><Store className="h-3 w-3 mr-1" />{labels.shop}</>
                            ) : (
                              <><User className="h-3 w-3 mr-1" />{labels.individual}</>
                            )}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className={cn('font-medium line-clamp-2 mb-2 min-h-[48px]', isRTL && 'text-right')}>
                          {getItemTitle(item)}
                        </h3>
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
                        <p className={cn('font-bold text-lg text-blue-600', isRTL && 'text-right')}>
                          {formatPrice(item.price, item.price_text)}
                        </p>
                        
                        {/* Computer Details Summary */}
                        {item.computer_details && (
                          <div className={cn('flex flex-wrap gap-1 mt-2', isRTL && 'flex-row-reverse')}>
                            {item.computer_details.ram_gb && (
                              <Badge variant="outline" className="text-xs">
                                {item.computer_details.ram_gb}GB {labels.ram}
                              </Badge>
                            )}
                            {item.computer_details.storage_type && (
                              <Badge variant="outline" className="text-xs">
                                {item.computer_details.storage_type}
                              </Badge>
                            )}
                            {item.computer_details.processor && (
                              <Badge variant="outline" className="text-xs">
                                {item.computer_details.processor}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Contact buttons */}
                        <div className={cn('flex gap-2 mt-3', isRTL && 'flex-row-reverse')}>
                          {item.whatsapp && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://wa.me/${item.whatsapp}`, '_blank');
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {item.phone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`tel:${item.phone}`, '_blank');
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

              {/* Load More */}
              {items.length < totalCount && (
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

      <BannerSlot page="computers" slot="bottom" />

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
