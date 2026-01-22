import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO, generateLocalBusinessSchema } from '@/components/SEO';
import { ArrowLeft, MapPin, Phone, MessageCircle, Share2, Star, Clock, Wrench, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getRepairShopBySlug, RepairShopWithRelations } from '@/lib/supabase/repairShops';
import { getCityName } from '@/lib/supabase/cities';
import { trackRepairShopView, trackPhoneClick, trackWhatsAppClick } from '@/services/analyticsService';

export default function RepairShopDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  
  let language = 'ar';
  try {
    const langContext = useLanguage();
    language = langContext.language;
  } catch {
    // Context not available
  }
  
  const isRTL = language === 'ar';
  const [shop, setShop] = useState<RepairShopWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const labels = {
    notFound: isRTL ? 'المحل غير موجود' : 'Boutique non trouvée',
    notFoundDesc: isRTL ? 'عذراً، لم نتمكن من العثور على هذا المحل.' : 'Désolé, nous n\'avons pas pu trouver cette boutique.',
    backToShops: isRTL ? 'العودة للمحلات' : 'Retour aux boutiques',
    contact: isRTL ? 'اتصل' : 'Appeler',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    share: isRTL ? 'مشاركة' : 'Partager',
    report: isRTL ? 'إبلاغ' : 'Signaler',
    description: isRTL ? 'الوصف' : 'Description',
    specialties: isRTL ? 'التخصصات' : 'Spécialités',
    location: isRTL ? 'الموقع' : 'Localisation',
    workingHours: isRTL ? 'ساعات العمل' : 'Horaires',
    reviews: isRTL ? 'التقييمات' : 'Avis',
    noDescription: isRTL ? 'لا يوجد وصف' : 'Aucune description',
  };

  useEffect(() => {
    const fetchShop = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getRepairShopBySlug(slug);
        if (data) {
          setShop(data);
          // Track repair shop view
          trackRepairShopView(data.id, data.city_id || undefined);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching shop:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="repair_shop_details" slot="top" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
        <Navigation />
        <BannerSlot page="repair_shop_details" slot="top" />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">{labels.notFound}</h1>
              <p className="text-muted-foreground mb-6">{labels.notFoundDesc}</p>
              <Link to="/repair-shops">
                <Button className={cn(isRTL && 'flex-row-reverse')}>
                  <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
                  {labels.backToShops}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <BannerSlot page="repair_shop_details" slot="bottom" />
      </div>
    );
  }

  const coverImage = typeof shop.images?.[0] === 'string' ? shop.images[0] : (shop.images?.[0] as any)?.image_url || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80';
  
  const cityName = shop.city ? getCityName(shop.city, language as 'fr' | 'ar') : '';
  const shopName = isRTL ? shop.name_ar : shop.name_fr;
  const shopDescription = isRTL ? shop.description_ar : shop.description_fr;
  const shopAddress = isRTL ? shop.address_ar : shop.address_fr;
  
  const localBusinessSchema = generateLocalBusinessSchema({
    name: shopName,
    description: shopDescription || (isRTL ? `محل إصلاح هواتف في ${cityName}` : `Boutique de réparation de téléphones à ${cityName}`),
    image: coverImage,
    address: {
      street: shopAddress || undefined,
      city: cityName,
      country: 'MA',
    },
    phone: shop.phone || undefined,
    rating: shop.rating_avg || undefined,
    reviewCount: shop.rating_count || undefined,
    priceRange: '$$',
  });

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      <SEO
        title={`${shopName} - ${cityName}`}
        description={shopDescription || (isRTL 
          ? `${shopName} - محل إصلاح هواتف في ${cityName}. خدمات إصلاح معتمدة لجميع الماركات.`
          : `${shopName} - Boutique de réparation de téléphones à ${cityName}. Services de réparation certifiés pour toutes marques.`
        )}
        canonical={`/repair-shops/${slug}`}
        image={coverImage}
        type="local_business"
        structuredData={localBusinessSchema}
        locale={isRTL ? 'ar_MA' : 'fr_MA'}
      />
      <Navigation />
      <BannerSlot page="repair_shop_details" slot="top" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/repair-shops" 
          className={cn(
            'inline-flex items-center text-muted-foreground hover:text-foreground mb-6',
            isRTL && 'flex-row-reverse'
          )}
        >
          <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
          {labels.backToShops}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={coverImage} 
                alt={shopName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Shop Info */}
            <div>
              <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                <h1 className="text-2xl md:text-3xl font-bold">{shopName}</h1>
                {shop.rating_avg && (
                  <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{shop.rating_avg.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className={cn('flex items-center gap-2 text-muted-foreground mt-2', isRTL && 'flex-row-reverse')}>
                <MapPin className="h-4 w-4" />
                <span>
                  {shop.neighborhood?.name && `${shop.neighborhood.name}, `}
                  {shop.city && getCityName(shop.city, language as 'fr' | 'ar')}
                </span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-3">{labels.description}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {shopDescription || labels.noDescription}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            {shop.specialties && shop.specialties.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className={cn('font-semibold mb-3 flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    <Wrench className="h-4 w-4" />
                    {labels.specialties}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button className={cn('w-full', isRTL && 'flex-row-reverse')}>
                  <Phone className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.contact}
                </Button>
                <Button variant="outline" className={cn('w-full', isRTL && 'flex-row-reverse')}>
                  <MessageCircle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.whatsapp}
                </Button>
                <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className={cn('font-semibold mb-3 flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <Clock className="h-4 w-4" />
                  {labels.workingHours}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{isRTL ? 'الإثنين - الجمعة: 9:00 - 19:00' : 'Lun - Ven: 9h00 - 19h00'}</p>
                  <p>{isRTL ? 'السبت: 9:00 - 14:00' : 'Sam: 9h00 - 14h00'}</p>
                  <p>{isRTL ? 'الأحد: مغلق' : 'Dim: Fermé'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BannerSlot page="repair_shop_details" slot="bottom" />
    </div>
  );
}
