import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { Store, Wrench, UserCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type UserRole = 'shop' | 'technician' | 'individual';

interface RoleOption {
  id: UserRole;
  icon: React.ElementType;
  title: { ar: string; fr: string };
  description: { ar: string; fr: string };
  features: { ar: string[]; fr: string[] };
  color: string;
  userType: string;
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
    color: 'from-blue-500 to-cyan-600',
    userType: 'importer'
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
    color: 'from-orange-500 to-red-600',
    userType: 'technician'
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
    color: 'from-green-500 to-emerald-600',
    userType: 'customer'
  }
];

export default function AccountTypeSelectionPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRTL = language === 'ar';

  const labels = {
    pageTitle: isRTL ? 'اختر نوع حسابك' : 'Choisissez votre type de compte',
    subtitle: isRTL 
      ? 'يرجى اختيار نوع الحساب الذي يناسب احتياجاتك'
      : 'Veuillez choisir le type de compte qui correspond à vos besoins',
    selectAccount: isRTL ? 'اختيار' : 'Sélectionner',
    continue: isRTL ? 'متابعة' : 'Continuer',
    error: isRTL ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Une erreur s\'est produite. Veuillez réessayer.'
  };

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const roleData = ROLE_OPTIONS.find(r => r.id === role);
      if (!roleData) {
        throw new Error('Invalid role selected');
      }

      // Update user profile with selected account type
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: roleData.userType })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Redirect to appropriate dashboard based on role
      switch (roleData.userType) {
        case 'importer':
          navigate('/importer/dashboard');
          break;
        case 'technician':
          navigate('/technician/dashboard');
          break;
        case 'customer':
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err: any) {
      console.error('Error updating account type:', err);
      setError(err.message || labels.error);
      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={labels.pageTitle}
        description="Sélectionnez votre type de compte pour commencer à utiliser Mobile Maroc."
        canonical="/auth/select-account-type"
        noindex={true}
      />

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/favicon.svg" alt="Mobile Maroc" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{labels.pageTitle}</h1>
          <p className="text-gray-600">{labels.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLE_OPTIONS.map((role) => (
            <Card 
              key={role.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                selectedRole === role.id 
                  ? "border-primary shadow-lg" 
                  : "border-transparent hover:border-gray-200",
                loading && "opacity-50 pointer-events-none"
              )}
              onClick={() => !loading && handleRoleSelect(role.id)}
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
                <ul className="space-y-2 mb-4">
                  {(isRTL ? role.features.ar : role.features.fr).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={selectedRole === role.id ? "default" : "outline"}
                  disabled={loading}
                >
                  {loading && selectedRole === role.id ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {labels.continue}
                    </>
                  ) : (
                    labels.selectAccount
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
