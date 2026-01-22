import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, X, Upload } from 'lucide-react';
import { trackListingCreated } from '@/services/analyticsService';
import { uploadImages, deleteImage } from '@/lib/supabase/storage';

interface CreateListingFormProps {
  onSuccess?: (listingId: string) => void;
  onCancel?: () => void;
}

export function CreateListingForm({ onSuccess, onCancel }: CreateListingFormProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('used');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    condition: isRTL ? 'الحالة *' : 'État *',
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

    if (!titleAr.trim() || !price || !categoryId || !cityId || !phone.trim()) {
      toast({
        title: labels.error,
        description: labels.required,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: listing, error } = await createListing({
        user_id: user.id,
        title_ar: titleAr.trim(),
        title_fr: titleFr.trim() || titleAr.trim(),
        description_ar: descriptionAr.trim(),
        description_fr: descriptionFr.trim(),
        price: parseFloat(price),
        currency: 'MAD',
        category_id: categoryId,
        city_id: cityId,
        neighborhood_id: neighborhoodId || null,
        condition,
        brand: brand.trim() || null,
        model: model.trim() || null,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || null,
        status: 'pending',
      });

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
      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.basicInfo}</CardTitle>
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
                placeholder={isRTL ? 'أدخل العنوان بالفرنسية' : 'Entrez le titre en français'}
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
                placeholder={isRTL ? 'وصف المنتج بالعربية' : 'Description en arabe'}
                dir="rtl"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.descriptionFr}</Label>
              <Textarea
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder={isRTL ? 'وصف المنتج بالفرنسية' : 'Description en français'}
                dir="ltr"
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.condition}</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as typeof condition)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{labels.new}</SelectItem>
                  <SelectItem value="used">{labels.used}</SelectItem>
                  <SelectItem value="refurbished">{labels.refurbished}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

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
