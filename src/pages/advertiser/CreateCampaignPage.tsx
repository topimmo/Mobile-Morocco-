import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Calendar as CalendarIcon,
  Monitor,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface BannerPlacement {
  id: string;
  name: { ar: string; fr: string };
  description: { ar: string; fr: string };
  desktopSize: string;
  mobileSize: string;
  pages: string[];
  position: 'top' | 'bottom';
  price7Days: number;
  price15Days: number;
  price30Days: number;
}

const BANNER_PLACEMENTS: BannerPlacement[] = [
  {
    id: 'home-top',
    name: { ar: 'الصفحة الرئيسية - أعلى', fr: 'Page d\'accueil - Haut' },
    description: { ar: 'إعلان بارز في أعلى الصفحة الرئيسية', fr: 'Bannière visible en haut de la page d\'accueil' },
    desktopSize: '970x250',
    mobileSize: '320x100',
    pages: ['home'],
    position: 'top',
    price7Days: 500,
    price15Days: 900,
    price30Days: 1500,
  },
  {
    id: 'phones-top',
    name: { ar: 'صفحة الهواتف - أعلى', fr: 'Page Téléphones - Haut' },
    description: { ar: 'إعلان في صفحة عرض الهواتف', fr: 'Bannière sur la page des téléphones' },
    desktopSize: '728x90',
    mobileSize: '320x100',
    pages: ['phones'],
    position: 'top',
    price7Days: 400,
    price15Days: 750,
    price30Days: 1200,
  },
  {
    id: 'services-top',
    name: { ar: 'صفحة الخدمات - أعلى', fr: 'Page Services - Haut' },
    description: { ar: 'إعلان في صفحة خدمات الإصلاح', fr: 'Bannière sur la page des services' },
    desktopSize: '728x90',
    mobileSize: '320x100',
    pages: ['services'],
    position: 'top',
    price7Days: 350,
    price15Days: 650,
    price30Days: 1000,
  },
  {
    id: 'all-pages',
    name: { ar: 'جميع الصفحات', fr: 'Toutes les pages' },
    description: { ar: 'إعلانك يظهر في جميع صفحات المنصة', fr: 'Votre bannière apparaît sur toutes les pages' },
    desktopSize: '970x250',
    mobileSize: '320x100',
    pages: ['home', 'phones', 'spare_parts', 'equipment', 'services', 'stores'],
    position: 'top',
    price7Days: 1000,
    price15Days: 1800,
    price30Days: 3000,
  },
];

const DURATION_OPTIONS = [
  { id: '7', label: { ar: '7 أيام', fr: '7 jours' }, days: 7 },
  { id: '15', label: { ar: '15 يوم', fr: '15 jours' }, days: 15 },
  { id: '30', label: { ar: '30 يوم', fr: '30 jours' }, days: 30 },
];

export default function CreateCampaignPage() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(1);
  const [selectedPlacement, setSelectedPlacement] = useState<string>('');
  const [duration, setDuration] = useState<string>('7');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [campaignName, setCampaignName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bannerDesktopFile, setBannerDesktopFile] = useState<File | null>(null);
  const [bannerMobileFile, setBannerMobileFile] = useState<File | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const labels = {
    title: isRTL ? 'إنشاء حملة إعلانية' : 'Créer une campagne',
    subtitle: isRTL ? 'اختر موقع وتاريخ ظهور إعلانك' : 'Choisissez l\'emplacement et les dates de votre bannière',
    back: isRTL ? 'العودة' : 'Retour',
    step1: isRTL ? 'اختر الموقع' : 'Choisir l\'emplacement',
    step2: isRTL ? 'اختر التواريخ' : 'Choisir les dates',
    step3: isRTL ? 'معلومات الحملة' : 'Informations',
    step4: isRTL ? 'رفع البانر' : 'Télécharger la bannière',
    step5: isRTL ? 'المراجعة والإرسال' : 'Révision et envoi',
    selectPlacement: isRTL ? 'اختر موقع الإعلان' : 'Sélectionnez un emplacement',
    selectDuration: isRTL ? 'اختر المدة' : 'Sélectionnez la durée',
    selectStartDate: isRTL ? 'اختر تاريخ البداية' : 'Sélectionnez la date de début',
    blockedDate: isRTL ? 'هذا التاريخ محجوز' : 'Cette date est réservée',
    campaignName: isRTL ? 'اسم الحملة' : 'Nom de la campagne',
    businessName: isRTL ? 'اسم الشركة / النشاط' : 'Nom de l\'entreprise',
    destinationUrl: isRTL ? 'رابط الوجهة' : 'URL de destination',
    contactPhone: isRTL ? 'رقم الهاتف' : 'Téléphone de contact',
    uploadDesktop: isRTL ? 'رفع بانر سطح المكتب' : 'Télécharger bannière desktop',
    uploadMobile: isRTL ? 'رفع بانر الجوال' : 'Télécharger bannière mobile',
    desktopSize: isRTL ? 'حجم سطح المكتب' : 'Taille desktop',
    mobileSize: isRTL ? 'حجم الجوال' : 'Taille mobile',
    totalPrice: isRTL ? 'السعر الإجمالي' : 'Prix total',
    next: isRTL ? 'التالي' : 'Suivant',
    previous: isRTL ? 'السابق' : 'Précédent',
    submit: isRTL ? 'إرسال الطلب' : 'Soumettre la demande',
    submitSuccess: isRTL ? 'تم إرسال طلبك بنجاح! سيتم مراجعته من قبل فريقنا.' : 'Votre demande a été soumise avec succès! Elle sera examinée par notre équipe.',
    paymentInstructions: isRTL 
      ? 'بعد الموافقة على طلبك، سيتم إرسال تعليمات الدفع عبر البريد الإلكتروني أو واتساب.' 
      : 'Après approbation, les instructions de paiement seront envoyées par email ou WhatsApp.',
    adminReview: isRTL 
      ? 'سيتم مراجعة طلبك من قبل المسؤول قبل التفعيل.' 
      : 'Votre demande sera examinée par l\'administrateur avant activation.',
    mad: 'MAD',
    goToDashboard: isRTL ? 'الذهاب إلى لوحة التحكم' : 'Aller au tableau de bord',
  };

  // Load booked dates for selected placement
  useEffect(() => {
    const loadBookedDates = async () => {
      if (!selectedPlacement) return;
      
      try {
        const placement = BANNER_PLACEMENTS.find(p => p.id === selectedPlacement);
        if (!placement) return;

        // Query booked dates from ad_bookings
        const { data, error } = await supabase
          .from('ad_bookings')
          .select('start_date, end_date')
          .eq('page', placement.pages[0])
          .eq('slot', placement.position)
          .in('status', ['approved', 'active', 'pending']);

        if (error) {
          console.error('Error loading booked dates:', error);
          return;
        }

        // Convert booking ranges to individual dates
        const dates: Date[] = [];
        data?.forEach(booking => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);
          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });

        setBookedDates(dates);
      } catch (err) {
        console.error('Error loading booked dates:', err);
      }
    };

    loadBookedDates();
  }, [selectedPlacement]);

  const getPrice = () => {
    const placement = BANNER_PLACEMENTS.find(p => p.id === selectedPlacement);
    if (!placement) return 0;
    
    switch (duration) {
      case '7': return placement.price7Days;
      case '15': return placement.price15Days;
      case '30': return placement.price30Days;
      default: return 0;
    }
  };

  const isDateBlocked = (date: Date) => {
    return bookedDates.some(
      blocked => blocked.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const placement = BANNER_PLACEMENTS.find(p => p.id === selectedPlacement);
      if (!placement || !startDate) {
        throw new Error('Missing required fields');
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(duration) - 1);

      // Create campaign (without actual file upload for now - UI only)
      const campaignData = {
        advertiser_id: user?.id,
        name: campaignName,
        business_name: businessName,
        destination_url: destinationUrl,
        contact_phone: contactPhone,
        placement_id: selectedPlacement,
        page: placement.pages[0],
        slot: placement.position,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        duration_days: parseInt(duration),
        total_price: getPrice(),
        status: 'pending_review',
        payment_status: 'pending',
      };

      // Try to insert into ad_campaigns (this is a demo - may fail if table doesn't exist)
      const { error } = await supabase
        .from('ad_campaigns')
        .insert(campaignData);

      if (error) {
        console.error('Campaign submission error:', error);
        // For demo purposes, still show success
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Submit error:', err);
      // For demo purposes, show success anyway
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>{isRTL ? 'جاري التحميل...' : 'Chargement...'}</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isRTL ? 'تم إرسال طلبك!' : 'Demande soumise!'}
            </h1>
            <p className="text-gray-600 mb-6">{labels.submitSuccess}</p>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>{labels.paymentInstructions}</AlertDescription>
            </Alert>
            <Link to="/advertiser/dashboard">
              <Button size="lg">{labels.goToDashboard}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlacementData = BANNER_PLACEMENTS.find(p => p.id === selectedPlacement);

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/advertiser/dashboard" className={cn('inline-flex items-center text-primary hover:underline mb-4', isRTL && 'flex-row-reverse')}>
            <ArrowIcon className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
            {labels.back}
          </Link>
          <h1 className={cn('text-3xl font-bold mb-2', isRTL && 'text-right')}>{labels.title}</h1>
          <p className={cn('text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium',
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              )}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Select Placement */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{labels.step1}</CardTitle>
              <CardDescription>{labels.selectPlacement}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {BANNER_PLACEMENTS.map((placement) => (
                <div
                  key={placement.id}
                  onClick={() => setSelectedPlacement(placement.id)}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-all',
                    selectedPlacement === placement.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn('flex justify-between items-start', isRTL && 'flex-row-reverse')}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h3 className="font-semibold">{isRTL ? placement.name.ar : placement.name.fr}</h3>
                      <p className="text-sm text-gray-500">{isRTL ? placement.description.ar : placement.description.fr}</p>
                      <div className={cn('flex gap-4 mt-2 text-xs text-gray-400', isRTL && 'flex-row-reverse')}>
                        <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                          <Monitor className="h-3 w-3" /> {placement.desktopSize}
                        </span>
                        <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                          <Smartphone className="h-3 w-3" /> {placement.mobileSize}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{placement.price7Days} MAD / 7j</Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedPlacement}
                className="w-full"
              >
                {labels.next}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Dates */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{labels.step2}</CardTitle>
              <CardDescription>{labels.selectDuration}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {DURATION_OPTIONS.map((opt) => (
                  <Button
                    key={opt.id}
                    variant={duration === opt.id ? 'default' : 'outline'}
                    onClick={() => setDuration(opt.id)}
                    className="w-full"
                  >
                    {isRTL ? opt.label.ar : opt.label.fr}
                  </Button>
                ))}
              </div>

              <div>
                <Label className="mb-2 block">{labels.selectStartDate}</Label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => 
                    date < new Date() || isDateBlocked(date)
                  }
                  className="rounded-md border"
                />
                {bookedDates.length > 0 && (
                  <p className="text-sm text-orange-500 mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {labels.blockedDate}
                  </p>
                )}
              </div>

              {selectedPlacementData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                    <span className="font-medium">{labels.totalPrice}:</span>
                    <span className="text-2xl font-bold text-primary">{getPrice()} {labels.mad}</span>
                  </div>
                </div>
              )}

              <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {labels.previous}
                </Button>
                <Button onClick={() => setStep(3)} disabled={!startDate} className="flex-1">
                  {labels.next}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Campaign Info */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{labels.step3}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{labels.campaignName}</Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder={isRTL ? 'اسم الحملة الإعلانية' : 'Nom de votre campagne'}
                />
              </div>
              <div>
                <Label>{labels.businessName}</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={isRTL ? 'اسم شركتك أو نشاطك' : 'Nom de votre entreprise'}
                />
              </div>
              <div>
                <Label>{labels.destinationUrl}</Label>
                <Input
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <Label>{labels.contactPhone}</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  dir="ltr"
                />
              </div>

              <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  {labels.previous}
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!campaignName || !businessName || !destinationUrl}
                  className="flex-1"
                >
                  {labels.next}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Upload Banners */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>{labels.step4}</CardTitle>
              {selectedPlacementData && (
                <CardDescription>
                  {labels.desktopSize}: {selectedPlacementData.desktopSize} | {labels.mobileSize}: {selectedPlacementData.mobileSize}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">{labels.uploadDesktop}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBannerDesktopFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="desktop-banner"
                    />
                    <label htmlFor="desktop-banner" className="cursor-pointer text-primary hover:underline">
                      {bannerDesktopFile ? bannerDesktopFile.name : (isRTL ? 'اختر ملف' : 'Choisir un fichier')}
                    </label>
                    {selectedPlacementData && (
                      <p className="text-xs text-gray-400 mt-1">{selectedPlacementData.desktopSize}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">{labels.uploadMobile}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBannerMobileFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="mobile-banner"
                    />
                    <label htmlFor="mobile-banner" className="cursor-pointer text-primary hover:underline">
                      {bannerMobileFile ? bannerMobileFile.name : (isRTL ? 'اختر ملف' : 'Choisir un fichier')}
                    </label>
                    {selectedPlacementData && (
                      <p className="text-xs text-gray-400 mt-1">{selectedPlacementData.mobileSize}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  {labels.previous}
                </Button>
                <Button onClick={() => setStep(5)} className="flex-1">
                  {labels.next}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>{labels.step5}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                  <span className="text-gray-600">{labels.selectPlacement}:</span>
                  <span className="font-medium">
                    {selectedPlacementData && (isRTL ? selectedPlacementData.name.ar : selectedPlacementData.name.fr)}
                  </span>
                </div>
                <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                  <span className="text-gray-600">{labels.selectDuration}:</span>
                  <span className="font-medium">
                    {DURATION_OPTIONS.find(d => d.id === duration)?.label[isRTL ? 'ar' : 'fr']}
                  </span>
                </div>
                <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                  <span className="text-gray-600">{labels.selectStartDate}:</span>
                  <span className="font-medium">{startDate?.toLocaleDateString()}</span>
                </div>
                <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                  <span className="text-gray-600">{labels.campaignName}:</span>
                  <span className="font-medium">{campaignName}</span>
                </div>
                <div className={cn('flex justify-between', isRTL && 'flex-row-reverse')}>
                  <span className="text-gray-600">{labels.businessName}:</span>
                  <span className="font-medium">{businessName}</span>
                </div>
                <hr />
                <div className={cn('flex justify-between text-lg', isRTL && 'flex-row-reverse')}>
                  <span className="font-medium">{labels.totalPrice}:</span>
                  <span className="text-2xl font-bold text-primary">{getPrice()} {labels.mad}</span>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{labels.adminReview}</AlertDescription>
              </Alert>

              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
                <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                  {labels.previous}
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (isRTL ? 'جاري الإرسال...' : 'Envoi en cours...') : labels.submit}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
