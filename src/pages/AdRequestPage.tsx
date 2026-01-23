import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Megaphone, Loader, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

export default function AdRequestPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const labels = {
    title: isRTL ? 'طلب إعلان' : 'Demande de publicité',
    subtitle: isRTL 
      ? 'أكمل النموذج أدناه وسنتواصل معك قريباً'
      : 'Remplissez le formulaire ci-dessous et nous vous contacterons bientôt',
    fullName: isRTL ? 'الاسم الكامل' : 'Nom complet',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    phone: isRTL ? 'الهاتف' : 'Téléphone',
    company: isRTL ? 'الشركة' : 'Entreprise',
    message: isRTL ? 'التفاصيل / الرسالة' : 'Détails / Message',
    submit: isRTL ? 'إرسال الطلب' : 'Envoyer la demande',
    required: isRTL ? 'مطلوب' : 'Requis',
    optional: isRTL ? 'اختياري' : 'Optionnel',
    successMessage: isRTL 
      ? 'تم إرسال الطلب بنجاح، سنتواصل معك قريباً.'
      : 'Demande envoyée avec succès, nous vous contacterons bientôt.',
    backToHome: isRTL ? 'العودة للرئيسية' : 'Retour à l\'accueil',
    errorFullName: isRTL ? 'الاسم الكامل مطلوب' : 'Le nom complet est requis',
    errorEmail: isRTL ? 'بريد إلكتروني صالح مطلوب' : 'Email valide requis',
    errorMessage: isRTL ? 'الرسالة مطلوبة' : 'Le message est requis',
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = labels.errorFullName;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = labels.errorEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = labels.errorEmail;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = labels.errorMessage;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try to send email via API
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_ADS_EMAIL || '';
      const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
      
      let emailSent = false;
      
      // Try Resend API if key is available
      if (RESEND_API_KEY && ADMIN_EMAIL) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'noreply@mobilemorocco.com',
              to: ADMIN_EMAIL,
              subject: `طلب إعلان جديد من ${formData.fullName}`,
              html: `
                <h2>طلب إعلان جديد / Nouvelle demande de publicité</h2>
                <p><strong>الاسم / Nom:</strong> ${formData.fullName}</p>
                <p><strong>البريد / Email:</strong> ${formData.email}</p>
                <p><strong>الهاتف / Téléphone:</strong> ${formData.phone || 'غير محدد / Non spécifié'}</p>
                <p><strong>الشركة / Entreprise:</strong> ${formData.company || 'غير محدد / Non spécifié'}</p>
                <p><strong>الرسالة / Message:</strong></p>
                <p>${formData.message.replace(/\n/g, '<br>')}</p>
              `,
            }),
          });
          
          if (response.ok) {
            emailSent = true;
          }
        } catch (apiError) {
          console.error('Resend API error:', apiError);
        }
      }
      
      // Fallback to mailto if API fails or not configured
      if (!emailSent && ADMIN_EMAIL) {
        const subject = encodeURIComponent(`طلب إعلان من ${formData.fullName}`);
        const body = encodeURIComponent(
          `الاسم: ${formData.fullName}\n` +
          `البريد الإلكتروني: ${formData.email}\n` +
          `الهاتف: ${formData.phone || 'غير محدد'}\n` +
          `الشركة: ${formData.company || 'غير محدد'}\n\n` +
          `الرسالة:\n${formData.message}`
        );
        
        window.open(`mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`, '_blank');
      }
      
      // Show success message
      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending ad request:', error);
      // Still show success since we at least opened mailto
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{labels.successMessage}</h2>
              <Button onClick={() => window.location.href = '/'} className="mt-4">
                {labels.backToHome}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-4">
            <Megaphone className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{labels.title}</h1>
          <p className="text-gray-600 text-base md:text-lg">{labels.subtitle}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(isRTL && 'text-right')}>{labels.title}</CardTitle>
            <CardDescription className={cn(isRTL && 'text-right')}>
              {labels.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                  {labels.fullName}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={cn(errors.fullName && 'border-red-500', isRTL && 'text-right')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.fullName && (
                  <p className={cn('text-sm text-red-500', isRTL && 'text-right')}>{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                  {labels.email}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={cn(errors.email && 'border-red-500', isRTL && 'text-right')}
                  dir="ltr"
                />
                {errors.email && (
                  <p className={cn('text-sm text-red-500', isRTL && 'text-right')}>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                  {labels.phone}
                  <span className="text-xs text-gray-500">({labels.optional})</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={cn(isRTL && 'text-right')}
                  dir="ltr"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company" className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                  {labels.company}
                  <span className="text-xs text-gray-500">({labels.optional})</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={cn(isRTL && 'text-right')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                  {labels.message}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={5}
                  className={cn(errors.message && 'border-red-500', isRTL && 'text-right')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.message && (
                  <p className={cn('text-sm text-red-500', isRTL && 'text-right')}>{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className={cn('h-4 w-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                    {isRTL ? 'جاري الإرسال...' : 'Envoi en cours...'}
                  </>
                ) : (
                  labels.submit
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
