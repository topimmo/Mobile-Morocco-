import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";

interface FeatureProps {
  title: string;
  free: boolean;
  premium: boolean;
}

const Feature: React.FC<FeatureProps> = ({ title, free, premium }) => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] sm:grid-cols-3 py-4 border-b last:border-0 gap-2">
      <div className="font-medium text-sm sm:text-base">{title}</div>
      <div className="text-center">
        {free ? (
          <Check className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-green-500" />
        ) : (
          <X className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-red-500" />
        )}
      </div>
      <div className="text-center">
        {premium ? (
          <Check className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-green-500" />
        ) : (
          <X className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-red-500" />
        )}
      </div>
    </div>
  );
};

const SubscriptionComparison: React.FC = () => {
  const [language, setLanguage] = useState<Language>("ar");
  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Features data
  const features = [
    {
      titleAr: "إضافة منتجات غير محدودة",
      titleFr: "Ajout de produits illimités",
      free: true,
      premium: true,
    },
    {
      titleAr: "عرض مميز في الصفحة الرئيسية",
      titleFr: "Placement en vedette sur la page d'accueil",
      free: false,
      premium: true,
    },
    {
      titleAr: "دعم عبر الواتساب",
      titleFr: "Support WhatsApp",
      free: false,
      premium: true,
    },
    {
      titleAr: "إعلانات مميزة (حدود ملونة)",
      titleFr: "Annonces en surbrillance (bordure colorée)",
      free: false,
      premium: true,
    },
    {
      titleAr: "أولوية في نتائج البحث",
      titleFr: "Priorité dans les résultats de recherche",
      free: false,
      premium: true,
    },
    {
      titleAr: "إحصائيات المبيعات والزيارات",
      titleFr: "Statistiques de ventes et de visites",
      free: false,
      premium: true,
    },
    {
      titleAr: "إمكانية تحميل صور متعددة للمنتج",
      titleFr: "Possibilité de télécharger plusieurs images de produit",
      free: true,
      premium: true,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">
                {isRTL ? "مقارنة الاشتراكات" : "Comparaison des abonnements"}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "ar" ? "fr" : "ar")}
            >
              {isRTL ? "FR" : "AR"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            {isRTL
              ? "اختر الخطة المناسبة لعملك"
              : "Choisissez le plan adapté à votre entreprise"}
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card className="border-2 border-muted">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">
                  {isRTL ? "الخطة المجانية" : "Plan Gratuit"}
                </CardTitle>
                <p className="text-3xl font-bold mt-2">
                  {isRTL ? "0 درهم" : "0 MAD"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "للأبد" : "Pour toujours"}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "إضافة منتجات غير محدودة"
                      : "Ajout de produits illimités"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "إمكانية تحميل صور متعددة للمنتج"
                      : "Possibilité de télécharger plusieurs images de produit"}
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  {isRTL ? "ابدأ الآن" : "Commencer maintenant"}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary">
              <CardHeader className="text-center pb-2 bg-primary/5">
                <CardTitle className="text-2xl">
                  {isRTL ? "الخطة المميزة" : "Plan Premium"}
                </CardTitle>
                <p className="text-3xl font-bold mt-2">
                  {isRTL ? "299 درهم" : "299 MAD"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "شهريًا" : "Par mois"}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "إضافة منتجات غير محدودة"
                      : "Ajout de produits illimités"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "عرض مميز في الصفحة الرئيسية"
                      : "Placement en vedette sur la page d'accueil"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL ? "دعم عبر الواتساب" : "Support WhatsApp"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "إعلانات مميزة (حدود ملونة)"
                      : "Annonces en surbrillance (bordure colorée)"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {isRTL
                      ? "أولوية في نتائج البحث"
                      : "Priorité dans les résultats de recherche"}
                  </li>
                </ul>
                <Button className="w-full">
                  {isRTL ? "اشترك الآن" : "S'abonner maintenant"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Feature Comparison Table */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-center">
                {isRTL ? "مقارنة المميزات" : "Comparaison des fonctionnalités"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[2fr_1fr_1fr] sm:grid-cols-3 font-bold border-b pb-2 gap-2">
                <div className="text-sm sm:text-base">{isRTL ? "الميزة" : "Fonctionnalité"}</div>
                <div className="text-center text-sm sm:text-base">{isRTL ? "مجاني" : "Gratuit"}</div>
                <div className="text-center text-sm sm:text-base">{isRTL ? "مميز" : "Premium"}</div>
              </div>
              {features.map((feature, index) => (
                <Feature
                  key={index}
                  title={isRTL ? feature.titleAr : feature.titleFr}
                  free={feature.free}
                  premium={feature.premium}
                />
              ))}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isRTL
                ? "ترقية إلى الخطة المميزة اليوم"
                : "Passez au plan premium aujourd'hui"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {isRTL
                ? "استفد من جميع المميزات واحصل على المزيد من المبيعات"
                : "Profitez de toutes les fonctionnalités et obtenez plus de ventes"}
            </p>
            <Button size="lg">
              {isRTL ? "ترقية الآن" : "Mettre à niveau maintenant"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionComparison;
