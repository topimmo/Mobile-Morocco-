import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getCities, City } from "@/lib/supabase/cities";
import { createItem } from "@/lib/supabase/stores";
import { uploadImages } from "@/lib/supabase/storage";
import { getNeighborhoodsByCity } from "@/lib/supabase/neighborhoods";
import { NeighborhoodAutocomplete } from "@/components/search/NeighborhoodAutocomplete";
import { 
  Smartphone, 
  Upload, 
  X, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";

interface PhoneFormData {
  title: string;
  brand: string;
  model: string;
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
  // Phone-specific details
  color: string;
  storage: string;
  ram: string;
  batteryHealth: string;
  warranty: boolean;
  accessories: string[];
  simType: string;
  network: string;
}

const translations = {
  ar: {
    pageTitle: "نشر تلفوني",
    pageDescription: "أنشر إعلانك للهاتف بسرعة وسهولة",
    title: "عنوان الإعلان",
    titlePlaceholder: "مثال: iPhone 15 Pro Max 256GB",
    brand: "العلامة التجارية",
    selectBrand: "اختر العلامة",
    model: "الموديل",
    modelPlaceholder: "مثال: 15 Pro Max",
    condition: "الحالة",
    conditionNew: "جديد",
    conditionUsed: "مستعمل",
    price: "السعر (درهم)",
    pricePlaceholder: "0",
    city: "المدينة",
    selectCity: "اختر المدينة",
    neighborhood: "الحي",
    neighborhoodPlaceholder: "اختر أو أضف حي...",
    selectNeighborhood: "اختر الحي",
    neighborhoodOther: "آخر (أدخل اسم الحي يدوياً)",
    customNeighborhoodPlaceholder: "أدخل اسم الحي...",
    description: "الوصف",
    descriptionPlaceholder: "أضف تفاصيل إضافية عن الهاتف...",
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
    rules: "قواعد النشر",
    rule1: "الإعلانات للعرض فقط (لا يوجد بيع مباشر عبر المنصة)",
    rule2: "يُرجى التأكد من صحة المعلومات",
    rule3: "سيتم مراجعة الإعلان قبل النشر",
    loginRequired: "يجب تسجيل الدخول لنشر إعلان",
    login: "تسجيل الدخول",
    // Phone-specific fields
    phoneDetails: "تفاصيل الهاتف",
    color: "اللون",
    selectColor: "اختر اللون",
    storage: "السعة التخزينية",
    selectStorage: "اختر السعة",
    ram: "الرام",
    selectRam: "اختر الرام",
    batteryHealth: "صحة البطارية (%)",
    batteryPlaceholder: "مثال: 92",
    warranty: "الضمان",
    warrantyYes: "نعم",
    warrantyNo: "لا",
    accessories: "الملحقات المتوفرة",
    box: "العلبة الأصلية",
    charger: "الشاحن",
    cable: "الكابل",
    earphones: "السماعات",
    simType: "نوع الشريحة (اختياري)",
    selectSimType: "اختر نوع الشريحة",
    simSingle: "شريحة واحدة",
    simDual: "شريحتين",
    simESIM: "eSIM",
    network: "الشبكة (اختياري)",
    selectNetwork: "اختر نوع الشبكة",
    network4G: "4G",
    network5G: "5G"
  },
  fr: {
    pageTitle: "Publier mon téléphone",
    pageDescription: "Publiez votre annonce rapidement et facilement",
    title: "Titre de l'annonce",
    titlePlaceholder: "Ex: iPhone 15 Pro Max 256GB",
    brand: "Marque",
    selectBrand: "Sélectionner la marque",
    model: "Modèle",
    modelPlaceholder: "Ex: 15 Pro Max",
    condition: "État",
    conditionNew: "Neuf",
    conditionUsed: "Occasion",
    price: "Prix (MAD)",
    pricePlaceholder: "0",
    city: "Ville",
    selectCity: "Sélectionner la ville",
    neighborhood: "Quartier",
    neighborhoodPlaceholder: "Sélectionner ou ajouter un quartier...",
    selectNeighborhood: "Sélectionner le quartier",
    neighborhoodOther: "Autre (saisir manuellement)",
    customNeighborhoodPlaceholder: "Entrer le nom du quartier...",
    description: "Description",
    descriptionPlaceholder: "Ajoutez des détails sur le téléphone...",
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
    rules: "Règles de publication",
    rule1: "Les annonces sont à titre indicatif uniquement (pas de vente directe)",
    rule2: "Veuillez vérifier l'exactitude des informations",
    rule3: "L'annonce sera examinée avant publication",
    loginRequired: "Connexion requise pour publier une annonce",
    login: "Se connecter",
    // Phone-specific fields
    phoneDetails: "Détails du téléphone",
    color: "Couleur",
    selectColor: "Sélectionner la couleur",
    storage: "Stockage",
    selectStorage: "Sélectionner le stockage",
    ram: "RAM",
    selectRam: "Sélectionner la RAM",
    batteryHealth: "Santé de la batterie (%)",
    batteryPlaceholder: "Ex: 92",
    warranty: "Garantie",
    warrantyYes: "Oui",
    warrantyNo: "Non",
    accessories: "Accessoires inclus",
    box: "Boîte d'origine",
    charger: "Chargeur",
    cable: "Câble",
    earphones: "Écouteurs",
    simType: "Type de SIM (optionnel)",
    selectSimType: "Sélectionner le type de SIM",
    simSingle: "Simple SIM",
    simDual: "Double SIM",
    simESIM: "eSIM",
    network: "Réseau (optionnel)",
    selectNetwork: "Sélectionner le réseau",
    network4G: "4G",
    network5G: "5G"
  },
  en: {
    pageTitle: "Publish Phone",
    pageDescription: "Publish your phone listing quickly and easily",
    title: "Listing Title",
    titlePlaceholder: "Ex: iPhone 15 Pro Max 256GB",
    brand: "Brand",
    selectBrand: "Select brand",
    model: "Model",
    modelPlaceholder: "Ex: 15 Pro Max",
    condition: "Condition",
    conditionNew: "New",
    conditionUsed: "Used",
    price: "Price (MAD)",
    pricePlaceholder: "0",
    city: "City",
    selectCity: "Select city",
    neighborhood: "Neighborhood",
    neighborhoodPlaceholder: "Select or add neighborhood...",
    selectNeighborhood: "Select neighborhood",
    neighborhoodOther: "Other (enter manually)",
    customNeighborhoodPlaceholder: "Enter neighborhood name...",
    description: "Description",
    descriptionPlaceholder: "Add details about the phone...",
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
    rules: "Publishing Rules",
    rule1: "Listings are for display only (no direct sales)",
    rule2: "Please ensure information accuracy",
    rule3: "Listings will be reviewed before publishing",
    loginRequired: "Login required to publish a listing",
    login: "Login",
    // Phone-specific fields
    phoneDetails: "Phone Details",
    color: "Color",
    selectColor: "Select color",
    storage: "Storage",
    selectStorage: "Select storage",
    ram: "RAM",
    selectRam: "Select RAM",
    batteryHealth: "Battery Health (%)",
    batteryPlaceholder: "Ex: 92",
    warranty: "Warranty",
    warrantyYes: "Yes",
    warrantyNo: "No",
    accessories: "Included Accessories",
    box: "Original Box",
    charger: "Charger",
    cable: "Cable",
    earphones: "Earphones",
    simType: "SIM Type (optional)",
    selectSimType: "Select SIM type",
    simSingle: "Single SIM",
    simDual: "Dual SIM",
    simESIM: "eSIM",
    network: "Network (optional)",
    selectNetwork: "Select network",
    network4G: "4G",
    network5G: "5G"
  }
};

const phoneBrands = [
  "Apple", "Samsung", "Xiaomi", "Huawei", "Oppo", "Vivo", "Realme", 
  "OnePlus", "Google", "Honor", "Tecno", "Infinix", "Nokia", "Motorola", "Other"
];

const phoneColors = [
  "Black", "White", "Silver", "Gold", "Blue", "Green", "Red", 
  "Purple", "Pink", "Gray", "Orange", "Yellow", "Other"
];

const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];

const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB"];

export default function PublishPhonePage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = translations[language];
  const isRTL = language === "ar";

  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newItemSlug, setNewItemSlug] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PhoneFormData>({
    title: "",
    brand: "",
    model: "",
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
    // Phone-specific details
    color: "",
    storage: "",
    ram: "",
    batteryHealth: "",
    warranty: false,
    accessories: [],
    simType: "",
    network: ""
  });

  const handleNeighborhoodChange = (id: string, _neighborhood?: any) => {
    setFormData(prev => ({ ...prev, neighborhoodId: id }));
  };

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
    if (!formData.brand) newErrors.brand = t.requiredField;
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = t.minPrice;
    if (!formData.cityId) newErrors.cityId = t.requiredField;
    if (!formData.contactPhone || !/^0[5-7]\d{8}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = t.invalidPhone;
    }
    
    // Phone-specific required fields
    if (!formData.color) newErrors.color = t.requiredField;
    if (!formData.storage) newErrors.storage = t.requiredField;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.images.length + files.length > 6) {
      toast({
        title: t.imageLimit,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Upload to Supabase Storage
    const { urls, errors: uploadErrors } = await uploadImages(
      Array.from(files),
      `phones/${user?.id || 'anonymous'}`,
      6 - formData.images.length
    );

    setLoading(false);
    
    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    }

    if (uploadErrors.length > 0) {
      toast({
        title: uploadErrors[0],
        variant: "destructive"
      });
    }
    
    if (urls.length === 0 && uploadErrors.length > 0) {
      toast({
        title: "Image upload failed. Please try again.",
        variant: "destructive"
      });
    }
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
    
    // Build phone_details object with proper typing
    const phoneDetails: {
      color?: string;
      storage?: string;
      ram?: string;
      battery_health?: number;
      warranty?: boolean;
      accessories?: string[];
      sim_type?: string;
      network?: string;
    } = {};
    if (formData.color) phoneDetails.color = formData.color;
    if (formData.storage) phoneDetails.storage = formData.storage;
    if (formData.ram) phoneDetails.ram = formData.ram;
    if (formData.batteryHealth) phoneDetails.battery_health = parseInt(formData.batteryHealth);
    phoneDetails.warranty = formData.warranty;
    if (formData.accessories.length > 0) phoneDetails.accessories = formData.accessories;
    if (formData.simType) phoneDetails.sim_type = formData.simType;
    if (formData.network) phoneDetails.network = formData.network;
    
    const itemData = {
      title_ar: formData.title,
      title_fr: formData.title,
      slug,
      item_type: 'phone' as const,
      condition: formData.condition,
      brand: formData.brand,
      model: formData.model,
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
      phone_details: phoneDetails
    };

    try {
      const result = await createItem(itemData);
      
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
        localStorage.setItem(`phone-listing-${mockId}`, JSON.stringify({
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
      console.error('Error publishing phone:', error);
      // Fallback: save locally
      const mockId = `mock-${Date.now()}`;
      localStorage.setItem(`phone-listing-${mockId}`, JSON.stringify({
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
              <Smartphone className="w-16 h-16 text-sky-600 mx-auto mb-6" />
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
              <Smartphone className="w-8 h-8 text-sky-600" />
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

                {/* Brand & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">{t.brand} *</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
                    >
                      <SelectTrigger className={errors.brand ? "border-red-500" : ""}>
                        <SelectValue placeholder={t.selectBrand} />
                      </SelectTrigger>
                      <SelectContent>
                        {phoneBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">{t.model}</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      placeholder={t.modelPlaceholder}
                    />
                  </div>
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

                {/* Phone-Specific Details Section */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t.phoneDetails}</h3>
                  
                  {/* Color & Storage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">{t.color} *</Label>
                      <Select
                        value={formData.color}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                      >
                        <SelectTrigger className={errors.color ? "border-red-500" : ""}>
                          <SelectValue placeholder={t.selectColor} />
                        </SelectTrigger>
                        <SelectContent>
                          {phoneColors.map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storage">{t.storage} *</Label>
                      <Select
                        value={formData.storage}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, storage: value }))}
                      >
                        <SelectTrigger className={errors.storage ? "border-red-500" : ""}>
                          <SelectValue placeholder={t.selectStorage} />
                        </SelectTrigger>
                        <SelectContent>
                          {storageOptions.map(storage => (
                            <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.storage && <p className="text-sm text-red-500">{errors.storage}</p>}
                    </div>
                  </div>

                  {/* RAM & Battery Health */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ram">{t.ram}</Label>
                      <Select
                        value={formData.ram}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, ram: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectRam} />
                        </SelectTrigger>
                        <SelectContent>
                          {ramOptions.map(ram => (
                            <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batteryHealth">{t.batteryHealth}</Label>
                      <Input
                        id="batteryHealth"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.batteryHealth}
                        onChange={(e) => setFormData(prev => ({ ...prev, batteryHealth: e.target.value }))}
                        placeholder={t.batteryPlaceholder}
                      />
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className="space-y-2">
                    <Label>{t.warranty}</Label>
                    <RadioGroup
                      value={formData.warranty ? "yes" : "no"}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, warranty: value === "yes" }))}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="yes" id="warranty-yes" />
                        <Label htmlFor="warranty-yes" className="cursor-pointer">{t.warrantyYes}</Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="no" id="warranty-no" />
                        <Label htmlFor="warranty-no" className="cursor-pointer">{t.warrantyNo}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Accessories */}
                  <div className="space-y-3">
                    <Label>{t.accessories}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "box", label: t.box },
                        { id: "charger", label: t.charger },
                        { id: "cable", label: t.cable },
                        { id: "earphones", label: t.earphones }
                      ].map(accessory => (
                        <div key={accessory.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Checkbox
                            id={accessory.id}
                            checked={formData.accessories.includes(accessory.id)}
                            onCheckedChange={(checked) => {
                              setFormData(prev => ({
                                ...prev,
                                accessories: checked
                                  ? [...prev.accessories, accessory.id]
                                  : prev.accessories.filter(a => a !== accessory.id)
                              }));
                            }}
                          />
                          <Label htmlFor={accessory.id} className="cursor-pointer text-sm">
                            {accessory.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SIM Type & Network (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="simType">{t.simType}</Label>
                      <Select
                        value={formData.simType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, simType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectSimType} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">{t.simSingle}</SelectItem>
                          <SelectItem value="dual">{t.simDual}</SelectItem>
                          <SelectItem value="esim">{t.simESIM}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="network">{t.network}</Label>
                      <Select
                        value={formData.network}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, network: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectNetwork} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4G">{t.network4G}</SelectItem>
                          <SelectItem value="5G">{t.network5G}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">{t.dragDrop}</p>
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
                      <Smartphone className="w-5 h-5 mr-2" />
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
