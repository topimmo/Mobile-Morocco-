import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAds } from '@/lib/ads-context';
import { 
  Ad,
  AdSize, 
  AdPlacement, 
  AdDuration, 
  AdMediaType,
  AD_SIZE_DIMENSIONS, 
  AD_PLACEMENTS, 
  AD_DURATIONS 
} from '@/types/ads';

interface EditAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: Ad;
  language: 'ar' | 'fr';
}

const translations = {
  fr: {
    title: 'Modifier la Publicité',
    description: 'Modifiez les détails de votre publicité',
    adTitle: 'Titre de la publicité',
    adTitlePlaceholder: 'Ex: Promotion iPhone 15',
    mediaType: 'Type de média',
    image: 'Image',
    video: 'Vidéo',
    mediaUrl: 'URL du média',
    mediaUrlPlaceholder: 'https://example.com/image.jpg',
    size: 'Taille de la publicité',
    placement: 'Emplacement',
    duration: 'Durée',
    redirectUrl: 'Lien de redirection (optionnel)',
    redirectUrlPlaceholder: 'https://votre-site.com/promo',
    sortOrder: 'Ordre d\'affichage',
    cancel: 'Annuler',
    save: 'Enregistrer',
    preview: 'Aperçu',
  },
  ar: {
    title: 'تعديل الإعلان',
    description: 'عدّل تفاصيل إعلانك',
    adTitle: 'عنوان الإعلان',
    adTitlePlaceholder: 'مثال: عرض iPhone 15',
    mediaType: 'نوع الوسائط',
    image: 'صورة',
    video: 'فيديو',
    mediaUrl: 'رابط الوسائط',
    mediaUrlPlaceholder: 'https://example.com/image.jpg',
    size: 'حجم الإعلان',
    placement: 'الموقع',
    duration: 'المدة',
    redirectUrl: 'رابط إعادة التوجيه (اختياري)',
    redirectUrlPlaceholder: 'https://موقعك.com/عرض',
    sortOrder: 'ترتيب العرض',
    cancel: 'إلغاء',
    save: 'حفظ',
    preview: 'معاينة',
  },
};

export function EditAdModal({ open, onOpenChange, ad, language }: EditAdModalProps) {
  const t = translations[language];
  const { updateAd } = useAds();
  
  const [title, setTitle] = useState(ad.title);
  const [mediaType, setMediaType] = useState<AdMediaType>(ad.mediaType);
  const [mediaUrl, setMediaUrl] = useState(ad.mediaUrl);
  const [size, setSize] = useState<AdSize>(ad.size);
  const [placement, setPlacement] = useState<AdPlacement>(ad.placement);
  const [duration, setDuration] = useState<AdDuration>(ad.duration);
  const [redirectUrl, setRedirectUrl] = useState(ad.redirectUrl || '');
  const [sortOrder, setSortOrder] = useState(ad.sortOrder);

  useEffect(() => {
    setTitle(ad.title);
    setMediaType(ad.mediaType);
    setMediaUrl(ad.mediaUrl);
    setSize(ad.size);
    setPlacement(ad.placement);
    setDuration(ad.duration);
    setRedirectUrl(ad.redirectUrl || '');
    setSortOrder(ad.sortOrder);
  }, [ad]);

  const handleSubmit = () => {
    if (!title || !mediaUrl) return;

    const durationDays = AD_DURATIONS[duration].days;
    const expiresAt = durationDays 
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    updateAd(ad.id, {
      title,
      mediaType,
      mediaUrl,
      size,
      placement,
      duration,
      redirectUrl: redirectUrl || undefined,
      sortOrder,
      expiresAt,
    });

    onOpenChange(false);
  };

  const isValid = title.trim() !== '' && mediaUrl.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="font-grotesk text-xl">{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className={`space-y-6 py-4 ${language === 'ar' ? 'font-tajawal' : ''}`}>
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">{t.adTitle}</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.adTitlePlaceholder}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label>{t.mediaType}</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={mediaType === 'image' ? 'default' : 'outline'}
                onClick={() => setMediaType('image')}
                className={mediaType === 'image' ? 'bg-primary' : 'bg-white/5 border-white/10'}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {t.image}
              </Button>
              <Button
                type="button"
                variant={mediaType === 'video' ? 'default' : 'outline'}
                onClick={() => setMediaType('video')}
                className={mediaType === 'video' ? 'bg-primary' : 'bg-white/5 border-white/10'}
              >
                <Video className="h-4 w-4 mr-2" />
                {t.video}
              </Button>
            </div>
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-mediaUrl">{t.mediaUrl}</Label>
            <Input
              id="edit-mediaUrl"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder={t.mediaUrlPlaceholder}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Preview */}
          {mediaUrl && (
            <div className="space-y-2">
              <Label>{t.preview}</Label>
              <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 p-4">
                <div className="max-w-full max-h-48 mx-auto overflow-hidden rounded-lg">
                  {mediaType === 'image' ? (
                    <img 
                      src={mediaUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-48 object-contain mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <video 
                      src={mediaUrl} 
                      className="max-w-full max-h-48 mx-auto"
                      controls
                      muted
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Size & Placement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.size}</Label>
              <Select value={size} onValueChange={(v) => setSize(v as AdSize)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AD_SIZE_DIMENSIONS).map(([key, { label, width, height }]) => (
                    <SelectItem key={key} value={key}>
                      {label[language]} ({width}x{height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.placement}</Label>
              <Select value={placement} onValueChange={(v) => setPlacement(v as AdPlacement)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AD_PLACEMENTS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label[language]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.duration}</Label>
              <Select value={duration} onValueChange={(v) => setDuration(v as AdDuration)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AD_DURATIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label[language]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">{t.sortOrder}</Label>
              <Input
                id="sortOrder"
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          {/* Redirect URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-redirectUrl">{t.redirectUrl}</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-redirectUrl"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder={t.redirectUrlPlaceholder}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-primary hover:bg-primary/90"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
