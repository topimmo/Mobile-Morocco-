import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Menu,
  Globe,
  User,
  ShoppingCart,
  Heart,
  Bell,
  Tag,
  Percent,
  Star,
} from "lucide-react";
import CategorySection from "./CategorySection";
import ProductGrid from "./ProductGrid";
import FilterSidebar from "./FilterSidebar";

const Home = () => {
  const [language, setLanguage] = useState<"ar" | "fr">("ar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "fr" : "ar");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <a href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl hidden sm:inline-block">
                {isRTL ? "سوق الهواتف" : "Marché Mobile"}
              </span>
            </a>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 mx-4 max-w-md relative">
            <Input
              type="search"
              placeholder={
                isRTL
                  ? "ابحث عن هواتف، إكسسوارات..."
                  : "Rechercher téléphones, accessoires..."
              }
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={isRTL ? "Changer en français" : "تغيير إلى العربية"}
            >
              <Globe className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            <Button variant="outline" className="hidden md:flex gap-2">
              <User className="h-4 w-4" />
              <span>{isRTL ? "تسجيل الدخول" : "Connexion"}</span>
            </Button>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-background">
            <div className="flex mb-4 relative">
              <Input
                type="search"
                placeholder={
                  isRTL
                    ? "ابحث عن هواتف، إكسسوارات..."
                    : "Rechercher téléphones, accessoires..."
                }
                className="w-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <User className="h-4 w-4 mr-2" />
                <span>{isRTL ? "تسجيل الدخول" : "Connexion"}</span>
              </Button>
              <Button variant="outline" className="justify-start">
                <Heart className="h-4 w-4 mr-2" />
                <span>{isRTL ? "المفضلة" : "Favoris"}</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-primary/5 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {isRTL
                  ? "سوق الهواتف المغربي الأول"
                  : "Premier marché marocain de téléphones"}
              </h1>
              <p className="text-muted-foreground md:text-xl">
                {isRTL
                  ? "بيع وشراء الهواتف والإكسسوارات وقطع الغيار بسهولة. دعم كامل للمستخدمين العاديين والفنيين المحترفين"
                  : "Achetez et vendez des téléphones, accessoires et pièces détachées facilement. Support complet pour utilisateurs réguliers et techniciens professionnels"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex items-center gap-2">
                  {isRTL ? "تصفح المنتجات" : "Parcourir les produits"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
                <Button size="lg" variant="outline">
                  {isRTL ? "بيع منتج" : "Vendre un produit"}
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"
                alt="Smartphones"
                className="rounded-lg object-cover shadow-xl"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            {isRTL ? "تصفح حسب الفئة" : "Parcourir par catégorie"}
          </h2>
          <CategorySection language={language} />
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="py-12 bg-muted/20">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            {isRTL ? "أحدث المنتجات" : "Dernières annonces"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* This would be populated with actual latest listings */}
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={`latest-${i}`}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={`https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80&auto=format&fit=crop&crop=entropy&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1`}
                    alt="Product"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {isRTL ? "جديد" : "Nouveau"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 truncate">
                    {isRTL ? `منتج ${i}` : `Produit ${i}`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {isRTL
                      ? "وصف قصير للمنتج هنا"
                      : "Courte description du produit ici"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{`${1000 * i} ${isRTL ? "درهم" : "MAD"}`}</span>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? "منذ ساعة" : "Il y a 1h"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Searched Products */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            {isRTL ? "الأكثر بحثاً" : "Les plus recherchés"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "iPhone 13",
              "Samsung S21",
              "AirPods Pro",
              "Xiaomi Redmi Note",
            ].map((item, i) => (
              <Card
                key={`search-${i}`}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item}</h3>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? "+ 500 بحث" : "+ 500 recherches"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isRTL ? "صفقات مميزة" : "Offres spéciales"}
              </h2>
            </div>
            <Button variant="link" className="gap-1">
              {isRTL ? "عرض الكل" : "Voir tout"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${isRTL ? "rotate-180" : ""}`}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal 1 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80"
                  alt="iPhone Deal"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  -25%
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL
                    ? "آيفون 13 برو - حالة ممتازة"
                    : "iPhone 13 Pro - État excellent"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">
                      6,750 {isRTL ? "درهم" : "MAD"}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      9,000
                    </span>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {isRTL ? "ينتهي في 2 أيام" : "Expire dans 2j"}
                  </div>
                </div>
                <Button className="w-full mt-2">
                  {isRTL ? "عرض التفاصيل" : "Voir détails"}
                </Button>
              </CardContent>
            </Card>

            {/* Deal 2 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"
                  alt="Samsung Deal"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  -30%
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL
                    ? "سامسونج جالاكسي S21 - جديد"
                    : "Samsung Galaxy S21 - Neuf"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">
                      5,600 {isRTL ? "درهم" : "MAD"}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      8,000
                    </span>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {isRTL ? "ينتهي في 5 أيام" : "Expire dans 5j"}
                  </div>
                </div>
                <Button className="w-full mt-2">
                  {isRTL ? "عرض التفاصيل" : "Voir détails"}
                </Button>
              </CardContent>
            </Card>

            {/* Deal 3 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80"
                  alt="Accessories Deal"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  -40%
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL
                    ? "سماعات لاسلكية فاخرة"
                    : "Écouteurs sans fil premium"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold">
                      600 {isRTL ? "درهم" : "MAD"}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      1,000
                    </span>
                  </div>
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {isRTL ? "ينتهي اليوم" : "Expire aujourd'hui"}
                  </div>
                </div>
                <Button className="w-full mt-2">
                  {isRTL ? "عرض التفاصيل" : "Voir détails"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Suppliers Section */}
      <section className="py-12 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {isRTL ? "موردون مميزون" : "Fournisseurs premium"}
            </h2>
            <Button variant="link" className="gap-1">
              {isRTL ? "عرض الكل" : "Voir tout"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${isRTL ? "rotate-180" : ""}`}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Premium Supplier 1 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80"
                  alt="Premium Supplier"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  PREMIUM
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL ? "تك ماركت" : "Tech Market"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {isRTL
                    ? "متخصصون في الهواتف الذكية الجديدة والإكسسوارات الأصلية"
                    : "Spécialistes en smartphones neufs et accessoires originaux"}
                </p>
                <Button className="w-full">
                  {isRTL ? "زيارة المتجر" : "Visiter la boutique"}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Supplier 2 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
                  alt="Premium Supplier"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  PREMIUM
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL ? "موبايل وورلد" : "Mobile World"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {isRTL
                    ? "أكبر مجموعة من الهواتف المستعملة بحالة ممتازة وبضمان"
                    : "La plus grande collection de téléphones d'occasion en excellent état avec garantie"}
                </p>
                <Button className="w-full">
                  {isRTL ? "زيارة المتجر" : "Visiter la boutique"}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Supplier 3 */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-2 border-primary/20">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1563770660941-10a2b3654e41?w=800&q=80"
                  alt="Premium Supplier"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-br-lg">
                  PREMIUM
                </div>
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">
                  {isRTL ? "فيكس إكسبرت" : "Fix Expert"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= 4.5 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.5)</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {isRTL
                    ? "قطع غيار أصلية ومعدات صيانة احترافية لجميع الماركات"
                    : "Pièces détachées originales et équipements de réparation professionnels pour toutes les marques"}
                </p>
                <Button className="w-full">
                  {isRTL ? "زيارة المتجر" : "Visiter la boutique"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            {isRTL ? "منتجات مميزة" : "Produits en vedette"}
          </h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">{isRTL ? "الكل" : "Tous"}</TabsTrigger>
              <TabsTrigger value="new">{isRTL ? "جديد" : "Neuf"}</TabsTrigger>
              <TabsTrigger value="used">
                {isRTL ? "مستعمل" : "Occasion"}
              </TabsTrigger>
              <TabsTrigger value="accessories">
                {isRTL ? "إكسسوارات" : "Accessoires"}
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 lg:w-1/5">
                <FilterSidebar language={language} />
              </div>

              <div className="md:w-3/4 lg:w-4/5">
                <TabsContent value="all" className="mt-0">
                  <ProductGrid language={language} category="all" />
                </TabsContent>
                <TabsContent value="new" className="mt-0">
                  <ProductGrid language={language} category="new" />
                </TabsContent>
                <TabsContent value="used" className="mt-0">
                  <ProductGrid language={language} category="used" />
                </TabsContent>
                <TabsContent value="accessories" className="mt-0">
                  <ProductGrid language={language} category="accessories" />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
            {isRTL ? "ماذا يقول عملاؤنا" : "Ce que disent nos clients"}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">
                      {isRTL ? `مستخدم ${i}` : `Utilisateur ${i}`}
                    </h4>
                    <div className="flex text-yellow-500">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <svg
                            key={j}
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
                    ? "منصة رائعة وسهلة الاستخدام. وجدت هاتفي الجديد بسعر ممتاز وكانت عملية الشراء سلسة للغاية."
                    : "Plateforme géniale et facile à utiliser. J'ai trouvé mon nouveau téléphone à un excellent prix et le processus d'achat était très fluide."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {isRTL ? "انضم إلينا اليوم" : "Rejoignez-nous aujourd'hui"}
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            {isRTL
              ? "سجل الآن واستفد من 45 يومًا مجانيًا للوصول إلى جميع الميزات. ابدأ في بيع أو شراء الهواتف والإكسسوارات بسهولة."
              : "Inscrivez-vous maintenant et bénéficiez de 45 jours gratuits pour accéder à toutes les fonctionnalités. Commencez à vendre ou acheter des téléphones et accessoires facilement."}
          </p>
          <Button size="lg" variant="secondary">
            {isRTL ? "سجل الآن" : "S'inscrire maintenant"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "سوق الهواتف" : "Marché Mobile"}
              </h3>
              <p className="text-muted-foreground">
                {isRTL
                  ? "المنصة المغربية الأولى لبيع وشراء الهواتف والإكسسوارات وقطع الغيار."
                  : "La première plateforme marocaine pour acheter et vendre des téléphones, accessoires et pièces détachées."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "روابط سريعة" : "Liens rapides"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "الصفحة الرئيسية" : "Accueil"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "تصفح المنتجات" : "Parcourir les produits"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "بيع منتج" : "Vendre un produit"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "حسابي" : "Mon compte"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "الفئات" : "Catégories"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "هواتف جديدة" : "Téléphones neufs"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "هواتف مستعملة" : "Téléphones d'occasion"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "إكسسوارات" : "Accessoires"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "قطع غيار" : "Pièces détachées"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isRTL ? "معدات صيانة" : "Équipement de réparation"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {isRTL ? "تواصل معنا" : "Contactez-nous"}
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  {isRTL
                    ? "البريد الإلكتروني: info@mobilemarche.ma"
                    : "Email: info@mobilemarche.ma"}
                </li>
                <li className="text-muted-foreground">
                  {isRTL
                    ? "الهاتف: +212 5XX-XXXXXX"
                    : "Téléphone: +212 5XX-XXXXXX"}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2023{" "}
              {isRTL
                ? "سوق الهواتف. جميع الحقوق محفوظة"
                : "Marché Mobile. Tous droits réservés"}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                {isRTL ? "سياسة الخصوصية" : "Politique de confidentialité"}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                {isRTL ? "شروط الاستخدام" : "Conditions d'utilisation"}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
