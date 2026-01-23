import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO, generateBreadcrumbSchema } from '@/components/SEO';
import { ArrowLeft, MapPin, ShoppingBag, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { getListings, ListingWithRelations } from '@/lib/supabase/listings';
import { getCities, getCityName, City } from '@/lib/supabase/cities';
import { getCategoryName } from '@/lib/supabase/categories';

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  
  let language = 'ar';
  try {
    const langContext = useLanguage();
    language = langContext.language;
  } catch {
    // Context not available
  }
  
  const isRTL = language === 'ar';
  const [city, setCity] = useState<City | null>(null);
  const [listings, setListings] = useState<ListingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    back: isRTL ? 'العودة' : 'Retour',
    noListings: isRTL ? 'لا توجد إعلانات في هذه المدينة' : 'Aucune annonce dans cette ville',
    browseAll: isRTL ? 'تصفح جميع الإعلانات' : 'Parcourir toutes les annonces',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir les détails',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    dh: 'DH',
    listingsCount: isRTL ? 'إعلان' : 'annonce(s)',
    cityNotFound: isRTL ? 'المدينة غير موجودة' : 'Ville non trouvée',
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
      // Get cities to find the current one
      const citiesData = await getCities();
      const foundCity = citiesData.find(c => c.slug === slug);
      setCity(foundCity || null);

      // Get listings for this city (only if city found)
      if (foundCity) {
        // Note: We can't parallelize here since we need city.id first
        const { data } = await getListings({ cityId: foundCity.id }, { page: 1, limit: 20 });
        setListings(data || []);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching city data:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get city display name
  const cityName = city 
    ? getCityName(city, language as 'fr' | 'ar')
    : slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="listings" slot="top" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
    { name: cityName, url: `/cities/${slug}` },
  ]);

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      <SEO
        title={`${isRTL ? 'إعلانات' : 'Annonces'} ${cityName}`}
        description={isRTL 
          ? `تصفح جميع إعلانات الهواتف والإكسسوارات في ${cityName}. أفضل العروض والأسعار في المغرب.`
          : `Parcourez toutes les annonces de téléphones et accessoires à ${cityName}. Meilleures offres et prix au Maroc.`
        }
        canonical={`/cities/${slug}`}
        structuredData={breadcrumbSchema}
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="listings" slot="top" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
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

        {/* City Header */}
        <div className={cn('flex items-center gap-4 mb-8', isRTL && 'flex-row-reverse')}>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{cityName}</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                    {listing.category && (
                      <Badge variant="outline" className="mt-2">
                        {getCategoryName(listing.category, language as 'fr' | 'ar')}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BannerSlot page="listings" slot="bottom" />
    </div>
  );
}
