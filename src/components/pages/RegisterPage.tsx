import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Store, Wrench, Settings, Eye, Mail, Lock, Phone, MapPin, Building, ChevronRight, ChevronLeft, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserType, USER_TYPES, MOROCCAN_CITIES } from '@/types/user';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/use-toast';

const userTypeIcons: Record<UserType, React.ComponentType<{ className?: string }>> = {
  'repair_shop': Wrench,
  'seller': Store,
  'technician': Settings,
  'advertiser': Eye,
  'visitor': User,
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Step 2 validation: Account Details
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Step 3 validation: Professional Information
    if (!formData.displayName) {
      newErrors.displayName = 'Le nom complet est requis';
    }

    if ((userType === 'repair_shop' || userType === 'seller') && !formData.shopName) {
      newErrors.shopName = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.city) {
      newErrors.city = 'La ville est requise';
    }

    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🔵 Starting registration process...', { userType, formData: { ...formData, password: '[REDACTED]' } });

    // Validate form
    if (!validateForm()) {
      console.log('❌ Form validation failed', errors);
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire',
        variant: 'destructive',
      });
      return;
    }

    if (!userType) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un type de compte',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 Step 1: Creating auth account with Supabase...');
      
      // Step 1: Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName,
            user_type: userType,
          },
        },
      });

      console.log('📊 Auth signup response:', { data: authData, error: authError });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error('❌ No user returned from signup');
        throw new Error('Échec de la création du compte');
      }

      console.log('✅ Auth account created successfully, user ID:', authData.user.id);
      console.log('🔵 Step 2: Creating profile in database...');

      // Step 2: Create user profile
      const profileData = {
        id: authData.user.id,
        email: formData.email,
        user_type: userType,
        display_name: formData.displayName,
        shop_name: formData.shopName || null,
        city: formData.city,
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        description: formData.description || null,
        is_verified: false,
        subscription_type: 'free',
      };

      console.log('📊 Attempting to insert profile:', profileData);

      const { data: profileInsertData, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      console.log('📊 Profile insert response:', { data: profileInsertData, error: profileError });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        console.error('❌ Profile error details:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
        });
        throw new Error(`Échec de la création du profil: ${profileError.message}`);
      }

      console.log('✅ Profile created successfully');
      console.log('✅ Registration completed successfully!');

      // Show success message
      toast({
        title: 'Compte créé avec succès!',
        description: 'Bienvenue sur Mobile Maroc. Vous allez être redirigé...',
      });

      // Navigate to appropriate dashboard based on user type
      setTimeout(() => {
        switch (userType) {
          case 'repair_shop':
          case 'seller':
            navigate('/dashboard');
            break;
          case 'technician':
            navigate('/dashboard/technician');
            break;
          case 'advertiser':
            navigate('/dashboard/advertiser');
            break;
          case 'visitor':
          default:
            navigate('/');
            break;
        }
      }, 1500);

    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
      // Display error to user
      toast({
        title: 'Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showShopName = userType === 'repair_shop' || userType === 'seller';

  return (
    <div className="min-h-screen bg-background">
      {/* Legal Disclaimer Banner */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200">
              <strong>Important:</strong> Mobile Maroc est une plateforme d'annonces uniquement. 
              Nous ne gérons aucune transaction ou paiement.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-grotesk font-bold mb-2">Créer un Compte</h1>
            <p className="text-muted-foreground">Rejoignez la communauté Mobile Maroc</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'
                }`}>
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="glass-card rounded-xl p-8 border border-white/10">
            {/* Step 1: Select User Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-6">Choisissez votre type de compte</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {(Object.entries(USER_TYPES) as [UserType, typeof USER_TYPES[UserType]][]).map(([type, info]) => {
                    const Icon = userTypeIcons[type];
                    return (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUserTypeSelect(type)}
                        className="flex items-center gap-4 p-5 rounded-xl border border-white/10 hover:border-primary/50 transition-all text-left"
                      >
                        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{info.label.fr}</h4>
                          <p className="text-sm text-muted-foreground">{info.description.fr}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {info.permissions.slice(0, 3).map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-muted-foreground" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-semibold">Informations du compte</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 bg-white/5 border-white/10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`pl-10 bg-white/5 border-white/10 ${errors.password ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`pl-10 bg-white/5 border-white/10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/10">
                    Retour
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-primary">
                    Suivant
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Business Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setStep(2)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-semibold">Informations professionnelles</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className={`pl-10 bg-white/5 border-white/10 ${errors.displayName ? 'border-red-500' : ''}`}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.displayName && (
                      <p className="text-sm text-red-500">{errors.displayName}</p>
                    )}
                  </div>

                  {showShopName && (
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Nom de l'entreprise / Atelier</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="shopName"
                          value={formData.shopName}
                          onChange={(e) => handleInputChange('shopName', e.target.value)}
                          className={`pl-10 bg-white/5 border-white/10 ${errors.shopName ? 'border-red-500' : ''}`}
                          placeholder="Nom de votre boutique"
                        />
                      </div>
                      {errors.shopName && (
                        <p className="text-sm text-red-500">{errors.shopName}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Select value={formData.city} onValueChange={(v) => handleInputChange('city', v)}>
                      <SelectTrigger className={`bg-white/5 border-white/10 ${errors.city ? 'border-red-500' : ''}`}>
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sélectionnez votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOROCCAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`pl-10 bg-white/5 border-white/10 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="+212 6XX-XXXXXX"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp (optionnel)</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        className="bg-white/5 border-white/10"
                        placeholder="+212 6XX-XXXXXX"
                      />
                    </div>
                  </div>

                  {userType !== 'visitor' && (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description de votre activité</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Décrivez vos services ou produits..."
                        className="bg-white/5 border-white/10 min-h-[100px]"
                      />
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200">
                      En vous inscrivant, vous acceptez que Mobile Maroc est une plateforme d'annonces uniquement 
                      et ne participe à aucune transaction commerciale, paiement ou livraison.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)} 
                    className="flex-1 border-white/10"
                    disabled={isLoading}
                  >
                    Retour
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 bg-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Déjà un compte?{' '}
              <a href="/login" className="text-primary hover:underline">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge component for permissions (if not imported)
function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
      variant === 'outline' ? 'border border-white/20 text-muted-foreground' : 'bg-primary/20 text-primary'
    } ${className}`}>
      {children}
    </span>
  );
}
