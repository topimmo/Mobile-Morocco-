import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BannerSlot } from '@/components/common/BannerSlot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Target,
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Users,
  Megaphone,
  Lock,
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
    id: 'home-bottom',
    name: { ar: 'الصفحة الرئيسية - أسفل', fr: 'Page d\'accueil - Bas' },
    description: { ar: 'إعلان في أسفل الصفحة الرئيسية', fr: 'Bannière en bas de la page d\'accueil' },
    desktopSize: '300x250',
    mobileSize: '300x250',
    pages: ['home'],
    position: 'bottom',
    price7Days: 300,
    price15Days: 550,
    price30Days: 900,
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
    description: { ar: 'إعلان في صفحة خدمات الإصلاح', fr: 'Bannière sur la page des services de réparation' },
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

export default function AdvertisePage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const labels = {
    title: isRTL ? 'أعلن على موبايل المغرب' : 'Annoncez sur Mobile Maroc',
    subtitle: isRTL 
      ? 'وصل إلى آلاف المستخدمين المهتمين بالهواتف والإصلاح في المغرب'
      : 'Atteignez des milliers d\'utilisateurs intéressés par les mobiles et la réparation au Maroc',
    whyAdvertise: isRTL ? 'لماذا تعلن معنا؟' : 'Pourquoi annoncer avec nous?',
    placements: isRTL ? 'مواقع الإعلانات المتاحة' : 'Emplacements disponibles',
    pricing: isRTL ? 'الأسعار' : 'Tarifs',
    howItWorks: isRTL ? 'كيف يعمل؟' : 'Comment ça marche?',
    cta: isRTL ? 'ابدأ حملتك الإعلانية' : 'Lancez votre campagne',
    perWeek: isRTL ? '7 أيام' : '7 jours',
    per15Days: isRTL ? '15 يوم' : '15 jours',
    perMonth: isRTL ? '30 يوم' : '30 jours',
    desktop: isRTL ? 'سطح المكتب' : 'Desktop',
    mobile: isRTL ? 'الجوال' : 'Mobile',
    mad: 'MAD',
    pages: isRTL ? 'الصفحات' : 'Pages',
    position: isRTL ? 'الموقع' : 'Position',
    top: isRTL ? 'أعلى' : 'Haut',
    bottom: isRTL ? 'أسفل' : 'Bas',
    loginToStart: isRTL ? 'سجل دخولك لبدء حملتك' : 'Connectez-vous pour démarrer',
    createAccount: isRTL ? 'إنشاء حساب معلن' : 'Créer un compte annonceur',
    goToDashboard: isRTL ? 'الذهاب إلى لوحة التحكم' : 'Aller au tableau de bord',
    loginRequired: isRTL ? 'سجل الدخول لرؤية الأسعار والخيارات' : 'Connectez-vous pour voir les tarifs et options',
    exclusiveAccess: isRTL ? 'وصول حصري للمعلنين' : 'Accès exclusif aux annonceurs',
  };

  const benefits = [
    {
      icon: Eye,
      title: isRTL ? 'وصول واسع' : 'Large portée',
      description: isRTL 
        ? 'آلاف الزيارات اليومية من مستخدمين مهتمين'
        : 'Des milliers de visites quotidiennes d\'utilisateurs intéressés',
    },
    {
      icon: Target,
      title: isRTL ? 'جمهور مستهدف' : 'Audience ciblée',
      description: isRTL 
        ? 'مستخدمون يبحثون عن الهواتف والإصلاح'
        : 'Des utilisateurs à la recherche de mobiles et réparations',
    },
    {
      icon: Zap,
      title: isRTL ? 'نتائج سريعة' : 'Résultats rapides',
      description: isRTL 
        ? 'ابدأ الظهور فوراً بعد الموافقة'
        : 'Commencez à apparaître immédiatement après approbation',
    },
    {
      icon: Shield,
      title: isRTL ? 'موثوق وآمن' : 'Fiable et sécurisé',
      description: isRTL 
        ? 'منصة موثوقة مع تقارير شفافة'
        : 'Plateforme de confiance avec rapports transparents',
    },
    {
      icon: BarChart3,
      title: isRTL ? 'تقارير تفصيلية' : 'Rapports détaillés',
      description: isRTL 
        ? 'تتبع أداء حملتك الإعلانية بدقة'
        : 'Suivez les performances de vos campagnes en détail',
    },
    {
      icon: Users,
      title: isRTL ? 'جمهور محلي' : 'Audience locale',
      description: isRTL 
        ? 'استهدف المغاربة المهتمين بالهواتف'
        : 'Ciblez les Marocains intéressés par les mobiles',
    },
  ];

  const steps = [
    {
      number: 1,
      title: isRTL ? 'أنشئ حساب معلن' : 'Créez un compte annonceur',
      description: isRTL 
        ? 'سجل كمعلن للوصول إلى جميع خيارات الإعلان'
        : 'Inscrivez-vous comme annonceur pour accéder à toutes les options',
    },
    {
      number: 2,
      title: isRTL ? 'اختر مساحتك الإعلانية' : 'Choisissez votre espace',
      description: isRTL 
        ? 'حدد موقع الإعلان والمدة وحمّل البانر'
        : 'Sélectionnez l\'emplacement, la durée et téléchargez votre bannière',
    },
    {
      number: 3,
      title: isRTL ? 'أكمل الدفع' : 'Effectuez le paiement',
      description: isRTL 
        ? 'قم بالتحويل البنكي وارفع إثبات الدفع'
        : 'Effectuez le virement bancaire et téléchargez la preuve',
    },
    {
      number: 4,
      title: isRTL ? 'انتظر الموافقة' : 'Attendez l\'approbation',
      description: isRTL 
        ? 'سيراجع فريقنا طلبك ويفعّل إعلانك'
        : 'Notre équipe examinera votre demande et activera votre bannière',
    },
  ];

  const stats = [
    { value: '50K+', label: isRTL ? 'زائر شهري' : 'Visiteurs mensuels' },
    { value: '85%', label: isRTL ? 'من المغرب' : 'Du Maroc' },
    { value: '3min', label: isRTL ? 'متوسط وقت الزيارة' : 'Temps moyen sur site' },
    { value: '24h', label: isRTL ? 'وقت التفعيل' : 'Délai d\'activation' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <BannerSlot page="advertise" slot="top" />

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Megaphone className="h-5 w-5" />
            <span className="text-sm font-medium">
              {isRTL ? 'منصة إعلانات متميزة' : 'Plateforme publicitaire premium'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            {labels.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-8 max-w-3xl mx-auto px-4">
            {labels.subtitle}
          </p>
          
          <Link to="/ads/request">
            <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 shadow-lg hover:shadow-xl transition-all">
              {isRTL ? 'طلب إعلان' : 'Demander une publicité'}
              <ArrowIcon className={cn('h-5 w-5', isRTL ? 'mr-2' : 'ml-2')} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{labels.whyAdvertise}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 md:pt-8 pb-4 md:pb-6 px-4 md:px-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 md:mb-4">
                    <benefit.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placements Section - Show info and redirect to ad request */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{labels.placements}</h2>
          
          {/* Show locked state with ad request CTA */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="py-12 md:py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4 md:mb-6">
                  <Lock className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  {isRTL ? 'اطلب عرض أسعار مخصص' : 'Demandez un devis personnalisé'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                  {isRTL 
                    ? 'أكمل نموذج طلب الإعلان وسنتواصل معك مع عرض أسعار مخصص'
                    : 'Remplissez le formulaire de demande et nous vous contacterons avec un devis personnalisé'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                  <Link to="/ads/request">
                    <Button size="lg" className="w-full sm:w-auto">
                      {isRTL ? 'طلب إعلان' : 'Demander une publicité'}
                      <ArrowIcon className={cn('h-4 w-4', isRTL ? 'mr-2' : 'ml-2')} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Preview of placements without pricing */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BANNER_PLACEMENTS.slice(0, 4).map((placement) => (
                <Card key={placement.id} className="bg-white/50 backdrop-blur">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {isRTL ? placement.name.ar : placement.name.fr}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {placement.desktopSize} / {placement.mobileSize}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{labels.howItWorks}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className={cn('relative', isRTL && 'text-right')}>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'hidden lg:block absolute top-6 h-0.5 bg-gray-200',
                    isRTL ? 'right-12 left-0' : 'left-12 right-0'
                  )} />
                )}
                <div className={cn('flex items-start gap-3 md:gap-4', isRTL && 'flex-row-reverse')}>
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg md:text-xl z-10">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{labels.cta}</h2>
          <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-8">
            {isRTL 
              ? 'ابدأ الآن واستفد من عروضنا المميزة'
              : 'Commencez maintenant et profitez de nos offres exclusives'}
          </p>
          <Link to="/ads/request">
            <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 shadow-lg">
              {isRTL ? 'طلب إعلان' : 'Demander une publicité'}
              <ArrowIcon className={cn('h-5 w-5', isRTL ? 'mr-2' : 'ml-2')} />
            </Button>
          </Link>
        </div>
      </section>

      <BannerSlot page="advertise" slot="bottom" />

      <Footer />
    </div>
  );
}
