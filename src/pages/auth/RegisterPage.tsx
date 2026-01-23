import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SEO } from '@/components/SEO';
import { 
  Mail, 
  Lock, 
  User, 
  Loader, 
  Store, 
  Wrench, 
  UserCircle, 
  Megaphone,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin
} from 'lucide-react';
import { trackRegistration } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

type UserRole = 'shop' | 'technician' | 'individual';

interface RoleOption {
  id: UserRole;
  icon: React.ElementType;
  title: { ar: string; fr: string };
  description: { ar: string; fr: string };
  features: { ar: string[]; fr: string[] };
  color: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'shop',
    icon: Store,
    title: { ar: 'متجر / مستورد', fr: 'Boutique / Importateur' },
    description: { 
      ar: 'أملك متجراً وأريد بيع الهواتف والإكسسوارات',
      fr: 'J\'ai une boutique et je veux vendre des téléphones et accessoires'
    },
    features: {
      ar: [
        'إنشاء صفحة متجر',
        'نشر إعلانات متعددة',
        'إدارة المخزون',
        'تواصل مباشر مع العملاء'
      ],
      fr: [
        'Créer une page boutique',
        'Publier plusieurs annonces',
        'Gérer l\'inventaire',
        'Communication directe avec les clients'
      ]
    },
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'technician',
    icon: Wrench,
    title: { ar: 'فني / حرفي', fr: 'Technicien / Artisan' },
    description: { 
      ar: 'أقدم خدمات إصلاح الهواتف',
      fr: 'J\'offre des services de réparation de téléphones'
    },
    features: {
      ar: [
        'عرض خدمات الإصلاح',
        'استقبال طلبات العمل',
        'ملف شخصي احترافي',
        'تقييمات العملاء'
      ],
      fr: [
        'Afficher les services de réparation',
        'Recevoir des demandes de travail',
        'Profil professionnel',
        'Avis des clients'
      ]
    },
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'individual',
    icon: UserCircle,
    title: { ar: 'فرد / بائع خاص', fr: 'Particulier / Vendeur individuel' },
    description: { 
      ar: 'أريد بيع هاتفي أو قطع غيار',
      fr: 'Je veux vendre mon téléphone ou des pièces détachées'
    },
    features: {
      ar: [
        'نشر إعلانات فردية',
        'بيع بسيط وسريع',
        'التواصل المباشر',
        'بدون التزام'
      ],
      fr: [
        'Publier des annonces individuelles',
        'Vente simple et rapide',
        'Communication directe',
        'Sans engagement'
      ]
    },
    color: 'from-green-500 to-emerald-600'
  }
];

export default function RegisterPage() {
  const { language, t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  // Check for role in URL params
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ROLE_OPTIONS.some(r => r.id === roleParam)) {
      setSelectedRole(roleParam as UserRole);
      setStep('details');
    }
  }, [searchParams]);

  const labels = {
    pageTitle: isRTL ? 'إنشاء حساب' : 'Créer un compte',
    selectRole: isRTL ? 'اختر نوع حسابك' : 'Choisissez votre type de compte',
    selectRoleSubtitle: isRTL 
      ? 'التسجيل مخصص للمستخدمين الذين يريدون نشر إعلانات أو خدمات'
      : 'L\'inscription est réservée aux utilisateurs qui souhaitent publier des annonces ou services',
    continueWith: isRTL ? 'المتابعة كـ' : 'Continuer comme',
    accountDetails: isRTL ? 'معلومات الحساب' : 'Détails du compte',
    fullName: isRTL ? 'الاسم الكامل' : 'Nom complet',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    phone: isRTL ? 'رقم الهاتف' : 'Numéro de téléphone',
    city: isRTL ? 'المدينة' : 'Ville',
    password: isRTL ? 'كلمة المرور' : 'Mot de passe',
    confirmPassword: isRTL ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe',
    createAccount: isRTL ? 'إنشاء الحساب' : 'Créer le compte',
    back: isRTL ? 'رجوع' : 'Retour',
    alreadyHaveAccount: isRTL ? 'لديك حساب بالفعل؟' : 'Vous avez déjà un compte?',
    login: isRTL ? 'تسجيل الدخول' : 'Se connecter',
    passwordsNotMatch: isRTL ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas',
    registrationFailed: isRTL ? 'فشل التسجيل' : 'Échec de l\'inscription',
    notForVisitors: isRTL 
      ? '⚠️ هذا التسجيل ليس للزوار العاديين'
      : '⚠️ Cette inscription n\'est pas pour les visiteurs',
    visitorNote: isRTL
      ? 'إذا كنت تبحث فقط عن منتجات للشراء، يمكنك تصفح المنصة بدون حساب'
      : 'Si vous cherchez seulement des produits à acheter, vous pouvez naviguer sans compte'
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleBack = () => {
    setStep('role');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(labels.passwordsNotMatch);
      return;
    }

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    try {
      // Map role to user type for backend
      const userTypeMap: Record<UserRole, string> = {
        shop: 'importer',
        technician: 'technician',
        individual: 'customer'
      };

      await signUp(email, password, fullName, {
        user_type: userTypeMap[selectedRole],
        phone,
        city
      });
      
      trackRegistration(userTypeMap[selectedRole]);
      navigate('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message || labels.registrationFailed);
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = ROLE_OPTIONS.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={labels.pageTitle}
        description="Créez votre compte Mobile Maroc pour publier vos annonces et accéder à toutes les fonctionnalités de la plateforme."
        canonical="/auth/register"
        noindex={true}
      />

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src="/favicon.svg" alt="Mobile Maroc" className="h-12 w-12 mx-auto" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{labels.pageTitle}</h1>
        </div>

        {step === 'role' ? (
          // Step 1: Role Selection
          <div className="space-y-6">
            {/* Warning for visitors */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <p className="font-medium text-amber-800 mb-1">{labels.notForVisitors}</p>
                <p className="text-sm text-amber-700">{labels.visitorNote}</p>
              </CardContent>
            </Card>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{labels.selectRole}</h2>
              <p className="text-gray-600">{labels.selectRoleSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLE_OPTIONS.map((role) => (
                <Card 
                  key={role.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                    selectedRole === role.id 
                      ? "border-primary shadow-lg" 
                      : "border-transparent hover:border-gray-200"
                  )}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader className="pb-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                      role.color
                    )}>
                      <role.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      {isRTL ? role.title.ar : role.title.fr}
                    </CardTitle>
                    <CardDescription>
                      {isRTL ? role.description.ar : role.description.fr}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {(isRTL ? role.features.ar : role.features.fr).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      variant={selectedRole === role.id ? "default" : "outline"}
                    >
                      {labels.continueWith} {isRTL ? role.title.ar : role.title.fr}
                      <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {labels.alreadyHaveAccount}{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  {labels.login}
                </Link>
              </p>
            </div>
          </div>
        ) : (
          // Step 2: Account Details
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className={cn("w-fit mb-2", isRTL ? "mr-auto" : "ml-0")}
              >
                <BackArrowIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {labels.back}
              </Button>
              
              {selectedRoleData && (
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    selectedRoleData.color
                  )}>
                    <selectedRoleData.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{labels.continueWith}</p>
                    <p className="font-medium">
                      {isRTL ? selectedRoleData.title.ar : selectedRoleData.title.fr}
                    </p>
                  </div>
                </div>
              )}
              
              <CardTitle>{labels.accountDetails}</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{labels.fullName}</Label>
                  <div className="relative mt-1">
                    <User className={cn(
                      "absolute top-3 text-muted-foreground h-5 w-5",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className={cn(isRTL ? "pr-10" : "pl-10")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{labels.email}</Label>
                  <div className="relative mt-1">
                    <Mail className={cn(
                      "absolute top-3 text-muted-foreground h-5 w-5",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={cn(isRTL ? "pr-10" : "pl-10")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone">{labels.phone}</Label>
                    <div className="relative mt-1">
                      <Phone className={cn(
                        "absolute top-3 text-muted-foreground h-5 w-5",
                        isRTL ? "right-3" : "left-3"
                      )} />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+212..."
                        className={cn(isRTL ? "pr-10" : "pl-10")}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="city">{labels.city}</Label>
                    <div className="relative mt-1">
                      <MapPin className={cn(
                        "absolute top-3 text-muted-foreground h-5 w-5",
                        isRTL ? "right-3" : "left-3"
                      )} />
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={isRTL ? "كازابلانكا" : "Casablanca"}
                        className={cn(isRTL ? "pr-10" : "pl-10")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">{labels.password}</Label>
                  <div className="relative mt-1">
                    <Lock className={cn(
                      "absolute top-3 text-muted-foreground h-5 w-5",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className={cn(isRTL ? "pr-10" : "pl-10")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{labels.confirmPassword}</Label>
                  <div className="relative mt-1">
                    <Lock className={cn(
                      "absolute top-3 text-muted-foreground h-5 w-5",
                      isRTL ? "right-3" : "left-3"
                    )} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className={cn(isRTL ? "pr-10" : "pl-10")}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      {labels.createAccount}
                      <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {labels.alreadyHaveAccount}{' '}
                  <Link to="/auth/login" className="text-primary hover:underline font-medium">
                    {labels.login}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
