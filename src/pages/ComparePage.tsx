import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductComparison from "@/components/ProductComparison";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart2, ArrowRight, ArrowLeft } from "lucide-react";

const translations = {
  ar: {
    pageTitle: "مقارنة الهواتف",
    pageDescription: "قارن بين الهواتف المختلفة لاتخاذ قرار الشراء الأفضل",
    emptyTitle: "لا توجد هواتف للمقارنة",
    emptyDescription: "أضف هواتف للمقارنة من صفحة الهواتف",
    browsePhones: "تصفح الهواتف",
    maxPhones: "يمكنك مقارنة حتى 3 هواتف"
  },
  fr: {
    pageTitle: "Comparer les téléphones",
    pageDescription: "Comparez différents téléphones pour prendre la meilleure décision d'achat",
    emptyTitle: "Aucun téléphone à comparer",
    emptyDescription: "Ajoutez des téléphones à comparer depuis la page des téléphones",
    browsePhones: "Parcourir les téléphones",
    maxPhones: "Vous pouvez comparer jusqu'à 3 téléphones"
  }
};

function ComparePageContent() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <BarChart2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.pageTitle}</h1>
          <p className="text-gray-600">{t.pageDescription}</p>
          <p className="text-sm text-primary mt-2">{t.maxPhones}</p>
        </div>

        {/* Comparison Component */}
        <ProductComparison />
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <FavoritesProvider>
      <ComparisonProvider>
        <ComparePageContent />
      </ComparisonProvider>
    </FavoritesProvider>
  );
}
