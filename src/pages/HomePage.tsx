import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { SearchBar, CitySelector } from '@/components/search';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO, generateWebsiteSchema } from '@/components/SEO';
import { getListings, ListingWithRelations } from '@/lib/supabase/listings';
import { getRepairShops, RepairShopWithRelations } from '@/lib/supabase/repairShops';
import { getCategories, Category, getCategoryName } from '@/lib/supabase/categories';
import { getCityName, City } from '@/lib/supabase/cities';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { apiCache, CACHE_KEYS, SimpleCache } from '@/lib/cache';
import {
  Smartphone,
  Headphones,
  Settings,
  Wrench,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Phone,
  Users,
  UserPlus,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'telephones': <Smartphone className="h-8 w-8" />,
  'telephones-neufs': <Smartphone className="h-8 w-8" />,
  'telephones-occasion': <Smartphone className="h-8 w-8" />,
  'accessoires': <Headphones className="h-8 w-8" />,
  'pieces-detachees': <Settings className="h-8 w-8" />,
  'equipement-reparation': <Wrench className="h-8 w-8" />,
};

export default function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [keyword, setKeyword] = useState('');
  const [cityId, setCityId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredListings, setFeaturedListings] = useState<ListingWithRelations[]>([]);
  const [repairShops, setRepairShops] = useState<RepairShopWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    title: isRTL ? 'منصة الهواتف المغربية' : 'Plateforme Mobile Maroc',
    subtitle: isRTL 
      ? 'شراء وبيع الهواتف والإكسسوارات وخدمات الإصلاح'
      : 'Achetez et vendez des téléphones, accessoires et services de réparation',
    categories: isRTL ? 'الفئات' : 'Catégories',
    featured: isRTL ? 'أحدث الإعلانات' : 'Dernières annonces',
    repairShops: isRTL ? 'محلات الإصلاح' : 'Boutiques de réparation',
    viewAll: isRTL ? 'عرض الكل' : 'Voir tout',
    noListings: isRTL ? 'لا توجد إعلانات بعد' : 'Pas d\'annonces pour le moment',
    noShops: isRTL ? 'لا توجد محلات بعد' : 'Pas de boutiques pour le moment',
    searchNear: isRTL ? 'البحث بالقرب من' : 'Rechercher près de',
  };

  // Cache TTL: 3 minutes for homepage data
  const HOMEPAGE_CACHE_TTL = 3 * 60 * 1000;
  
  // Track if data has been loaded to avoid refetches
  const dataLoadedRef = useRef(false);

  const loadData = useCallback(async (forceRefresh = false) => {
    // Check cache first unless forcing refresh
    const cacheKey = `${CACHE_KEYS.HOMEPAGE_DATA}:all`;
    
    if (!forceRefresh) {
      const cached = apiCache.get<{
        categories: Category[];
        listings: ListingWithRelations[];
        shops: RepairShopWithRelations[];
      }>(cacheKey);
      
      if (cached) {
        setCategories(cached.categories);
        setFeaturedListings(cached.listings);
        setRepairShops(cached.shops);
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    
    const [cats, listings, shops] = await Promise.all([
      getCategories(),
      getListings({}, { page: 1, limit: 8 }),
      getRepairShops({}, { page: 1, limit: 6 }),
    ]);
    
    const categoriesData = cats || [];
    const listingsData = listings.data || [];
    const shopsData = shops.data || [];
    
    // Cache the combined result
    apiCache.set(cacheKey, {
      categories: categoriesData,
      listings: listingsData,
      shops: shopsData,
    }, HOMEPAGE_CACHE_TTL);
    
    setCategories(categoriesData);
    setFeaturedListings(listingsData);
    setRepairShops(shopsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Only load once per mount
    if (!dataLoadedRef.current) {
      dataLoadedRef.current = true;
      loadData();
    }
  }, [loadData]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set('q', value);
    if (cityId) params.set('city', cityId);
    navigate(`/listings?${params.toString()}`);
  };

  const handleCityChange = (id: string) => {
    setCityId(id);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return isRTL ? 'السعر غير محدد' : 'Prix non spécifié';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isRTL ? 'الصفحة الرئيسية' : 'Accueil'}
        description={isRTL 
          ? 'شراء وبيع الهواتف والإكسسوارات وقطع الغيار في المغرب. اعثر على الفنيين ومحلات الإصلاح بالقرب منك.'
          : 'Achetez et vendez des téléphones, accessoires et pièces détachées au Maroc. Trouvez des techniciens et ateliers de réparation près de chez vous.'
        }
        canonical="/"
        structuredData={generateWebsiteSchema()}
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />

      {/* Top Banner */}
      <BannerSlot page="home" slot="top" />

      {/* Hero CTA Section - Above the Fold */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
        <div className="containerPage text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            {isRTL 
              ? 'انضم الآن وابدأ في نشر إعلاناتك'
              : 'Rejoignez-nous et commencez à publier vos annonces'}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            {isRTL
              ? 'أنشئ حسابك مجانًا واستفد من جميع ميزات المنصة'
              : 'Créez votre compte gratuitement et profitez de toutes les fonctionnalités'}
          </p>
          <Link to="/auth/register">
            <Button 
              size="lg" 
              className={cn(
                'bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow',
                isRTL && 'flex-row-reverse'
              )}
            >
              <UserPlus className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
              {isRTL ? 'إنشاء حساب' : 'Créer un compte'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Section with Feature Cards - Swiss Design */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white">
        <div className="containerPage">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Phones & Accessories */}
            <Card className="hover:shadow-md transition-shadow border border-border bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <Smartphone className="h-12 w-12 text-foreground" />
                </div>
                <h3 className={cn(
                  'text-xl font-bold mb-3 text-foreground',
                  isRTL && 'text-right'
                )}>
                  {isRTL 
                    ? 'اختيار كبير من الهواتف'
                    : 'Large sélection de téléphones'}
                </h3>
                <p className={cn(
                  'text-sm text-muted-foreground mb-6 leading-relaxed',
                  isRTL && 'text-right'
                )}>
                  {isRTL
                    ? 'هواتف جديدة ومستعملة، إكسسوارات وقطع غيار أصلية'
                    : 'neufs et d\'occasion, accessoires et pièces détachées'}
                </p>
                <Link to="/listings">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-medium">
                    {isRTL ? 'المزيد من المعلومات' : 'En Savoir Plus'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 2: Repair Services */}
            <Card className="hover:shadow-md transition-shadow border border-border bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <Wrench className="h-12 w-12 text-foreground" />
                </div>
                <h3 className={cn(
                  'text-xl font-bold mb-3 text-foreground',
                  isRTL && 'text-right'
                )}>
                  {isRTL 
                    ? 'تقنيون مؤهلون'
                    : 'Trouvez des techniciens qualifiés'}
                </h3>
                <p className={cn(
                  'text-sm text-muted-foreground mb-6 leading-relaxed',
                  isRTL && 'text-right'
                )}>
                  {isRTL
                    ? 'لإصلاح أجهزتك بكفاءة وسرعة'
                    : 'pour réparer vos appareils'}
                </p>
                <Link to="/repair-shops">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full font-medium">
                    {isRTL ? 'المزيد من المعلومات' : 'En Savoir Plus'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card 3: Community */}
            <Card className="hover:shadow-md transition-shadow border border-border bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <Users className="h-12 w-12 text-foreground" />
                </div>
                <h3 className={cn(
                  'text-xl font-bold mb-3 text-foreground',
                  isRTL && 'text-right'
                )}>
                  {isRTL 
                    ? 'انضم إلى مجتمعنا'
                    : 'Rejoignez notre communauté'}
                </h3>
                <p className={cn(
                  'text-sm text-muted-foreground mb-6 leading-relaxed',
                  isRTL && 'text-right'
                )}>
                  {isRTL
                    ? 'من المستوردين والفنيين والعملاء'
                    : 'd\'importateurs, techniciens et clients'}
                </p>
                <Link to="/auth/register">
                  <Button className={cn(
                    'bg-primary hover:bg-primary/90 text-primary-foreground w-full font-medium',
                    isRTL && 'flex-row-reverse'
                  )}>
                    <UserPlus className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                    {isRTL ? 'إنشاء حساب' : 'Créer un compte'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Publish Phone CTA - Swiss Design */}
          <div className="mt-12 text-center">
            <Link to="/publish-phone">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
              >
                <Smartphone className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
                {isRTL ? 'نشر تلفوني' : 'Publier mon téléphone'}
                <ArrowIcon className={cn("h-5 w-5", isRTL ? "mr-2" : "ml-2")} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Arabic Content Section - Swiss Design */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-muted">
        <div className="containerPage">
          {/* Arabic titles and descriptions */}
          <div className={cn(
            'grid grid-cols-1 md:grid-cols-3 gap-8',
            isRTL && 'text-right'
          )}>
            {isRTL && (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    معلومات وطرق حديثة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    حيث تجد لوحة معلومات حديثة لتتبع معاملاتك والتحكم بحسابك
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    شراء وبيع بسهولة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    عملية شراء وبيع سهلة ومأمونة مع ضمانات لحماية المستخدمين
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    كلكلات ومواصفات مختلفة
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تجد ما يناسبك من أسعار ومواصفات مختلفة لجميع الأجهزة
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Category Icons Section - Swiss Design */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white">
        <div className="containerPage">
          <h2 className={cn(
            'text-3xl font-bold mb-12 text-center text-foreground',
            isRTL && 'text-right'
          )}>
            {isRTL ? 'تصفح حسب الفئة' : 'Catégories'}
          </h2>

          {/* Main Category Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-24 w-24 mx-auto mb-4" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))
            ) : (
              <>
                {/* Phone Category */}
                <Link to="/categories/telephones" className="text-center group">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-border group-hover:border-primary transition-colors mb-4">
                    <Phone className="h-12 w-12 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className={cn(
                    'font-bold text-foreground mb-1',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'الهواتف' : 'Téléphones'}
                  </p>
                  <p className={cn(
                    'text-xs text-muted-foreground',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'أجهزة وإكسسوارات' : 'Appareils & Accessoires'}
                  </p>
                </Link>

                {/* Accessories Category */}
                <Link to="/categories/accessoires" className="text-center group">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-border group-hover:border-primary transition-colors mb-4">
                    <Headphones className="h-12 w-12 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className={cn(
                    'font-bold text-foreground mb-1',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'الإكسسوارات' : 'Accessoires'}
                  </p>
                  <p className={cn(
                    'text-xs text-muted-foreground',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'سماعات وملحقات' : 'Casques & Accessoires'}
                  </p>
                </Link>

                {/* Spare Parts Category */}
                <Link to="/categories/pieces-detachees" className="text-center group">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-border group-hover:border-primary transition-colors mb-4">
                    <Settings className="h-12 w-12 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className={cn(
                    'font-bold text-foreground mb-1',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'قطع غيار' : 'Pièces Détachées'}
                  </p>
                  <p className={cn(
                    'text-xs text-muted-foreground',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'شاشات وبطاريات' : 'Écrans & Batteries'}
                  </p>
                </Link>

                {/* Services Category */}
                <Link to="/repair-shops" className="text-center group">
                  <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-border group-hover:border-primary transition-colors mb-4">
                    <Wrench className="h-12 w-12 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className={cn(
                    'font-bold text-foreground mb-1',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'الخدمات' : 'Services'}
                  </p>
                  <p className={cn(
                    'text-xs text-muted-foreground',
                    isRTL && 'text-right'
                  )}>
                    {isRTL ? 'إصلاح واستشارة' : 'Réparation & Consultation'}
                  </p>
                </Link>
              </>
            )}
          </div>

          {/* Subcategory Details */}
          {!loading && (
            <div className={cn(
              'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-12 border-t border-border',
              isRTL && 'text-right'
            )}>
              {/* Phones Subcategories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">{isRTL ? 'الهواتف' : 'Téléphones'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="/categories/telephones-neufs" className="hover:text-gray-900">{isRTL ? '▪ هواتف جديدة' : '▪ Nouveaux téléphones'}</Link></li>
                  <li><Link to="/categories/telephones-occasion" className="hover:text-gray-900">{isRTL ? '▪ هواتف مستعملة' : '▪ Téléphones d\'occasion'}</Link></li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ هواتف مستجدة' : '▪ Téléphones reconditionnés'}</li>
                </ul>
              </div>

              {/* Accessories Subcategories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">{isRTL ? 'الإكسسوارات' : 'Accessoires'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="hover:text-gray-900">{isRTL ? '▪ السماعات' : '▪ Casques audio'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ شواحن وأسلاك' : '▪ Chargeurs & Câbles'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ حقائب وواقيات' : '▪ Étuis & Protections'}</li>
                </ul>
              </div>

              {/* Spare Parts Subcategories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">{isRTL ? 'قطع غيار' : 'Pièces Détachées'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="hover:text-gray-900">{isRTL ? '▪ شاشات LCD' : '▪ Écrans LCD'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ بطاريات' : '▪ Batteries'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ قطع أخرى' : '▪ Autres pièces'}</li>
                </ul>
              </div>

              {/* Services Subcategories */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">{isRTL ? 'مصلحات صيانة' : 'Réparations'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="hover:text-gray-900">{isRTL ? '▪ إصلاح الشاشات' : '▪ Remplacement d\'écran'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ إصلاح البطارية' : '▪ Remplacement batterie'}</li>
                  <li className="hover:text-gray-900">{isRTL ? '▪ استشارات فنية' : '▪ Consultations tech'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-white">
        <div className="containerPage">
          <div className={cn(
            'flex items-center justify-between mb-6',
            isRTL && 'flex-row-reverse'
          )}>
            <h2 className="text-2xl font-bold">{labels.featured}</h2>
            <Link to="/listings">
              <Button variant="outline" className={cn(isRTL && 'flex-row-reverse')}>
                {labels.viewAll}
                <ArrowIcon className={cn('h-4 w-4', isRTL ? 'mr-2' : 'ml-2')} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{labels.noListings}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredListings.map((listing) => (
                <Link key={listing.id} to={`/listings/${listing.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-40 bg-gray-200">
                      {listing.images && listing.images[0] ? (
                        <img
                          src={listing.images[0].image_url}
                          alt={isRTL ? listing.title_ar : listing.title_fr}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Smartphone className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      {listing.condition && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {listing.condition === 'new' ? (isRTL ? 'جديد' : 'Neuf') 
                            : listing.condition === 'used' ? (isRTL ? 'مستعمل' : 'Occasion')
                            : (isRTL ? 'مجدد' : 'Reconditionné')}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className={cn(
                        'font-medium line-clamp-2 mb-1',
                        isRTL && 'text-right'
                      )}>
                        {isRTL ? listing.title_ar : listing.title_fr}
                      </h3>
                      {listing.city && (
                        <p className={cn(
                          'text-sm text-gray-600 flex items-center gap-1 mb-2',
                          isRTL && 'flex-row-reverse justify-end'
                        )}>
                          <MapPin className="h-3 w-3" />
                          {getCityName(listing.city as City, language)}
                        </p>
                      )}
                      <p className={cn(
                        'font-bold text-blue-600',
                        isRTL && 'text-right'
                      )}>
                        {formatPrice(listing.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Middle Banner */}
      <section className="py-4 sm:py-6 md:py-8">
        <div className="containerPage">
          <BannerSlot page="home" slot="middle" />
        </div>
      </section>

      {/* Repair Shops Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="containerPage">
          <div className={cn(
            'flex items-center justify-between mb-6',
            isRTL && 'flex-row-reverse'
          )}>
            <h2 className="text-2xl font-bold">{labels.repairShops}</h2>
            <Link to="/repair-shops">
              <Button variant="outline" className={cn(isRTL && 'flex-row-reverse')}>
                {labels.viewAll}
                <ArrowIcon className={cn('h-4 w-4', isRTL ? 'mr-2' : 'ml-2')} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : repairShops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{labels.noShops}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {repairShops.map((shop) => (
                <Link key={shop.id} to={`/repair-shops/${shop.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-40 bg-muted">
                      {shop.images && shop.images[0] ? (
                        <img
                          src={shop.images[0].image_url}
                          alt={isRTL ? shop.name_ar : shop.name_fr}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Wrench className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className={cn(
                        'font-medium line-clamp-1 mb-1',
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
                        </p>
                      )}
                      {shop.specialties && shop.specialties.length > 0 && (
                        <div className={cn(
                          'flex flex-wrap gap-1',
                          isRTL && 'justify-end'
                        )}>
                          {shop.specialties.slice(0, 2).map((spec, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-14 bg-primary text-primary-foreground">
        <div className="containerPage text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isRTL ? 'انضم إلينا اليوم' : 'Rejoignez-nous Aujourd\'hui'}
          </h2>
          <p className="text-lg mb-6 opacity-90">
            {isRTL 
              ? 'سجل الآن واستفد من خدماتنا المميزة'
              : 'Inscrivez-vous maintenant et profitez de nos services exclusifs'}
          </p>
          <div className={cn('flex gap-4 justify-center', isRTL && 'flex-row-reverse')}>
            <Link to="/auth/register">
              <Button size="lg" variant="secondary">
                {isRTL ? 'إنشاء حساب' : 'Créer un compte'}
              </Button>
            </Link>
            <Link to="/listings">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {isRTL ? 'تصفح الإعلانات' : 'Parcourir les annonces'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-4 sm:py-6 md:py-8">
        <div className="containerPage">
          <BannerSlot page="home" slot="bottom" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 md:py-12">
        <div className="containerPage">
          <div className={cn(
            'grid grid-cols-1 md:grid-cols-4 gap-8',
            isRTL && 'text-right'
          )}>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">
                {isRTL ? 'موبايل المغرب' : 'Mobile Maroc'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isRTL 
                  ? 'منصتك الأولى للهواتف والإكسسوارات وخدمات الإصلاح في المغرب'
                  : 'Votre première plateforme pour les téléphones, accessoires et services de réparation au Maroc'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">
                {isRTL ? 'روابط سريعة' : 'Accès Rapide'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-blue-400 transition">{isRTL ? 'الرئيسية' : 'Accueil'}</Link></li>
                <li><Link to="/listings" className="hover:text-blue-400 transition">{isRTL ? 'الإعلانات' : 'Produits'}</Link></li>
                <li><Link to="/technicians" className="hover:text-blue-400 transition">{isRTL ? 'الفنيين' : 'Techniciens'}</Link></li>
                <li><Link to="/repair-shops" className="hover:text-blue-400 transition">{isRTL ? 'محلات الإصلاح' : 'Ateliers de Réparation'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">
                {isRTL ? 'معلومات' : 'Information'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-blue-400 transition">{isRTL ? 'من نحن' : 'À Propos'}</Link></li>
                <li><Link to="/faq" className="hover:text-blue-400 transition">{isRTL ? 'الأسئلة الشائعة' : 'FAQ'}</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition">{isRTL ? 'اتصل بنا' : 'Nous Contacter'}</Link></li>
                <li><Link to="/ads/request" className="hover:text-blue-400 transition">{isRTL ? 'طلب إعلان' : 'Demande de publicité'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">
                {isRTL ? 'تواصل معنا' : 'Contactez-nous'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <MapPin className="h-4 w-4" />
                  {isRTL ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'}
                </li>
                <li className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <Phone className="h-4 w-4" />
                  +212 5 22 12 34 56
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex gap-6 flex-wrap text-sm">
                <Link to="/terms" className="hover:text-blue-400 transition">{isRTL ? 'شروط الاستخدام' : "Conditions d'Utilisation"}</Link>
                <Link to="/privacy" className="hover:text-blue-400 transition">{isRTL ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}</Link>
              </div>
              <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
