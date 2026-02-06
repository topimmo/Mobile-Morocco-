import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Store, Wrench, Settings, Eye, Mail, Lock, Phone, MapPin, Building, ChevronRight, ChevronLeft, AlertTriangle, Check } from 'lucide-react';
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

const userTypeIcons: Record<UserType, React.ComponentType<{ className?: string }>> = {
  'repair_shop': Wrench,
  'seller': Store,
  'technician': Settings,
  'advertiser': Eye,
  'visitor': User,
};

export function RegisterPage() {
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
    console.log('Register:', { userType, ...formData });
    // Registration logic would go here
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
                        className="pl-10 bg-white/5 border-white/10"
                        placeholder="votre@email.com"
                      />
                    </div>
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
                          className="pl-10 bg-white/5 border-white/10"
                        />
                      </div>
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
                          className="pl-10 bg-white/5 border-white/10"
                        />
                      </div>
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
                        className="pl-10 bg-white/5 border-white/10"
                        placeholder="Votre nom"
                      />
                    </div>
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
                          className="pl-10 bg-white/5 border-white/10"
                          placeholder="Nom de votre boutique"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Select value={formData.city} onValueChange={(v) => handleInputChange('city', v)}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sélectionnez votre ville" />
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
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10 bg-white/5 border-white/10"
                          placeholder="+212 6XX-XXXXXX"
                        />
                      </div>
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
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-white/10">
                    Retour
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 bg-primary">
                    Créer mon compte
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
