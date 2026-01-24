import { useParams, Link } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO, generateProductSchema } from '@/components/SEO';
import { ArrowLeft, MapPin, Phone, MessageCircle, Share2, Heart, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getListingBySlug, ListingWithRelations } from '@/lib/supabase/listings';
import { getCityName } from '@/lib/supabase/cities';
import { getCategoryName } from '@/lib/supabase/categories';
import { trackListingView, trackPhoneClick, trackWhatsAppClick } from '@/services/analyticsService';

export default function ListingDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  
  let language: Language = 'ar';
  try {
    const langContext = useLanguage();
    language = langContext.language;
  } catch {
    // Context not available
  }
  
  const isRTL = language === 'ar';
  const [listing, setListing] = useState<ListingWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const labels = {
    notFound: isRTL ? 'الإعلان غير موجود' : 'Annonce non trouvée',
    notFoundDesc: isRTL ? 'عذراً، لم نتمكن من العثور على هذا الإعلان.' : 'Désolé, nous n\'avons pas pu trouver cette annonce.',
    backToListings: isRTL ? 'العودة للإعلانات' : 'Retour aux annonces',
    contact: isRTL ? 'اتصل بالبائع' : 'Contacter le vendeur',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    share: isRTL ? 'مشاركة' : 'Partager',
    favorite: isRTL ? 'إضافة للمفضلة' : 'Ajouter aux favoris',
    report: isRTL ? 'إبلاغ' : 'Signaler',
    description: isRTL ? 'الوصف' : 'Description',
    details: isRTL ? 'التفاصيل' : 'Détails',
    location: isRTL ? 'الموقع' : 'Localisation',
    price: isRTL ? 'السعر' : 'Prix',
    condition: isRTL ? 'الحالة' : 'État',
    category: isRTL ? 'الفئة' : 'Catégorie',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    dh: 'DH',
  };

  const conditionLabels: Record<string, string> = {
    new: labels.new,
    used: labels.used,
    refurbished: labels.refurbished,
  };

  useEffect(() => {
    const fetchListing = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getListingBySlug(slug);
        if (data) {
          setListing(data);
          // Track listing view
          trackListingView(
            data.id,
            data.category_id || undefined,
            data.price
          );
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [slug]);

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="listing_details" slot="top" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="listing_details" slot="top" />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">{labels.notFound}</h1>
              <p className="text-muted-foreground mb-6">{labels.notFoundDesc}</p>
              <Link to="/listings">
                <Button className={cn(isRTL && 'flex-row-reverse')}>
                  <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
                  {labels.backToListings}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <BannerSlot page="listing_details" slot="bottom" />
      </div>
    );
  }

  const images: string[] = listing.images && listing.images.length > 0 
    ? listing.images.map((img: any) => typeof img === 'string' ? img : img?.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80')
    : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const productSchema = generateProductSchema({
    name: listing.title,
    description: listing.description || '',
    image: images[0],
    price: listing.price || 0,
    currency: 'MAD',
    condition: listing.condition === 'new' ? 'NewCondition' 
      : listing.condition === 'refurbished' ? 'RefurbishedCondition' 
      : 'UsedCondition',
    brand: listing.brand || undefined,
  });

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      <SEO
        title={listing.title}
        description={listing.description || (isRTL ? `${listing.title} للبيع في المغرب` : `${listing.title} à vendre au Maroc`)}
        canonical={`/listings/${slug}`}
        image={images[0]}
        type="product"
        structuredData={productSchema}
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="listing_details" slot="top" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/listings" 
          className={cn(
            'inline-flex items-center text-muted-foreground hover:text-foreground mb-6',
            isRTL && 'flex-row-reverse'
          )}
        >
          <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
          {labels.backToListings}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={images[currentImageIndex]} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors',
                      isRTL ? 'right-2' : 'left-2'
                    )}
                  >
                    <ChevronLeft className={cn('h-6 w-6', isRTL && 'rotate-180')} />
                  </button>
                  <button
                    onClick={nextImage}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors',
                      isRTL ? 'left-2' : 'right-2'
                    )}
                  >
                    <ChevronRight className={cn('h-6 w-6', isRTL && 'rotate-180')} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Info */}
          <div className="space-y-6">
            <div>
              <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
                <Badge variant={listing.condition === 'new' ? 'default' : 'secondary'}>
                  {conditionLabels[listing.condition] || listing.condition}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-primary mt-4">
                {listing.price?.toLocaleString()} {labels.dh}
              </p>
            </div>

            {/* Location */}
            <div className={cn('flex items-center gap-2 text-muted-foreground', isRTL && 'flex-row-reverse')}>
              <MapPin className="h-4 w-4" />
              <span>
                {listing.neighborhood?.name && `${listing.neighborhood.name}, `}
                {listing.city && getCityName(listing.city, language)}
              </span>
            </div>

            {/* Category */}
            {listing.category && (
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <span className="text-muted-foreground">{labels.category}:</span>
                <Badge variant="outline">{getCategoryName(listing.category, language)}</Badge>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-2">{labels.description}</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description || (isRTL ? 'لا يوجد وصف' : 'Aucune description')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                <Button 
                  className={cn('flex-1', isRTL && 'flex-row-reverse')}
                  onClick={() => {
                    if (listing) trackPhoneClick(listing.id);
                  }}
                >
                  <Phone className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.contact}
                </Button>
                <Button 
                  variant="outline" 
                  className={cn('flex-1', isRTL && 'flex-row-reverse')}
                  onClick={() => {
                    if (listing) trackWhatsAppClick(listing.id);
                  }}
                >
                  <MessageCircle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.whatsapp}
                </Button>
              </div>
              <div className={cn('flex gap-3', isRTL && 'flex-row-reverse')}>
                <Button variant="outline" size="sm" className={cn(isRTL && 'flex-row-reverse')}>
                  <Share2 className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.share}
                </Button>
                <Button variant="outline" size="sm" className={cn(isRTL && 'flex-row-reverse')}>
                  <Heart className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.favorite}
                </Button>
                <Button variant="ghost" size="sm" className={cn('text-muted-foreground', isRTL && 'flex-row-reverse')}>
                  <AlertTriangle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.report}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BannerSlot page="listing_details" slot="bottom" />
    </div>
  );
}
