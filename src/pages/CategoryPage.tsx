import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO, generateBreadcrumbSchema } from '@/components/SEO';
import { ArrowLeft, MapPin, Grid3X3, ShoppingBag, Smartphone, Headphones, Cpu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { getListings, ListingWithRelations } from '@/lib/supabase/listings';
import { getCategories, getCategoryName, Category } from '@/lib/supabase/categories';
import { getCityName } from '@/lib/supabase/cities';
import { trackCategoryView } from '@/services/analyticsService';

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'telephones': <Smartphone className="h-6 w-6" />,
  'accessoires': <Headphones className="h-6 w-6" />,
  'pieces-detachees': <Cpu className="h-6 w-6" />,
  'equipement-reparation': <Settings className="h-6 w-6" />,
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  let language = 'ar';
  try {
    const langContext = useLanguage();
    language = langContext.language;
  } catch {
    // Context not available
  }
  
  const isRTL = language === 'ar';
  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<ListingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    back: isRTL ? 'العودة' : 'Retour',
    noListings: isRTL ? 'لا توجد إعلانات في هذه الفئة' : 'Aucune annonce dans cette catégorie',
    browseAll: isRTL ? 'تصفح جميع الإعلانات' : 'Parcourir toutes les annonces',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir les détails',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    dh: 'DH',
    listingsCount: isRTL ? 'إعلان' : 'annonce(s)',
  };

  const conditionLabels: Record<string, string> = {
    new: labels.new,
    used: labels.used,
    refurbished: labels.refurbished,
  };

  const fetchData = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      // Get categories to find the current one
      const categoriesData = await getCategories();
      const foundCategory = categoriesData.find(c => c.slug === slug);
      setCategory(foundCategory || null);

      // Get listings for this category (only if category found)
      if (foundCategory) {
        // Note: We can't parallelize here since we need category.id first
        const { data } = await getListings({ categoryId: foundCategory.id }, { page: 1, limit: 20 });
        setListings(data || []);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching category data:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
    // Track category view
    if (slug) {
      trackCategoryView(slug);
    }
  }, [fetchData, slug]);

  // Get category display name
  const categoryName = category 
    ? getCategoryName(category, language as 'fr' | 'ar')
    : slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  const categoryIcon = CATEGORY_ICONS[slug || ''] || <Grid3X3 className="h-6 w-6" />;

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="categories" slot="top" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isRTL ? 'الرئيسية' : 'Accueil', url: '/' },
    { name: categoryName, url: `/categories/${slug}` },
  ]);

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      <SEO
        title={`${categoryName} - ${isRTL ? 'التصنيفات' : 'Catégories'}`}
        description={isRTL 
          ? `تصفح جميع ${categoryName} المتوفرة في المغرب. أفضل الأسعار وأحدث العروض.`
          : `Parcourez tous les ${categoryName} disponibles au Maroc. Meilleurs prix et dernières offres.`
        }
        canonical={`/categories/${slug}`}
        structuredData={breadcrumbSchema}
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="categories" slot="top" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className={cn(
            'inline-flex items-center text-muted-foreground hover:text-foreground mb-4',
            isRTL && 'flex-row-reverse'
          )}
        >
          <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
          {labels.back}
        </Link>

        {/* Category Header */}
        <div className={cn('flex items-center gap-4 mb-8', isRTL && 'flex-row-reverse')}>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground">
              {listings.length} {labels.listingsCount}
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent className="space-y-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">{labels.noListings}</h2>
              <Link to="/listings">
                <Button>{labels.browseAll}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={typeof listing.images?.[0] === 'string' ? listing.images[0] : (listing.images?.[0] as any)?.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={listing.condition === 'new' ? 'default' : 'secondary'}
                    >
                      {conditionLabels[listing.condition] || listing.condition}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{listing.title}</h3>
                    <p className="text-lg font-bold text-primary">
                      {listing.price?.toLocaleString()} {labels.dh}
                    </p>
                    {listing.city && (
                      <div className={cn('flex items-center gap-1 text-sm text-muted-foreground mt-2', isRTL && 'flex-row-reverse')}>
                        <MapPin className="h-3 w-3" />
                        <span>{getCityName(listing.city, language as 'fr' | 'ar')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BannerSlot page="categories" slot="bottom" />
    </div>
  );
}
