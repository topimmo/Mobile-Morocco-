import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageLayout, PageMain } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import ProductComparison from "@/components/ProductComparison";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <PageLayout dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <PageMain className="bg-background">
        <Container className="py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <SectionHeader
              as="h1"
              title={t.pageTitle}
              description={t.pageDescription}
              align="center"
              className="mb-2"
            />
            <Badge variant="secondary" className="text-sm">{t.maxPhones}</Badge>
          </div>

          {/* Comparison Component */}
          <ProductComparison />
        </Container>
      </PageMain>

      <Footer />
    </PageLayout>
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
