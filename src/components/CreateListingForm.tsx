import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CitySelector, NeighborhoodAutocomplete } from '@/components/search';
import { getCategories, Category } from '@/lib/supabase/categories';
import { createListing, addListingImage } from '@/lib/supabase/listings';
import { City } from '@/lib/supabase/cities';
import { Neighborhood } from '@/lib/supabase/neighborhoods';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Loader2, X, Upload, Info } from 'lucide-react';
import { trackListingCreated } from '@/services/analyticsService';
import { uploadImages, deleteImage } from '@/lib/supabase/storage';

interface CreateListingFormProps {
  onSuccess?: (listingId: string) => void;
  onCancel?: () => void;
}

// Category types for discriminated unions
type CategoryType = 'phone' | 'accessory' | 'spare-part' | 'other';

// Helper to determine category type from category slug
// NOTE: This is a temporary approach that works with existing database schema.
// In the future, consider adding a 'category_type' field to the categories table
// for more robust and maintainable category detection.
function getCategoryType(categorySlug: string): CategoryType {
  if (categorySlug.includes('telephone') || categorySlug.includes('phone')) {
    return 'phone';
  }
  if (categorySlug.includes('accessoire')) {
    return 'accessory';
  }
  if (categorySlug.includes('piece') || categorySlug.includes('detach')) {
    return 'spare-part';
  }
  return 'other';
}

export function CreateListingForm({ onSuccess, onCancel }: CreateListingFormProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state - Required fields
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [phone, setPhone] = useState('');
  
  // Optional fields
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished' | ''>('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  // Category-specific technical fields
  // These are appended to the description field on submission since there's
  // no dedicated schema fields for them yet
  const [storage, setStorage] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [partType, setPartType] = useState('');
  
  // Phone-specific fields (as per requirements)
  const [color, setColor] = useState('');
  const [ram, setRam] = useState('');
  const [warranty, setWarranty] = useState<'yes' | 'no' | ''>('');
  const [accessories, setAccessories] = useState<string[]>([]);
  const [simType, setSimType] = useState('');
  const [network, setNetwork] = useState('');
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Derived state - get current category type
  const selectedCategory = categories.find(cat => cat.id === categoryId);
  const categoryType = selectedCategory ? getCategoryType(selectedCategory.slug) : 'other';

  const labels = {
    title: isRTL ? 'إنشاء إعلان جديد' : 'Créer une nouvelle annonce',
    basicInfo: isRTL ? 'المعلومات الأساسية' : 'Informations de base',
    titleAr: isRTL ? 'العنوان (عربي) *' : 'Titre (Arabe) *',
    titleFr: isRTL ? 'العنوان (فرنسي)' : 'Titre (Français)',
    descriptionAr: isRTL ? 'الوصف (عربي)' : 'Description (Arabe)',
    descriptionFr: isRTL ? 'الوصف (فرنسي)' : 'Description (Français)',
    price: isRTL ? 'السعر (درهم) *' : 'Prix (MAD) *',
    category: isRTL ? 'الفئة *' : 'Catégorie *',
    selectCategory: isRTL ? 'اختر الفئة' : 'Sélectionner une catégorie',
    condition: isRTL ? 'الحالة' : 'État',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    brand: isRTL ? 'العلامة التجارية' : 'Marque',
    model: isRTL ? 'الموديل' : 'Modèle',
    location: isRTL ? 'الموقع' : 'Emplacement',
    city: isRTL ? 'المدينة *' : 'Ville *',
    neighborhood: isRTL ? 'الحي' : 'Quartier',
    contact: isRTL ? 'معلومات الاتصال' : 'Informations de contact',
    phone: isRTL ? 'رقم الهاتف *' : 'Numéro de téléphone *',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    images: isRTL ? 'الصور' : 'Images',
    uploadImages: isRTL ? 'رفع الصور' : 'Télécharger des images',
    dragDrop: isRTL ? 'اسحب وأفلت أو انقر للتحميل' : 'Glisser-déposer ou cliquer',
    imageLimit: isRTL ? 'الحد الأقصى 6 صور' : 'Maximum 6 images',
    submit: isRTL ? 'نشر الإعلان' : 'Publier l\'annonce',
    cancel: isRTL ? 'إلغاء' : 'Annuler',
    submitting: isRTL ? 'جاري النشر...' : 'Publication en cours...',
    success: isRTL ? 'تم إنشاء الإعلان بنجاح' : 'Annonce créée avec succès',
    error: isRTL ? 'حدث خطأ' : 'Une erreur s\'est produite',
    required: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs obligatoires',
    // Category-specific fields
    technicalDetails: isRTL ? 'التفاصيل التقنية (اختيارية)' : 'Détails techniques (optionnels)',
    storage: isRTL ? 'السعة التخزينية' : 'Stockage',
    batteryHealth: isRTL ? 'صحة البطارية' : 'Santé de la batterie',
    compatibility: isRTL ? 'التوافق' : 'Compatibilité',
    partType: isRTL ? 'نوع القطعة' : 'Type de pièce',
    color: isRTL ? 'اللون *' : 'Couleur *',
    ram: isRTL ? 'الذاكرة العشوائية (RAM)' : 'RAM',
    warranty: isRTL ? 'الضمان' : 'Garantie',
    yes: isRTL ? 'نعم' : 'Oui',
    no: isRTL ? 'لا' : 'Non',
    accessories: isRTL ? 'الملحقات' : 'Accessoires',
    box: isRTL ? 'العلبة' : 'Boîte',
    charger: isRTL ? 'الشاحن' : 'Chargeur',
    cable: isRTL ? 'الكابل' : 'Câble',
    earphones: isRTL ? 'السماعات' : 'Écouteurs',
    simType: isRTL ? 'نوع الشريحة' : 'Type de SIM',
    network: isRTL ? 'الشبكة' : 'Réseau',
    helperText: isRTL 
      ? 'الحقول الاختيارية تساعد إعلانك على الحصول على مزيد من الظهور' 
      : 'Les champs optionnels aident votre annonce à obtenir plus de visibilité',
    requiredFieldsOnly: isRTL ? '* الحقول المطلوبة فقط' : '* Champs requis uniquement',
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      const data = await getCategories();
      setCategories(data);
      setLoadingCategories(false);
    };
    loadCategories();
  }, []);

  const handleCityChange = (id: string, city?: City) => {
    setCityId(id);
    setNeighborhoodId(''); // Reset neighborhood when city changes
  };

  const handleNeighborhoodChange = (id: string, neighborhood?: Neighborhood) => {
    setNeighborhoodId(id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > 6) {
      toast({
        title: labels.imageLimit,
        variant: 'destructive',
      });
      return;
    }

    setUploadingImages(true);
    
    const { urls, errors } = await uploadImages(
      Array.from(files),
      `listings/${user?.id || 'anonymous'}`,
      6 - imageUrls.length
    );

    setUploadingImages(false);

    if (urls.length > 0) {
      setImageUrls(prev => [...prev, ...urls]);
    }

    if (errors.length > 0) {
      toast({
        title: errors[0],
        variant: 'destructive',
      });
    }
  };

  const removeImage = async (index: number) => {
    const urlToRemove = imageUrls[index];
    // Delete from storage
    await deleteImage(urlToRemove);
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: labels.error,
        description: isRTL ? 'يجب تسجيل الدخول أولاً' : 'Vous devez vous connecter',
        variant: 'destructive',
      });
      return;
    }

    // Only validate required fields: title, price, category, city, phone
    // For phones, also validate color and storage (required per spec)
    if (!titleAr.trim() || !price || !categoryId || !cityId || !phone.trim()) {
      toast({
        title: labels.error,
        description: labels.required,
        variant: 'destructive',
      });
      return;
    }

    // Phone-specific required fields
    if (categoryType === 'phone' && (!color.trim() || !storage.trim())) {
      toast({
        title: labels.error,
        description: isRTL 
          ? 'اللون والسعة التخزينية مطلوبان للهواتف' 
          : 'La couleur et le stockage sont requis pour les téléphones',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Build technical details text for category-specific fields
      let technicalDetails = '';
      if (categoryType === 'phone') {
        if (color) technicalDetails += `\n${isRTL ? 'اللون: ' : 'Couleur: '}${color}`;
        if (storage) technicalDetails += `\n${isRTL ? 'السعة: ' : 'Stockage: '}${storage}`;
        if (ram) technicalDetails += `\n${isRTL ? 'الذاكرة: ' : 'RAM: '}${ram}`;
        if (batteryHealth) technicalDetails += `\n${isRTL ? 'صحة البطارية: ' : 'Santé batterie: '}${batteryHealth}`;
        if (warranty) technicalDetails += `\n${isRTL ? 'الضمان: ' : 'Garantie: '}${warranty === 'yes' ? (isRTL ? 'نعم' : 'Oui') : (isRTL ? 'لا' : 'Non')}`;
        if (accessories.length > 0) technicalDetails += `\n${isRTL ? 'الملحقات: ' : 'Accessoires: '}${accessories.join(', ')}`;
        if (simType) technicalDetails += `\n${isRTL ? 'نوع الشريحة: ' : 'Type SIM: '}${simType}`;
        if (network) technicalDetails += `\n${isRTL ? 'الشبكة: ' : 'Réseau: '}${network}`;
      } else if (categoryType === 'accessory' && compatibility) {
        technicalDetails += `\n${isRTL ? 'التوافق: ' : 'Compatibilité: '}${compatibility}`;
      } else if (categoryType === 'spare-part') {
        if (partType) technicalDetails += `\n${isRTL ? 'نوع القطعة: ' : 'Type: '}${partType}`;
        if (compatibility) technicalDetails += `\n${isRTL ? 'التوافق: ' : 'Compatibilité: '}${compatibility}`;
      }

      // Append technical details to description
      const finalDescriptionAr = descriptionAr.trim() + (technicalDetails && isRTL ? technicalDetails : '');
      const finalDescriptionFr = descriptionFr.trim() + (technicalDetails && !isRTL ? technicalDetails : '');

      // Build phone_details JSON for phones
      const phoneDetails = categoryType === 'phone' ? {
        color: color.trim() || undefined,
        storage: storage.trim() || undefined,
        ram: ram.trim() || undefined,
        battery_health: batteryHealth.trim() || undefined,
        warranty: warranty || undefined,
        accessories: accessories.length > 0 ? accessories : undefined,
        sim_type: simType.trim() || undefined,
        network: network || undefined,
      } : undefined;

      const { data: listing, error } = await createListing({
        user_id: user.id,
        title_ar: titleAr.trim(),
        title_fr: titleFr.trim() || titleAr.trim(),
        description_ar: finalDescriptionAr || null,
        description_fr: finalDescriptionFr || null,
        price: parseFloat(price),
        currency: 'MAD',
        category_id: categoryId,
        city_id: cityId,
        neighborhood_id: neighborhoodId || null,
        condition: condition || null,
        brand: brand.trim() || null,
        model: model.trim() || null,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || null,
        status: 'pending',
        phone_details: phoneDetails || null,
      } as any);

      if (error) throw error;

      // Add images
      if (listing && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await addListingImage(listing.id, imageUrls[i], undefined, undefined, i);
        }
      }

      // Track listing created
      trackListingCreated(categoryId);

      toast({
        title: labels.success,
        description: isRTL ? 'سيتم مراجعة الإعلان قبل النشر' : 'L\'annonce sera examinée avant publication',
      });

      onSuccess?.(listing?.id || '');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: labels.error,
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Helper Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
            {labels.helperText}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {labels.requiredFieldsOnly}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.basicInfo}</CardTitle>
          <CardDescription className={isRTL ? 'text-right' : ''}>
            {isRTL 
              ? 'املأ المعلومات الأساسية لإعلانك' 
              : 'Remplissez les informations de base de votre annonce'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.titleAr}</Label>
              <Input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Entrez le titre en arabe'}
                dir="rtl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.titleFr}</Label>
              <Input
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder={isRTL ? 'أدخل العنوان بالفرنسية (اختياري)' : 'Entrez le titre en français (optionnel)'}
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.descriptionAr}</Label>
              <Textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder={isRTL ? 'وصف المنتج بالعربية (اختياري)' : 'Description en arabe (optionnel)'}
                dir="rtl"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.descriptionFr}</Label>
              <Textarea
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder={isRTL ? 'وصف المنتج بالفرنسية (اختياري)' : 'Description en français (optionnel)'}
                dir="ltr"
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.price}</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.category}</Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={loadingCategories}>
                <SelectTrigger>
                  <SelectValue placeholder={labels.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {isRTL ? cat.name_ar : cat.name_fr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-specific technical details - Only show when category is selected */}
      {categoryId && (
        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'text-right' : ''}>{labels.technicalDetails}</CardTitle>
            <CardDescription className={isRTL ? 'text-right' : ''}>
              {labels.helperText}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common optional fields for all categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{labels.condition}</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as typeof condition)}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر الحالة (اختياري)' : 'Sélectionner l\'état (optionnel)'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{labels.new}</SelectItem>
                    <SelectItem value="used">{labels.used}</SelectItem>
                    <SelectItem value="refurbished">{labels.refurbished}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{labels.brand}</Label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Apple, Samsung, Xiaomi..."
                />
              </div>
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{labels.model}</Label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="iPhone 14, Galaxy S23..."
                />
              </div>
            </div>

            {/* Phone-specific fields */}
            {categoryType === 'phone' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.color}</Label>
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder={isRTL ? 'مثال: أسود، أبيض، أزرق' : 'ex: Noir, Blanc, Bleu'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.storage}</Label>
                    <Select value={storage} onValueChange={setStorage} required>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر السعة' : 'Sélectionner'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64GB">64GB</SelectItem>
                        <SelectItem value="128GB">128GB</SelectItem>
                        <SelectItem value="256GB">256GB</SelectItem>
                        <SelectItem value="512GB">512GB</SelectItem>
                        <SelectItem value="1TB">1TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.ram}</Label>
                    <Input
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      placeholder={isRTL ? 'مثال: 4GB, 6GB, 8GB' : 'ex: 4GB, 6GB, 8GB'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.batteryHealth}</Label>
                    <Input
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(e.target.value)}
                      placeholder={isRTL ? 'مثال: 85%, 90%, ممتازة' : 'ex: 85%, 90%, Excellente'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.warranty}</Label>
                    <Select value={warranty} onValueChange={(v) => setWarranty(v as typeof warranty)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر' : 'Sélectionner'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{labels.yes}</SelectItem>
                        <SelectItem value="no">{labels.no}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.simType}</Label>
                    <Input
                      value={simType}
                      onChange={(e) => setSimType(e.target.value)}
                      placeholder={isRTL ? 'مثال: نانو، eSIM' : 'ex: Nano, eSIM'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.network}</Label>
                    <Select value={network} onValueChange={setNetwork}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر' : 'Sélectionner'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4G">4G</SelectItem>
                        <SelectItem value="5G">5G</SelectItem>
                        <SelectItem value="4G/5G">4G/5G</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className={isRTL ? 'text-right block' : ''}>{labels.accessories}</Label>
                    <div className="space-y-2 pt-2">
                      {['box', 'charger', 'cable', 'earphones'].map((acc) => (
                        <div key={acc} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Checkbox
                            id={acc}
                            checked={accessories.includes(acc)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAccessories([...accessories, acc]);
                              } else {
                                setAccessories(accessories.filter(a => a !== acc));
                              }
                            }}
                          />
                          <label
                            htmlFor={acc}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {labels[acc as keyof typeof labels] || acc}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accessory-specific fields */}
            {categoryType === 'accessory' && (
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{labels.compatibility}</Label>
                <Input
                  value={compatibility}
                  onChange={(e) => setCompatibility(e.target.value)}
                  placeholder={isRTL ? 'مثال: iPhone 14, Samsung Galaxy S23' : 'ex: iPhone 14, Samsung Galaxy S23'}
                />
              </div>
            )}

            {/* Spare part-specific fields */}
            {categoryType === 'spare-part' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{labels.partType}</Label>
                  <Input
                    value={partType}
                    onChange={(e) => setPartType(e.target.value)}
                    placeholder={isRTL ? 'مثال: شاشة، بطارية، كاميرا' : 'ex: Écran, Batterie, Caméra'}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{labels.compatibility}</Label>
                  <Input
                    value={compatibility}
                    onChange={(e) => setCompatibility(e.target.value)}
                    placeholder={isRTL ? 'مثال: iPhone 12, iPhone 13' : 'ex: iPhone 12, iPhone 13'}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.location}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.city}</Label>
              <CitySelector
                value={cityId}
                onChange={handleCityChange}
                language={language}
                groupByRegion
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.neighborhood}</Label>
              <NeighborhoodAutocomplete
                cityId={cityId}
                value={neighborhoodId}
                onChange={handleNeighborhoodChange}
                language={language}
                userId={user?.id}
                disabled={!cityId}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.contact}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.phone}</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0612345678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.whatsapp}</Label>
              <Input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+212612345678"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.images}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="listing-image-upload"
              disabled={uploadingImages || imageUrls.length >= 6}
            />
            <label htmlFor="listing-image-upload" className="cursor-pointer">
              {uploadingImages ? (
                <Loader2 className="h-10 w-10 text-orange-500 mx-auto mb-2 animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-gray-600">{labels.dragDrop}</p>
              <p className="text-sm text-gray-400 mt-1">{labels.imageLimit}</p>
            </label>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&q=60';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {labels.cancel}
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {labels.submitting}
            </>
          ) : (
            labels.submit
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateListingForm;
