import { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Link as LinkIcon, Calendar } from 'lucide-react';
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
  AdSize, 
  AdPlacement, 
  AdDuration, 
  AdMediaType,
  AD_SIZE_DIMENSIONS, 
  AD_PLACEMENTS, 
  AD_DURATIONS 
} from '@/types/ads';

interface UploadAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'ar' | 'fr';
}

const translations = {
  fr: {
    title: 'Nouvelle Publicité',
    description: 'Créez une nouvelle publicité pour votre campagne',
    adTitle: 'Titre de la publicité',
    adTitlePlaceholder: 'Ex: Promotion iPhone 15',
    mediaType: 'Type de média',
    image: 'Image',
    video: 'Vidéo',
    uploadMedia: 'Télécharger le média',
    uploadHint: 'Glissez-déposez ou cliquez pour télécharger',
    supportedFormats: 'Formats supportés: JPG, PNG, WebP, MP4',
    orEnterUrl: 'Ou entrez une URL',
    mediaUrl: 'URL du média',
    mediaUrlPlaceholder: 'https://example.com/image.jpg',
    size: 'Taille de la publicité',
    placement: 'Emplacement',
    duration: 'Durée',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    redirectUrl: 'Lien de redirection (optionnel)',
    redirectUrlPlaceholder: 'https://votre-site.com/promo',
    cancel: 'Annuler',
    create: 'Créer la publicité',
    preview: 'Aperçu',
    noPreview: 'Aucun aperçu disponible',
  },
  ar: {
    title: 'إعلان جديد',
    description: 'أنشئ إعلانًا جديدًا لحملتك',
    adTitle: 'عنوان الإعلان',
    adTitlePlaceholder: 'مثال: عرض iPhone 15',
    mediaType: 'نوع الوسائط',
    image: 'صورة',
    video: 'فيديو',
    uploadMedia: 'تحميل الوسائط',
    uploadHint: 'اسحب وأفلت أو انقر للتحميل',
    supportedFormats: 'الصيغ المدعومة: JPG, PNG, WebP, MP4',
    orEnterUrl: 'أو أدخل رابط URL',
    mediaUrl: 'رابط الوسائط',
    mediaUrlPlaceholder: 'https://example.com/image.jpg',
    size: 'حجم الإعلان',
    placement: 'الموقع',
    duration: 'المدة',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    redirectUrl: 'رابط إعادة التوجيه (اختياري)',
    redirectUrlPlaceholder: 'https://موقعك.com/عرض',
    cancel: 'إلغاء',
    create: 'إنشاء الإعلان',
    preview: 'معاينة',
    noPreview: 'لا توجد معاينة',
  },
};

export function UploadAdModal({ open, onOpenChange, language }: UploadAdModalProps) {
  const t = translations[language];
  const { addAd } = useAds();
  
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState<AdMediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [size, setSize] = useState<AdSize>('large-banner');
  const [placement, setPlacement] = useState<AdPlacement>('homepage');
  const [duration, setDuration] = useState<AdDuration>('monthly');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    if (!title || !mediaUrl) return;

    const durationDays = AD_DURATIONS[duration].days;
    let expiresAt: string | undefined;
    
    if (duration === 'custom' && endDate) {
      expiresAt = new Date(endDate).toISOString();
    } else if (durationDays) {
      const start = startDate ? new Date(startDate) : new Date();
      expiresAt = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    }

    addAd({
      title,
      mediaType,
      mediaUrl,
      size,
      placement,
      status: 'pending',
      duration,
      redirectUrl: redirectUrl || undefined,
      enabled: true,
      sortOrder: 1,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      expiresAt,
    });

    // Reset form
    setTitle('');
    setMediaType('image');
    setMediaUrl('');
    setSize('large-banner');
    setPlacement('homepage');
    setDuration('monthly');
    setRedirectUrl('');
    setStartDate('');
    setEndDate('');
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
            <Label htmlFor="title">{t.adTitle}</Label>
            <Input
              id="title"
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

          {/* Upload Area */}
          <div className="space-y-2">
            <Label>{t.uploadMedia}</Label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">{t.uploadHint}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{t.supportedFormats}</p>
            </div>
          </div>

          {/* Or URL */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t.orEnterUrl}</span>
            </div>
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">{t.mediaUrl}</Label>
            <Input
              id="mediaUrl"
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

          {/* Duration */}
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

          {/* Redirect URL */}
          <div className="space-y-2">
            <Label htmlFor="redirectUrl">{t.redirectUrl}</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="redirectUrl"
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
            {t.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
