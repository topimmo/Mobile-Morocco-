import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getItemWithSimilar, ItemWithRelations, getItemTitle, getStoreName } from '@/lib/supabase/stores';
import { getCityName, City } from '@/lib/supabase/cities';
import { cn } from '@/lib/utils';
import { BackendFallback } from '@/components/ErrorBoundary';
import {
  Smartphone,
  Settings,
  Wrench,
  MapPin,
  Store,
  User,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertTriangle,
  ExternalLink,
  Share2,
} from 'lucide-react';

export default function ItemDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [item, setItem] = useState<ItemWithRelations | null>(null);
  const [similarItems, setSimilarItems] = useState<ItemWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const labels = {
    loading: isRTL ? 'جاري التحميل...' : 'Chargement...',
    notFound: isRTL ? 'المنتج غير موجود' : 'Article introuvable',
    notFoundHint: isRTL ? 'المنتج الذي تبحث عنه غير متاح' : 'L\'article que vous cherchez n\'est pas disponible',
    backToList: isRTL ? 'العودة للقائمة' : 'Retour à la liste',
    condition: isRTL ? 'الحالة' : 'État',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    location: isRTL ? 'الموقع' : 'Localisation',
    seller: isRTL ? 'البائع' : 'Vendeur',
    shop: isRTL ? 'متجر' : 'Boutique',
    individual: isRTL ? 'فرد' : 'Particulier',
    viewStore: isRTL ? 'عرض المتجر' : 'Voir la boutique',
    contact: isRTL ? 'تواصل معنا' : 'Nous contacter',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    call: isRTL ? 'اتصل' : 'Appeler',
    share: isRTL ? 'مشاركة' : 'Partager',
    disclaimer: isRTL 
      ? 'تنبيه: المنصة غير مسؤولة عن أي معاملات تتم بين المستخدمين. يرجى التحقق من المنتج قبل الشراء.'
      : 'Avertissement: La plateforme n\'est pas responsable des transactions entre utilisateurs. Veuillez vérifier le produit avant l\'achat.',
    similarItems: isRTL ? 'منتجات مشابهة' : 'Articles similaires',
    brand: isRTL ? 'العلامة التجارية' : 'Marque',
    model: isRTL ? 'الموديل' : 'Modèle',
    description: isRTL ? 'الوصف' : 'Description',
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'phone': return Smartphone;
      case 'spare_part': return Settings;
      case 'equipment': return Wrench;
      default: return Smartphone;
    }
  };

  const loadItem = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    
    try {
      // Single optimized query that fetches item + similar items together
      const { item: data, similarItems: similar } = await getItemWithSimilar(slug, 4);
      setItem(data);
      setSimilarItems(similar);
    } catch (err) {
      console.error('Error loading item:', err);
      setError(err instanceof Error ? err : new Error('Failed to load item'));
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [slug]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    await loadItem();
  }, [loadItem]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const formatPrice = (price: number | null, priceText?: string | null) => {
    if (priceText) return priceText;
    if (!price) return isRTL ? 'السعر غير محدد' : 'Prix non spécifié';
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency', currency: 'MAD', maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: getItemTitle(item, language),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const ItemIcon = item ? getItemIcon(item.item_type) : Smartphone;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error && !item) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BackendFallback 
            onRetry={handleRetry}
            isRetrying={isRetrying}
            title="Impossible de charger l'article"
            titleAr="تعذر تحميل المنتج"
            message="Une erreur s'est produite lors du chargement. Veuillez réessayer."
            messageAr="حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى."
          />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <Smartphone className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{labels.notFound}</h1>
          <p className="text-gray-500 mb-6">{labels.notFoundHint}</p>
          <Link to="/phones">
            <Button>{labels.backToList}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = item.images || [];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      <BannerSlot page="item_details" slot="top" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              {images.length > 0 ? (
                <img
                  src={images[selectedImageIndex].image_url}
                  alt={getItemTitle(item, language)}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <ItemIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70',
                      isRTL ? 'right-4' : 'left-4'
                    )}
                  >
                    {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(i => i === images.length - 1 ? 0 : i + 1)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70',
                      isRTL ? 'left-4' : 'right-4'
                    )}
                  >
                    {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </>
              )}

              <Badge 
                className={cn(
                  'absolute top-4',
                  isRTL ? 'left-4' : 'right-4',
                  item.condition === 'new' ? 'bg-green-600' : 'bg-orange-500'
                )}
              >
                {item.condition === 'new' ? labels.new : labels.used}
              </Badge>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className={cn('flex gap-2 mt-4', isRTL && 'flex-row-reverse')}>
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      idx === selectedImageIndex ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className={cn('text-3xl font-bold mb-4', isRTL && 'text-right')}>
              {getItemTitle(item, language)}
            </h1>

            <p className={cn('text-3xl font-bold text-primary mb-6', isRTL && 'text-right')}>
              {formatPrice(item.price, item.price_text)}
            </p>

            {/* Brand & Model */}
            {(item.brand || item.model) && (
              <div className={cn('flex gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                {item.brand && (
                  <div>
                    <span className="text-gray-500 text-sm">{labels.brand}:</span>
                    <span className={cn('font-medium', isRTL ? 'mr-2' : 'ml-2')}>{item.brand}</span>
                  </div>
                )}
                {item.model && (
                  <div>
                    <span className="text-gray-500 text-sm">{labels.model}:</span>
                    <span className={cn('font-medium', isRTL ? 'mr-2' : 'ml-2')}>{item.model}</span>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {item.city && (
              <div className={cn('flex items-center gap-2 mb-4 text-gray-600', isRTL && 'flex-row-reverse')}>
                <MapPin className="h-5 w-5" />
                <span>{getCityName(item.city as City, language)}</span>
                {item.neighborhood_custom && <span>- {item.neighborhood_custom}</span>}
              </div>
            )}

            {/* Seller Info */}
            {item.store && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className={cn('flex items-center justify-between', isRTL && 'flex-row-reverse')}>
                    <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {item.store.store_type === 'shop' ? (
                          <Store className="h-6 w-6 text-primary" />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className={cn('font-medium', isRTL && 'text-right')}>
                          {getStoreName(item.store, language)}
                        </p>
                        <div className={cn('flex items-center gap-2 text-sm text-gray-500', isRTL && 'flex-row-reverse')}>
                          <Badge variant="secondary" className="text-xs">
                            {item.store.store_type === 'shop' ? labels.shop : labels.individual}
                          </Badge>
                          {item.store.rating_avg > 0 && (
                            <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {item.store.rating_avg.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link to={`/stores/${item.store.slug}`}>
                      <Button variant="outline" size="sm">
                        {labels.viewStore}
                        <ExternalLink className={cn('h-4 w-4', isRTL ? 'mr-2' : 'ml-2')} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Buttons */}
            <div className={cn('flex gap-4 mb-6', isRTL && 'flex-row-reverse')}>
              {item.whatsapp && (
                <Button 
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(`https://wa.me/${item.whatsapp}`, '_blank')}
                >
                  <MessageCircle className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.whatsapp}
                </Button>
              )}
              {item.phone && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`tel:${item.phone}`, '_blank')}
                >
                  <Phone className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.call}
                </Button>
              )}
              <Button 
                size="lg"
                variant="ghost"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            {(item.description_fr || item.description_ar) && (
              <div className="mb-6">
                <h3 className={cn('font-semibold mb-2', isRTL && 'text-right')}>{labels.description}</h3>
                <p className={cn('text-gray-700 whitespace-pre-wrap', isRTL && 'text-right')}>
                  {isRTL ? item.description_ar : item.description_fr}
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className={cn('text-yellow-800 text-sm', isRTL && 'text-right')}>
                {labels.disclaimer}
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div className="mt-12">
            <h2 className={cn('text-2xl font-bold mb-6', isRTL && 'text-right')}>{labels.similarItems}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.map((similar) => {
                const SimilarIcon = getItemIcon(similar.item_type);
                return (
                  <Link key={similar.id} to={`/items/${similar.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                      <div className="relative h-48 bg-gray-200">
                        {similar.images && similar.images[0] ? (
                          <img src={similar.images[0].image_url} alt={getItemTitle(similar, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <SimilarIcon className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <Badge className={cn('absolute top-2', isRTL ? 'left-2' : 'right-2', similar.condition === 'new' ? 'bg-green-600' : 'bg-orange-500')}>
                          {similar.condition === 'new' ? labels.new : labels.used}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className={cn('font-medium line-clamp-2 mb-2', isRTL && 'text-right')}>{getItemTitle(similar, language)}</h3>
                        <p className={cn('font-bold text-lg text-primary', isRTL && 'text-right')}>{formatPrice(similar.price, similar.price_text)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BannerSlot page="item_details" slot="bottom" />

      <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  );
}
