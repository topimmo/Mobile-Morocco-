import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoreWithItems, StoreWithRelations, getStoreName, ItemWithRelations, getItemTitle } from "@/lib/supabase/stores";
import { getCityName, City } from "@/lib/supabase/cities";
import { cn } from "@/lib/utils";
import {
  Store,
  User,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Smartphone,
  Settings,
  Wrench,
  Package,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function StoreProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const [store, setStore] = useState<StoreWithRelations | null>(null);
  const [items, setItems] = useState<ItemWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("phones");

  const labels = {
    loading: isRTL ? "جاري التحميل..." : "Chargement...",
    notFound: isRTL ? "المتجر غير موجود" : "Boutique introuvable",
    notFoundHint: isRTL ? "المتجر الذي تبحث عنه غير متاح" : "La boutique que vous cherchez n'est pas disponible",
    backToStores: isRTL ? "العودة للمتاجر" : "Retour aux boutiques",
    shop: isRTL ? "متجر" : "Boutique",
    individual: isRTL ? "فرد" : "Particulier",
    verified: isRTL ? "موثق" : "Vérifié",
    whatsapp: isRTL ? "واتساب" : "WhatsApp",
    call: isRTL ? "اتصل" : "Appeler",
    phones: isRTL ? "الهواتف" : "Téléphones",
    spareParts: isRTL ? "قطع الغيار" : "Pièces détachées",
    equipment: isRTL ? "المعدات" : "Équipements",
    noItems: isRTL ? "لا توجد منتجات" : "Aucun produit",
    new: isRTL ? "جديد" : "Neuf",
    used: isRTL ? "مستعمل" : "Occasion",
    memberSince: isRTL ? "عضو منذ" : "Membre depuis",
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "phone": return Smartphone;
      case "spare_part": return Settings;
      case "equipment": return Wrench;
      default: return Package;
    }
  };

  useEffect(() => {
    const loadStore = async () => {
      if (!slug) return;
      setLoading(true);
      
      // Single optimized query that fetches store + items together
      const { store: data, items: storeItems } = await getStoreWithItems(slug);
      setStore(data);
      setItems(storeItems);
      
      setLoading(false);
    };
    loadStore();
  }, [slug]);

  const formatPrice = (price: number | null) => {
    if (!price) return isRTL ? "السعر غير محدد" : "Prix non spécifié";
    return new Intl.NumberFormat(isRTL ? "ar-MA" : "fr-MA", {
      style: "currency", currency: "MAD", maximumFractionDigits: 0,
    }).format(price);
  };

  const filterItemsByType = (type: string) => {
    return items.filter(item => item.item_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <Store className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{labels.notFound}</h1>
          <p className="text-gray-500 mb-6">{labels.notFoundHint}</p>
          <Link to="/stores">
            <Button>{labels.backToStores}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/stores" className={cn("inline-flex items-center text-primary hover:underline mb-6", isRTL && "flex-row-reverse")}>
            <ArrowIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {labels.backToStores}
          </Link>
          <div className={cn("flex gap-6", isRTL && "flex-row-reverse")}>
            <div className="w-32 h-32 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              {store.images && store.images[0] ? (
                <img src={store.images[0].image_url} alt={getStoreName(store, language)} className="w-full h-full object-cover rounded-xl" />
              ) : store.store_type === "shop" ? (
                <Store className="h-16 w-16 text-primary" />
              ) : (
                <User className="h-16 w-16 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                <h1 className="text-3xl font-bold">{getStoreName(store, language)}</h1>
                {(store as any).is_verified && (
                  <Badge className="bg-muted0"><CheckCircle className="h-3 w-3 mr-1" />{labels.verified}</Badge>
                )}
              </div>
              <div className={cn("flex items-center gap-4 mb-4 text-gray-500", isRTL && "flex-row-reverse")}>
                <Badge variant="secondary">{store.store_type === "shop" ? labels.shop : labels.individual}</Badge>
                {store.city && (
                  <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                    <MapPin className="h-4 w-4" />{getCityName(store.city as City, language)}
                  </span>
                )}
                {store.rating_avg > 0 && (
                  <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{store.rating_avg.toFixed(1)}
                  </span>
                )}
              </div>
              {(store.description_fr || store.description_ar) && (
                <p className={cn("text-gray-600 mb-4", isRTL && "text-right")}>
                  {isRTL ? store.description_ar : store.description_fr}
                </p>
              )}
              <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
                {store.whatsapp && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.open("https://wa.me/" + store.whatsapp, "_blank")}>
                    <MessageCircle className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />{labels.whatsapp}
                  </Button>
                )}
                {store.phone && (
                  <Button variant="outline" onClick={() => window.open("tel:" + store.phone, "_blank")}>
                    <Phone className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />{labels.call}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={cn("grid w-full max-w-md grid-cols-3", isRTL && "mr-auto ml-0")}>
              <TabsTrigger value="phones" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Smartphone className="h-4 w-4" />{labels.phones}
              </TabsTrigger>
              <TabsTrigger value="spare_part" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Settings className="h-4 w-4" />{labels.spareParts}
              </TabsTrigger>
              <TabsTrigger value="equipment" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Wrench className="h-4 w-4" />{labels.equipment}
              </TabsTrigger>
            </TabsList>
            {["phone", "spare_part", "equipment"].map((type) => (
              <TabsContent key={type} value={type === "phone" ? "phones" : type} className="mt-6">
                {filterItemsByType(type).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterItemsByType(type).map((item) => {
                      const ItemIcon = getItemIcon(item.item_type);
                      return (
                        <Link key={item.id} to={"/items/" + item.slug}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                            <div className="relative h-48 bg-gray-200">
                              {item.images && item.images[0] ? (
                                <img src={item.images[0].image_url} alt={getItemTitle(item, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><ItemIcon className="h-16 w-16 text-gray-400" /></div>
                              )}
                              <Badge className={cn("absolute top-2", isRTL ? "left-2" : "right-2", item.condition === "new" ? "bg-green-600" : "bg-orange-500")}>
                                {item.condition === "new" ? labels.new : labels.used}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <h3 className={cn("font-medium line-clamp-2 mb-2", isRTL && "text-right")}>{getItemTitle(item, language)}</h3>
                              <p className={cn("font-bold text-lg text-primary", isRTL && "text-right")}>{formatPrice(item.price)}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12"><Package className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{labels.noItems}</p></div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? "جميع الحقوق محفوظة." : "Tous droits réservés."}</p>
        </div>
      </footer>
    </div>
  );
}
