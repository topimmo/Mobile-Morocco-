import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Store, Wrench, Settings, Eye, Mail, Lock, Phone, MapPin, Building, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { UserType, USER_TYPES, MOROCCAN_CITIES } from '@/types/user';

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'ar' | 'fr';
}

const userTypeIcons: Record<UserType, React.ComponentType<{ className?: string }>> = {
  'repair_shop': Wrench,
  'seller': Store,
  'technician': Settings,
  'advertiser': Eye,
  'visitor': User,
};

const translations = {
  fr: {
    title: 'Créer un Compte',
    subtitle: 'Rejoignez la communauté Mobile Maroc',
    selectUserType: 'Choisissez votre type de compte',
    accountDetails: 'Informations du compte',
    businessDetails: 'Informations professionnelles',
    email: 'Adresse email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    displayName: 'Nom complet',
    shopName: 'Nom de l\'entreprise / Atelier',
    city: 'Ville',
    selectCity: 'Sélectionnez votre ville',
    phone: 'Téléphone',
    whatsapp: 'WhatsApp (optionnel)',
    description: 'Description de votre activité',
    descriptionPlaceholder: 'Décrivez vos services ou produits...',
    next: 'Suivant',
    back: 'Retour',
    register: 'S\'inscrire',
    cancel: 'Annuler',
    disclaimer: 'En vous inscrivant, vous acceptez que Mobile Maroc est une plateforme d\'annonces uniquement et ne participe à aucune transaction.',
    alreadyHaveAccount: 'Déjà un compte?',
    login: 'Se connecter',
  },
  ar: {
    title: 'إنشاء حساب',
    subtitle: 'انضم إلى مجتمع موبايل ماروك',
    selectUserType: 'اختر نوع حسابك',
    accountDetails: 'معلومات الحساب',
    businessDetails: 'المعلومات المهنية',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    displayName: 'الاسم الكامل',
    shopName: 'اسم الشركة / الورشة',
    city: 'المدينة',
    selectCity: 'اختر مدينتك',
    phone: 'الهاتف',
    whatsapp: 'واتساب (اختياري)',
    description: 'وصف نشاطك',
    descriptionPlaceholder: 'صف خدماتك أو منتجاتك...',
    next: 'التالي',
    back: 'رجوع',
    register: 'تسجيل',
    cancel: 'إلغاء',
    disclaimer: 'بالتسجيل، أنت توافق على أن موبايل ماروك هو منصة إعلانات فقط ولا يشارك في أي معاملة.',
    alreadyHaveAccount: 'لديك حساب؟',
    login: 'تسجيل الدخول',
  },
};

export function RegisterModal({ open, onOpenChange, language }: RegisterModalProps) {
  const t = translations[language];
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    shopName: '',
    city: '',
    phone: '',
    whatsapp: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = () => {
    // Registration logic would go here
    console.log('Register:', { userType, ...formData });
    onOpenChange(false);
  };

  const showShopName = userType === 'repair_shop' || userType === 'seller';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-lg max-h-[90vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="font-grotesk text-xl">{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <div className={`py-4 ${language === 'ar' ? 'font-tajawal' : ''}`}>
          {/* Step 1: Select User Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">{t.selectUserType}</h3>
              <div className="grid grid-cols-1 gap-3">
                {(Object.entries(USER_TYPES) as [UserType, typeof USER_TYPES[UserType]][]).map(([type, info]) => {
                  const Icon = userTypeIcons[type];
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserTypeSelect(type)}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{info.label[language]}</h4>
                        <p className="text-sm text-muted-foreground">{info.description[language]}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">{t.accountDetails}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/10">
                  {t.back}
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-primary">
                  {t.next}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">{t.businessDetails}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">{t.displayName}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              {showShopName && (
                <div className="space-y-2">
                  <Label htmlFor="shopName">{t.shopName}</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="shopName"
                      value={formData.shopName}
                      onChange={(e) => handleInputChange('shopName', e.target.value)}
                      className="pl-10 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>{t.city}</Label>
                <Select value={formData.city} onValueChange={(v) => handleInputChange('city', v)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t.selectCity} />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">{t.whatsapp}</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              {userType !== 'visitor' && (
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t.descriptionPlaceholder}
                    className="bg-white/5 border-white/10 min-h-[100px]"
                  />
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">{t.disclaimer}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-white/10">
                  {t.back}
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary">
                  {t.register}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
