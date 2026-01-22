import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart,
  DollarSign,
  Users,
  Megaphone,
  Award,
  CheckCircle,
} from "lucide-react";

interface AdvertiserSectionProps {
  language?: "ar" | "fr";
}

const AdvertiserSection: React.FC<AdvertiserSectionProps> = ({
  language = "ar",
}) => {
  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const pricingPlans = [
    {
      name: isRTL ? "أساسي" : "Basique",
      price: 299,
      duration: isRTL ? "شهريًا" : "par mois",
      description: isRTL
        ? "مثالي للمعلنين المبتدئين والأفراد"
        : "Idéal pour les annonceurs débutants et les particuliers",
      features: [
        isRTL ? "5 إعلانات مميزة" : "5 annonces en vedette",
        isRTL
          ? "ظهور في نتائج البحث"
          : "Apparition dans les résultats de recherche",
        isRTL ? "تقارير أساسية" : "Rapports de base",
        isRTL ? "دعم عبر البريد الإلكتروني" : "Support par email",
      ],
      popular: false,
    },
    {
      name: isRTL ? "احترافي" : "Professionnel",
      price: 799,
      duration: isRTL ? "شهريًا" : "par mois",
      description: isRTL
        ? "للشركات الصغيرة والمتوسطة"
        : "Pour les petites et moyennes entreprises",
      features: [
        isRTL ? "15 إعلانًا مميزًا" : "15 annonces en vedette",
        isRTL ? "ظهور في الصفحة الرئيسية" : "Apparition sur la page d'accueil",
        isRTL ? "تقارير متقدمة" : "Rapports avancés",
        isRTL ? "دعم على مدار الساعة" : "Support 24/7",
        isRTL ? "شارة معتمدة" : "Badge vérifié",
      ],
      popular: true,
    },
    {
      name: isRTL ? "متميز" : "Premium",
      price: 1499,
      duration: isRTL ? "شهريًا" : "par mois",
      description: isRTL
        ? "للشركات الكبيرة والمستوردين"
        : "Pour les grandes entreprises et les importateurs",
      features: [
        isRTL ? "إعلانات غير محدودة" : "Annonces illimitées",
        isRTL ? "ظهور في جميع الأقسام" : "Apparition dans toutes les sections",
        isRTL ? "تحليلات متقدمة" : "Analyses avancées",
        isRTL ? "مدير حساب مخصص" : "Gestionnaire de compte dédié",
        isRTL ? "أولوية الظهور" : "Priorité d'affichage",
        isRTL ? "عروض حصرية" : "Offres exclusives",
      ],
      popular: false,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {isRTL
                  ? "انضم إلى شبكة المعلنين لدينا"
                  : "Rejoignez notre réseau d'annonceurs"}
              </h1>
              <p className="text-muted-foreground md:text-xl">
                {isRTL
                  ? "احصل على وصول إلى آلاف المشترين المحتملين وزد من مبيعاتك من خلال منصتنا"
                  : "Accédez à des milliers d'acheteurs potentiels et augmentez vos ventes grâce à notre plateforme"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg">
                  {isRTL ? "ابدأ الآن" : "Commencer maintenant"}
                </Button>
                <Button size="lg" variant="outline">
                  {isRTL ? "تعرف على المزيد" : "En savoir plus"}
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
                alt="Advertising"
                className="rounded-lg object-cover shadow-xl"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {isRTL
                ? "لماذا تختار الإعلان معنا؟"
                : "Pourquoi choisir notre plateforme?"}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {isRTL
                ? "نقدم مجموعة من المزايا التي تساعدك على الوصول إلى جمهورك المستهدف وزيادة مبيعاتك"
                : "Nous offrons une gamme d'avantages qui vous aident à atteindre votre public cible et à augmenter vos ventes"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-primary mb-2" />
                <CardTitle>{isRTL ? "جمهور مستهدف" : "Public ciblé"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "الوصول إلى آلاف المستخدمين المهتمين بالهواتف والإكسسوارات"
                    : "Accédez à des milliers d'utilisateurs intéressés par les téléphones et accessoires"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <BarChart className="h-12 w-12 text-primary mb-2" />
                <CardTitle>
                  {isRTL ? "تحليلات متقدمة" : "Analyses avancées"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "تتبع أداء إعلاناتك واحصل على رؤى قيمة لتحسين استراتيجيتك"
                    : "Suivez les performances de vos annonces et obtenez des insights précieux pour améliorer votre stratégie"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Megaphone className="h-12 w-12 text-primary mb-2" />
                <CardTitle>
                  {isRTL ? "ظهور متميز" : "Visibilité premium"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "عرض منتجاتك في أماكن بارزة على المنصة لزيادة المبيعات"
                    : "Affichez vos produits dans des emplacements premium sur la plateforme pour augmenter les ventes"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {isRTL ? "خطط الإعلان" : "Plans publicitaires"}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {isRTL
                ? "اختر الخطة التي تناسب احتياجاتك"
                : "Choisissez le plan qui correspond à vos besoins"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2">
                    {isRTL ? "الأكثر شعبية" : "Le plus populaire"}
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    {plan.price}{" "}
                    <span className="ml-1 text-2xl font-medium text-muted-foreground">
                      MAD
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isRTL ? "اختر الخطة" : "Choisir ce plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {isRTL ? "ما يقوله المعلنون" : "Ce que disent nos annonceurs"}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {isRTL
                ? "تجارب حقيقية من معلنين على منصتنا"
                : "Expériences réelles d'annonceurs sur notre plateforme"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=company1"
                    alt="Company 1"
                    className="rounded-full w-12 h-12"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {isRTL ? "شركة تك وورلد" : "Tech World"}
                    </h4>
                    <div className="flex text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "منذ أن بدأنا الإعلان على هذه المنصة، زادت مبيعاتنا بنسبة 40٪. الجمهور المستهدف والتحليلات المتقدمة ساعدتنا كثيرًا."
                    : "Depuis que nous avons commencé à faire de la publicité sur cette plateforme, nos ventes ont augmenté de 40%. Le public ciblé et les analyses avancées nous ont beaucoup aidés."}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=company2"
                    alt="Company 2"
                    className="rounded-full w-12 h-12"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {isRTL ? "موبايل زون" : "Mobile Zone"}
                    </h4>
                    <div className="flex text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "الخطة الاحترافية توفر قيمة رائعة مقابل المال. نحن نحصل على عملاء جدد كل يوم بفضل الظهور المميز على المنصة."
                    : "Le plan professionnel offre un excellent rapport qualité-prix. Nous obtenons de nouveaux clients chaque jour grâce à la visibilité premium sur la plateforme."}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=company3"
                    alt="Company 3"
                    className="rounded-full w-12 h-12"
                  />
                  <div>
                    <h4 className="font-semibold">
                      {isRTL ? "سمارت فون" : "Smart Phone"}
                    </h4>
                    <div className="flex text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "فريق الدعم ممتاز والتقارير التحليلية تساعدنا على تحسين استراتيجيتنا باستمرار. نتائج رائعة خلال 3 أشهر فقط."
                    : "L'équipe de support est excellente et les rapports analytiques nous aident à améliorer constamment notre stratégie. Résultats impressionnants en seulement 3 mois."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {isRTL ? "ابدأ الإعلان اليوم" : "Commencez à annoncer aujourd'hui"}
          </h2>
          <p className="max-w-[700px] mx-auto text-primary-foreground/80 md:text-xl mb-6">
            {isRTL
              ? "انضم إلى شبكة المعلنين لدينا واستفد من الوصول إلى آلاف المشترين المحتملين"
              : "Rejoignez notre réseau d'annonceurs et profitez de l'accès à des milliers d'acheteurs potentiels"}
          </p>
          <Button size="lg" variant="secondary">
            {isRTL ? "سجل كمعلن" : "S'inscrire comme annonceur"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AdvertiserSection;
