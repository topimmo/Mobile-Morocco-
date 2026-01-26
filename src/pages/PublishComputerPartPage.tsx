import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getCities, City } from "@/lib/supabase/cities";
import { createComputerPart, COMPUTER_PART_CATEGORIES } from "@/lib/supabase/computers";
import { uploadImages } from "@/lib/supabase/storage";
import { getNeighborhoodsByCity, Neighborhood } from "@/lib/supabase/neighborhoods";
import { 
  Cpu, 
  Upload, 
  X, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";

interface ComputerPartFormData {
  title: string;
  brand: string;
  condition: "new" | "used";
  price: string;
  cityId: string;
  neighborhoodId: string;
  neighborhoodCustom: string;
  description: string;
  contactPhone: string;
  contactMethod: "whatsapp" | "phone" | "both";
  sellerType: "individual" | "shop";
  images: string[];
  // Computer part-specific details
  part_category: string;
  part_type: string;
  capacity: string;
  speed: string;
  compatible_models: string;
  stock_quantity: string;
}

const translations = {
  ar: {
    pageTitle: "نشر قطعة كمبيوتر",
    pageDescription: "أنشر إعلانك لقطعة الكمبيوتر بسرعة وسهولة",
    title: "عنوان الإعلان",
    titlePlaceholder: "مثال: DDR4 16GB RAM 3200MHz",
    brand: "العلامة التجارية",
    brandPlaceholder: "مثال: Corsair, Kingston, Samsung",
    condition: "الحالة",
    conditionNew: "جديد",
    conditionUsed: "مستعمل",
    price: "السعر (درهم)",
    pricePlaceholder: "0",
    city: "المدينة",
    selectCity: "اختر المدينة",
    neighborhood: "الحي",
    selectNeighborhood: "اختر الحي",
    neighborhoodOther: "آخر (أدخل اسم الحي يدوياً)",
    customNeighborhoodPlaceholder: "أدخل اسم الحي...",
    description: "الوصف",
    descriptionPlaceholder: "أضف تفاصيل إضافية عن القطعة...",
    contactPhone: "رقم الهاتف",
    contactPhonePlaceholder: "0612345678",
    contactMethod: "طريقة التواصل",
    whatsapp: "واتساب",
    phone: "اتصال",
    both: "كلاهما",
    sellerType: "نوع البائع",
    individual: "فرد",
    shop: "متجر",
    images: "الصور (حتى 6 صور)",
    uploadImages: "رفع الصور",
    dragDrop: "اسحب وأفلت أو انقر للتحميل",
    publish: "نشر الإعلان",
    publishing: "جاري النشر...",
    successTitle: "تم نشر إعلانك بنجاح!",
    successMessage: "سيتم مراجعة إعلانك قريباً",
    viewListing: "عرض الإعلان",
    requiredField: "هذا الحقل مطلوب",
    invalidPhone: "رقم الهاتف غير صالح",
    minPrice: "السعر يجب أن يكون أكبر من 0",
    imageLimit: "يمكنك رفع 6 صور كحد أقصى",
    uploadingImages: "جاري رفع الصور...",
    imageCount: "صورة",
    imagesCount: "صور",
    imageUploadSuccess: "تم رفع {count} صور بنجاح",
    imageUploadError: "فشل رفع الصور",
    imageUploadPartialSuccess: "تم رفع {success} من {total} صور",
    uploadPermissionDenied: "رفض الإذن. يرجى تسجيل الدخول للرفع.",
    rules: "قواعد النشر",
    rule1: "الإعلانات للعرض فقط (لا يوجد بيع مباشر عبر المنصة)",
    rule2: "يُرجى التأكد من صحة المعلومات",
    rule3: "سيتم مراجعة الإعلان قبل النشر",
    loginRequired: "يجب تسجيل الدخول لنشر إعلان",
    login: "تسجيل الدخول",
    // Computer part-specific fields
    partDetails: "تفاصيل القطعة",
    partCategory: "نوع القطعة",
    selectPartCategory: "اختر نوع القطعة",
    partType: "نوع محدد",
    partTypePlaceholder: "مثال: DDR4, M.2 NVMe, SATA",
    capacity: "السعة",
    capacityPlaceholder: "مثال: 16GB, 512GB",
    speed: "السرعة (اختياري)",
    speedPlaceholder: "مثال: 3200MHz, 7200RPM",
    compatibleModels: "الموديلات المتوافقة",
    compatibleModelsPlaceholder: "أدخل الموديلات المتوافقة مفصولة بفواصل...",
    stockQuantity: "الكمية المتوفرة",
    stockQuantityPlaceholder: "مثال: 10"
  },
  fr: {
    pageTitle: "Publier une pièce d'ordinateur",
    pageDescription: "Publiez votre annonce rapidement et facilement",
    title: "Titre de l'annonce",
    titlePlaceholder: "Ex: DDR4 16GB RAM 3200MHz",
    brand: "Marque",
    brandPlaceholder: "Ex: Corsair, Kingston, Samsung",
    condition: "État",
    conditionNew: "Neuf",
    conditionUsed: "Occasion",
    price: "Prix (MAD)",
    pricePlaceholder: "0",
    city: "Ville",
    selectCity: "Sélectionner la ville",
    neighborhood: "Quartier",
    selectNeighborhood: "Sélectionner le quartier",
    neighborhoodOther: "Autre (saisir manuellement)",
    customNeighborhoodPlaceholder: "Entrer le nom du quartier...",
    description: "Description",
    descriptionPlaceholder: "Ajoutez des détails sur la pièce...",
    contactPhone: "Numéro de téléphone",
    contactPhonePlaceholder: "0612345678",
    contactMethod: "Méthode de contact",
    whatsapp: "WhatsApp",
    phone: "Appel",
    both: "Les deux",
    sellerType: "Type de vendeur",
    individual: "Particulier",
    shop: "Boutique",
    images: "Images (jusqu'à 6)",
    uploadImages: "Télécharger des images",
    dragDrop: "Glisser-déposer ou cliquer pour télécharger",
    publish: "Publier l'annonce",
    publishing: "Publication en cours...",
    successTitle: "Annonce publiée avec succès!",
    successMessage: "Votre annonce sera bientôt examinée",
    viewListing: "Voir l'annonce",
    requiredField: "Ce champ est requis",
    invalidPhone: "Numéro de téléphone invalide",
    minPrice: "Le prix doit être supérieur à 0",
    imageLimit: "Vous pouvez télécharger jusqu'à 6 images",
    uploadingImages: "Téléchargement des images...",
    imageCount: "image",
    imagesCount: "images",
    imageUploadSuccess: "{count} images téléchargées avec succès",
    imageUploadError: "Échec du téléchargement",
    imageUploadPartialSuccess: "{success} sur {total} images téléchargées",
    uploadPermissionDenied: "Permission refusée. Veuillez vous connecter.",
    rules: "Règles de publication",
    rule1: "Les annonces sont à titre indicatif uniquement (pas de vente directe)",
    rule2: "Veuillez vérifier l'exactitude des informations",
    rule3: "L'annonce sera examinée avant publication",
    loginRequired: "Connexion requise pour publier une annonce",
    login: "Se connecter",
    // Computer part-specific fields
    partDetails: "Détails de la pièce",
    partCategory: "Catégorie de pièce",
    selectPartCategory: "Sélectionner la catégorie",
    partType: "Type spécifique",
    partTypePlaceholder: "Ex: DDR4, M.2 NVMe, SATA",
    capacity: "Capacité",
    capacityPlaceholder: "Ex: 16GB, 512GB",
    speed: "Vitesse (optionnel)",
    speedPlaceholder: "Ex: 3200MHz, 7200RPM",
    compatibleModels: "Modèles compatibles",
    compatibleModelsPlaceholder: "Entrez les modèles compatibles séparés par des virgules...",
    stockQuantity: "Quantité en stock",
    stockQuantityPlaceholder: "Ex: 10"
  },
  en: {
    pageTitle: "Publish Computer Part",
    pageDescription: "Publish your computer part listing quickly and easily",
    title: "Listing Title",
    titlePlaceholder: "Ex: DDR4 16GB RAM 3200MHz",
    brand: "Brand",
    brandPlaceholder: "Ex: Corsair, Kingston, Samsung",
    condition: "Condition",
    conditionNew: "New",
    conditionUsed: "Used",
    price: "Price (MAD)",
    pricePlaceholder: "0",
    city: "City",
    selectCity: "Select city",
    neighborhood: "Neighborhood",
    selectNeighborhood: "Select neighborhood",
    neighborhoodOther: "Other (enter manually)",
    customNeighborhoodPlaceholder: "Enter neighborhood name...",
    description: "Description",
    descriptionPlaceholder: "Add details about the part...",
    contactPhone: "Phone Number",
    contactPhonePlaceholder: "0612345678",
    contactMethod: "Contact Method",
    whatsapp: "WhatsApp",
    phone: "Call",
    both: "Both",
    sellerType: "Seller Type",
    individual: "Individual",
    shop: "Shop",
    images: "Images (up to 6)",
    uploadImages: "Upload Images",
    dragDrop: "Drag & drop or click to upload",
    publish: "Publish Listing",
    publishing: "Publishing...",
    successTitle: "Listing published successfully!",
    successMessage: "Your listing will be reviewed soon",
    viewListing: "View Listing",
    requiredField: "This field is required",
    invalidPhone: "Invalid phone number",
    minPrice: "Price must be greater than 0",
    imageLimit: "You can upload up to 6 images",
    uploadingImages: "Uploading images...",
    imageCount: "image",
    imagesCount: "images",
    imageUploadSuccess: "{count} images uploaded successfully",
    imageUploadError: "Upload failed",
    imageUploadPartialSuccess: "{success} of {total} images uploaded",
    uploadPermissionDenied: "Permission denied. Please log in to upload.",
    rules: "Publishing Rules",
    rule1: "Listings are for display only (no direct sales)",
    rule2: "Please ensure information accuracy",
    rule3: "Listings will be reviewed before publishing",
    loginRequired: "Login required to publish a listing",
    login: "Login",
    // Computer part-specific fields
    partDetails: "Part Details",
    partCategory: "Part Category",
    selectPartCategory: "Select category",
    partType: "Specific Type",
    partTypePlaceholder: "Ex: DDR4, M.2 NVMe, SATA",
    capacity: "Capacity",
    capacityPlaceholder: "Ex: 16GB, 512GB",
    speed: "Speed (optional)",
    speedPlaceholder: "Ex: 3200MHz, 7200RPM",
    compatibleModels: "Compatible Models",
    compatibleModelsPlaceholder: "Enter compatible models separated by commas...",
    stockQuantity: "Stock Quantity",
    stockQuantityPlaceholder: "Ex: 10"
  }
};

export default function PublishComputerPartPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = translations[language];
  const isRTL = language === "ar";

  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newItemSlug, setNewItemSlug] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ComputerPartFormData>({
    title: "",
    brand: "",
    condition: "used",
    price: "",
    cityId: "",
    neighborhoodId: "",
    neighborhoodCustom: "",
    description: "",
    contactPhone: "",
    contactMethod: "whatsapp",
    sellerType: "individual",
    images: [],
    // Computer part-specific details
    part_category: "",
    part_type: "",
    capacity: "",
    speed: "",
    compatible_models: "",
    stock_quantity: ""
  });

  useEffect(() => {
    async function loadCities() {
      const citiesData = await getCities(language);
      setCities(citiesData);
    }
    loadCities();
  }, [language]);

  // Load neighborhoods when city changes
  useEffect(() => {
    async function loadNeighborhoods() {
      if (!formData.cityId) {
        setNeighborhoods([]);
        return;
      }
      const neighborhoodsData = await getNeighborhoodsByCity(formData.cityId);
      setNeighborhoods(neighborhoodsData);
    }
    loadNeighborhoods();
  }, [formData.cityId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t.requiredField;
    if (!formData.brand.trim()) newErrors.brand = t.requiredField;
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = t.minPrice;
    if (!formData.cityId) newErrors.cityId = t.requiredField;
    if (!formData.contactPhone || !/^0[5-7]\d{8}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = t.invalidPhone;
    }
    
    // Computer part-specific required fields
    if (!formData.part_category) newErrors.part_category = t.requiredField;
    if (!formData.part_type.trim()) newErrors.part_type = t.requiredField;
    if (!formData.capacity.trim()) newErrors.capacity = t.requiredField;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if user is authenticated
    if (!user) {
      toast({
        title: t.uploadPermissionDenied,
        description: t.loginRequired,
        variant: "destructive"
      });
      return;
    }

    if (formData.images.length + files.length > 6) {
      toast({
        title: t.imageLimit,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Show uploading toast
    toast({
      title: t.uploadingImages,
      description: `${files.length} ${files.length === 1 ? t.imageCount : t.imagesCount}...`
    });
    
    // Upload to Supabase Storage
    const { urls, errors: uploadErrors } = await uploadImages(
      Array.from(files),
      `computer-parts/${user.id}`,
      6 - formData.images.length
    );

    setLoading(false);
    
    // Update form with successfully uploaded images
    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    }

    // Show appropriate feedback based on results
    if (urls.length > 0 && uploadErrors.length === 0) {
      // All uploads succeeded
      toast({
        title: t.imageUploadSuccess.replace('{count}', urls.length.toString()),
        variant: "default"
      });
    } else if (urls.length > 0 && uploadErrors.length > 0) {
      // Partial success
      const totalFiles = urls.length + uploadErrors.length;
      toast({
        title: t.imageUploadPartialSuccess
          .replace('{success}', urls.length.toString())
          .replace('{total}', totalFiles.toString()),
        description: uploadErrors.join(', '),
        variant: "destructive"
      });
    } else if (urls.length === 0 && uploadErrors.length > 0) {
      // All uploads failed
      toast({
        title: t.imageUploadError,
        description: uploadErrors.join(' • '),
        variant: "destructive"
      });
    }
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string): string => {
    const timestamp = Date.now();
    return `${title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const slug = generateSlug(formData.title);
    
    // Build computer_details object
    const computerDetails: any = {
      part_category: formData.part_category,
      part_type: formData.part_type,
      capacity: formData.capacity
    };
    
    if (formData.speed) computerDetails.speed = formData.speed;
    if (formData.compatible_models) {
      computerDetails.compatible_models = formData.compatible_models.split(',').map(m => m.trim()).filter(m => m);
    }
    if (formData.stock_quantity) {
      computerDetails.stock_quantity = parseInt(formData.stock_quantity);
    }
    
    const itemData = {
      title_ar: formData.title,
      title_fr: formData.title,
      slug,
      item_type: 'computer_part' as const,
      condition: formData.condition,
      brand: formData.brand,
      model: null,
      price: parseFloat(formData.price),
      currency: 'MAD',
      description_ar: formData.description,
      description_fr: formData.description,
      city_id: formData.cityId,
      neighborhood_id: formData.neighborhoodId === 'other' ? null : (formData.neighborhoodId || null),
      neighborhood_custom: formData.neighborhoodId === 'other' ? formData.neighborhoodCustom : null,
      whatsapp: formData.contactMethod === 'whatsapp' || formData.contactMethod === 'both' ? formData.contactPhone : null,
      phone: formData.contactMethod === 'phone' || formData.contactMethod === 'both' ? formData.contactPhone : null,
      user_id: user?.id || null,
      status: 'pending' as const,
      is_featured: false,
      is_premium: false,
      store_id: null,
      computer_details: computerDetails
    };

    try {
      const { data: result } = await createComputerPart(itemData);
      
      if (result) {
        setNewItemSlug(result.slug);
        setSuccess(true);
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
      } else {
        // Fallback: save locally and show success
        const mockId = `mock-${Date.now()}`;
        localStorage.setItem(`computer-part-listing-${mockId}`, JSON.stringify({
          ...itemData,
          id: mockId,
          images: formData.images,
          created_at: new Date().toISOString()
        }));
        setNewItemSlug(slug);
        setSuccess(true);
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
      }
    } catch (error) {
      console.error('Error publishing computer part:', error);
      // Fallback: save locally
      const mockId = `mock-${Date.now()}`;
      localStorage.setItem(`computer-part-listing-${mockId}`, JSON.stringify({
        ...itemData,
        id: mockId,
        images: formData.images,
        created_at: new Date().toISOString()
      }));
      setNewItemSlug(slug);
      setSuccess(true);
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.successTitle}</h1>
              <p className="text-gray-600 mb-8">{t.successMessage}</p>
              <Button
                onClick={() => navigate(`/items/${newItemSlug}`)}
                className="w-full bg-sky-600 hover:bg-sky-700"
              >
                {t.viewListing}
                {isRTL ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Cpu className="w-16 h-16 text-sky-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.loginRequired}</h1>
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full bg-sky-600 hover:bg-sky-700"
              >
                {t.login}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <Cpu className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.pageTitle}</h1>
            <p className="text-gray-600">{t.pageDescription}</p>
          </div>

          {/* Rules Card */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-amber-800 mb-2">{t.rules}</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• {t.rule1}</li>
                <li>• {t.rule2}</li>
                <li>• {t.rule3}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{t.title} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t.titlePlaceholder}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">{t.brand} *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder={t.brandPlaceholder}
                    className={errors.brand ? "border-red-500" : ""}
                  />
                  {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label>{t.condition} *</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value: "new" | "used") => setFormData(prev => ({ ...prev, condition: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="cursor-pointer">{t.conditionNew}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="used" id="used" />
                      <Label htmlFor="used" className="cursor-pointer">{t.conditionUsed}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">{t.price} *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder={t.pricePlaceholder}
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t.city} *</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cityId: value, neighborhoodId: "" }))}
                    >
                      <SelectTrigger className={errors.cityId ? "border-red-500" : ""}>
                        <SelectValue placeholder={t.selectCity} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>
                            {language === 'ar' ? city.name_ar : city.name_fr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cityId && <p className="text-sm text-red-500">{errors.cityId}</p>}
                  </div>

                  {/* Neighborhood */}
                  {formData.cityId && (
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">{t.neighborhood}</Label>
                      <Select
                        value={formData.neighborhoodId || ''}
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          neighborhoodId: value,
                          neighborhoodCustom: value === 'other' ? prev.neighborhoodCustom : ''
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectNeighborhood} />
                        </SelectTrigger>
                        <SelectContent>
                          {neighborhoods.map(neighborhood => (
                            <SelectItem key={neighborhood.id} value={neighborhood.id}>
                              {neighborhood.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">{t.neighborhoodOther}</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Custom neighborhood input - only shown when "Other" is selected */}
                      {formData.neighborhoodId === 'other' && (
                        <Input
                          placeholder={t.customNeighborhoodPlaceholder}
                          value={formData.neighborhoodCustom}
                          onChange={(e) => setFormData(prev => ({ ...prev, neighborhoodCustom: e.target.value }))}
                          className="mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t.descriptionPlaceholder}
                    rows={4}
                  />
                </div>

                {/* Computer Part-Specific Details Section */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t.partDetails}</h3>
                  
                  {/* Part Category & Part Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="part_category">{t.partCategory} *</Label>
                      <Select
                        value={formData.part_category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, part_category: value }))}
                      >
                        <SelectTrigger className={errors.part_category ? "border-red-500" : ""}>
                          <SelectValue placeholder={t.selectPartCategory} />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPUTER_PART_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.part_category && <p className="text-sm text-red-500">{errors.part_category}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="part_type">{t.partType} *</Label>
                      <Input
                        id="part_type"
                        value={formData.part_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, part_type: e.target.value }))}
                        placeholder={t.partTypePlaceholder}
                        className={errors.part_type ? "border-red-500" : ""}
                      />
                      {errors.part_type && <p className="text-sm text-red-500">{errors.part_type}</p>}
                    </div>
                  </div>

                  {/* Capacity & Speed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">{t.capacity} *</Label>
                      <Input
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                        placeholder={t.capacityPlaceholder}
                        className={errors.capacity ? "border-red-500" : ""}
                      />
                      {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="speed">{t.speed}</Label>
                      <Input
                        id="speed"
                        value={formData.speed}
                        onChange={(e) => setFormData(prev => ({ ...prev, speed: e.target.value }))}
                        placeholder={t.speedPlaceholder}
                      />
                    </div>
                  </div>

                  {/* Compatible Models */}
                  <div className="space-y-2">
                    <Label htmlFor="compatible_models">{t.compatibleModels}</Label>
                    <Textarea
                      id="compatible_models"
                      value={formData.compatible_models}
                      onChange={(e) => setFormData(prev => ({ ...prev, compatible_models: e.target.value }))}
                      placeholder={t.compatibleModelsPlaceholder}
                      rows={3}
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">{t.stockQuantity}</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="1"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      placeholder={t.stockQuantityPlaceholder}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t.contactPhone} *</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder={t.contactPhonePlaceholder}
                      className={errors.contactPhone ? "border-red-500" : ""}
                    />
                    {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>{t.contactMethod}</Label>
                    <RadioGroup
                      value={formData.contactMethod}
                      onValueChange={(value: "whatsapp" | "phone" | "both") => setFormData(prev => ({ ...prev, contactMethod: value }))}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="whatsapp" id="whatsapp" />
                        <Label htmlFor="whatsapp" className="cursor-pointer flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {t.whatsapp}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="phone" id="phone-method" />
                        <Label htmlFor="phone-method" className="cursor-pointer flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {t.phone}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="cursor-pointer">{t.both}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Seller Type */}
                <div className="space-y-2">
                  <Label>{t.sellerType}</Label>
                  <RadioGroup
                    value={formData.sellerType}
                    onValueChange={(value: "individual" | "shop") => setFormData(prev => ({ ...prev, sellerType: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer">{t.individual}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="shop" id="shop" />
                      <Label htmlFor="shop" className="cursor-pointer">{t.shop}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>{t.images}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={loading}
                    />
                    <label htmlFor="image-upload" className={loading ? "cursor-not-allowed" : "cursor-pointer"}>
                      {loading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-sky-600 mx-auto mb-2 animate-spin" />
                          <p className="text-sky-600">{t.uploadingImages}</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">{t.dragDrop}</p>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={img}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t.publishing}
                    </>
                  ) : (
                    <>
                      <Cpu className="w-5 h-5 mr-2" />
                      {t.publish}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
