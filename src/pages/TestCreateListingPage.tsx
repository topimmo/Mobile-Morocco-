import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CreateListingForm } from '@/components/CreateListingForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function TestCreateListingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const labels = {
    title: isRTL ? 'نموذج إنشاء إعلان محسّن' : 'Formulaire de création d\'annonce amélioré',
    subtitle: isRTL 
      ? 'اختبار الحقول المبنية على الفئة والحقول الاختيارية' 
      : 'Test des champs basés sur les catégories et des champs optionnels',
  };

  const handleSuccess = (listingId: string) => {
    console.log('Listing created successfully:', listingId);
    // Could navigate to the listing page
    // navigate(`/listings/${listingId}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', isRTL && 'rtl')}>
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={cn(
            'text-3xl font-bold mb-2',
            isRTL && 'text-right'
          )}>
            {labels.title}
          </h1>
          <p className={cn(
            'text-gray-600',
            isRTL && 'text-right'
          )}>
            {labels.subtitle}
          </p>
        </div>

        <CreateListingForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>

      <Footer />
    </div>
  );
}
