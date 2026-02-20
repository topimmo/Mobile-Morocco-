import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CitySelector, NeighborhoodAutocomplete } from '@/components/search';
import { createRepairShop, addShopImage } from '@/lib/supabase/repairShops';
import { City } from '@/lib/supabase/cities';
import { Neighborhood } from '@/lib/supabase/neighborhoods';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Loader2, X, Upload } from 'lucide-react';
import { uploadImages, deleteImage } from '@/lib/supabase/storage';

interface CreateRepairShopFormProps {
  onSuccess?: (shopId: string) => void;
  onCancel?: () => void;
}

const SPECIALTIES = [
  { ar: 'إصلاح الشاشات', fr: 'Réparation d\'écrans' },
  { ar: 'إصلاح البطاريات', fr: 'Remplacement batteries' },
  { ar: 'إصلاح البرمجيات', fr: 'Réparation logicielle' },
  { ar: 'فتح الأجهزة المقفلة', fr: 'Déblocage' },
  { ar: 'استعادة البيانات', fr: 'Récupération de données' },
  { ar: 'إصلاح اللوحة الأم', fr: 'Réparation carte mère' },
  { ar: 'مقاومة الماء', fr: 'Étanchéité' },
  { ar: 'إصلاح الكاميرا', fr: 'Réparation caméra' },
  { ar: 'إصلاح الميكروفون', fr: 'Réparation microphone' },
  { ar: 'إصلاح السماعة', fr: 'Réparation haut-parleur' },
];

export function CreateRepairShopForm({ onSuccess, onCancel }: CreateRepairShopFormProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';

  const [loading, setLoading] = useState(false);

  // Form state
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const labels = {
    title: isRTL ? 'إضافة محل إصلاح' : 'Ajouter une boutique de réparation',
    basicInfo: isRTL ? 'المعلومات الأساسية' : 'Informations de base',
    nameAr: isRTL ? 'اسم المحل (عربي) *' : 'Nom de la boutique (Arabe) *',
    nameFr: isRTL ? 'اسم المحل (فرنسي)' : 'Nom de la boutique (Français)',
    descriptionAr: isRTL ? 'الوصف (عربي)' : 'Description (Arabe)',
    descriptionFr: isRTL ? 'الوصف (فرنسي)' : 'Description (Français)',
    location: isRTL ? 'الموقع' : 'Emplacement',
    address: isRTL ? 'العنوان' : 'Adresse',
    city: isRTL ? 'المدينة *' : 'Ville *',
    neighborhood: isRTL ? 'الحي' : 'Quartier',
    contact: isRTL ? 'معلومات الاتصال' : 'Informations de contact',
    phone: isRTL ? 'رقم الهاتف *' : 'Numéro de téléphone *',
    whatsapp: isRTL ? 'واتساب' : 'WhatsApp',
    specialtiesLabel: isRTL ? 'التخصصات' : 'Spécialités',
    images: isRTL ? 'صور المحل' : 'Images de la boutique',
    uploadImages: isRTL ? 'رفع الصور' : 'Télécharger des images',
    dragDrop: isRTL ? 'اسحب وأفلت أو انقر للتحميل' : 'Glisser-déposer ou cliquer',
    imageLimit: isRTL ? 'الحد الأقصى 6 صور' : 'Maximum 6 images',
    submit: isRTL ? 'إضافة المحل' : 'Ajouter la boutique',
    cancel: isRTL ? 'إلغاء' : 'Annuler',
    submitting: isRTL ? 'جاري الإضافة...' : 'Ajout en cours...',
    success: isRTL ? 'تم إضافة المحل بنجاح' : 'Boutique ajoutée avec succès',
    error: isRTL ? 'حدث خطأ' : 'Une erreur s\'est produite',
    required: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs obligatoires',
  };

  const handleCityChange = (id: string, _city?: City) => {
    setCityId(id);
    setNeighborhoodId('');
  };

  const handleNeighborhoodChange = (id: string, _neighborhood?: Neighborhood) => {
    setNeighborhoodId(id);
  };

  const toggleSpecialty = (specialty: string) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter((s) => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
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
    
    try {
      const { urls, errors } = await uploadImages(
        Array.from(files),
        `repair-shops/${user?.id || 'anonymous'}`,
        6 - imageUrls.length
      );

      if (urls.length > 0) {
        setImageUrls(prev => [...prev, ...urls]);
      }

      if (errors.length > 0) {
        toast({
          title: errors[0],
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const urlToRemove = imageUrls[index];
    
    try {
      await deleteImage(urlToRemove);
      // Only remove from UI if deletion succeeded
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    }
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

    if (!nameAr.trim() || !cityId || !phone.trim()) {
      toast({
        title: labels.error,
        description: labels.required,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Generate slug from name
      const slugBase = (nameFr.trim() || nameAr.trim())
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      const slug = `${slugBase}-${Date.now().toString(36)}`;

      const { data: shop, error } = await createRepairShop({
        user_id: user.id,
        name_ar: nameAr.trim(),
        name_fr: nameFr.trim() || nameAr.trim(),
        description_ar: descriptionAr.trim(),
        description_fr: descriptionFr.trim(),
        address_ar: address.trim() || null,
        address_fr: address.trim() || null,
        city_id: cityId,
        neighborhood_id: neighborhoodId || null,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || null,
        specialties: specialties.length > 0 ? specialties : null,
        status: 'pending',
        slug,
      });

      if (error) throw error;

      // Add images
      if (shop && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await addShopImage(shop.id, imageUrls[i], undefined, undefined, i === 0, i);
        }
      }

      toast({
        title: labels.success,
        description: isRTL ? 'سيتم مراجعة المحل قبل النشر' : 'La boutique sera examinée avant publication',
      });

      onSuccess?.(shop?.id || '');
    } catch (error) {
      console.error('Error creating repair shop:', error);
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
              <Label className={isRTL ? 'text-right block' : ''}>{labels.nameAr}</Label>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={isRTL ? 'اسم المحل بالعربية' : 'Nom en arabe'}
                dir="rtl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.nameFr}</Label>
              <Input
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                placeholder={isRTL ? 'اسم المحل بالفرنسية' : 'Nom en français'}
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
                placeholder={isRTL ? 'وصف المحل بالعربية' : 'Description en arabe'}
                dir="rtl"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right block' : ''}>{labels.descriptionFr}</Label>
              <Textarea
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder={isRTL ? 'وصف المحل بالفرنسية' : 'Description en français'}
                dir="ltr"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.specialtiesLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((spec) => {
              const value = isRTL ? spec.ar : spec.fr;
              const isSelected = specialties.includes(value);
              return (
                <Badge
                  key={value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn('cursor-pointer transition-colors', isSelected && 'bg-primary')}
                  onClick={() => toggleSpecialty(value)}
                >
                  {value}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : ''}>{labels.location}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={isRTL ? 'text-right block' : ''}>{labels.address}</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isRTL ? 'العنوان الكامل' : 'Adresse complète'}
            />
          </div>

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
              id="shop-image-upload"
              disabled={uploadingImages || imageUrls.length >= 6}
            />
            <label htmlFor="shop-image-upload" className="cursor-pointer">
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
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1" variant="secondary">
                      {isRTL ? 'رئيسية' : 'Principale'}
                    </Badge>
                  )}
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

export default CreateRepairShopForm;
