import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  ShoppingBag,
  Eye,
  Bell,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  DollarSign,
  Megaphone,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubscriptionList from "@/components/admin/SubscriptionList";

const AdminDashboard = () => {
  const [language, setLanguage] = useState<"ar" | "fr">("ar");

  // Statistics state
  const [stats, setStats] = useState({
    totalProducts: 1245,
    totalUsers: 876,
    activeUsers: 342,
    dailyVisitors: 1890,
    pendingReviews: 24,
    reportedItems: 7,
    activeAds: 0,
    paidSubscribers: 0,
    featuredAds: 0,
    expiringAds: 0,
  });

  // Fetch ad and subscription statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Import services dynamically to avoid circular dependencies
        const adService = await import("@/services/adService");
        const subscriptionService = await import(
          "@/services/subscriptionService"
        );

        // Get ad statistics
        const adStats = await adService.getAdStats();

        // Get subscription statistics
        const subStats = await subscriptionService.getSubscriptionStats();

        // Check for expiring ads (ads expiring in the next 5 days)
        const allAds = await adService.getAllAds();
        const expiringAdsCount = await Promise.all(
          allAds.map((ad) => adService.isAdExpiringSoon(ad.id, 5)),
        ).then((results) => results.filter(Boolean).length);

        // Update statistics
        setStats((prevStats) => ({
          ...prevStats,
          activeAds: adStats.active,
          paidSubscribers: subStats.premium,
          featuredAds: allAds.filter(
            (ad) => ad.position === "header" || ad.position === "home_middle",
          ).length,
          expiringAds: expiringAdsCount,
        }));
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  // Mock data for recent users
  const recentUsers = [
    { id: 1, name: "Ahmed Hassan", type: "Customer", date: "2023-06-15" },
    { id: 2, name: "Fatima Zahra", type: "Technician", date: "2023-06-14" },
    { id: 3, name: "Youssef Amrani", type: "Importer", date: "2023-06-14" },
    { id: 4, name: "Layla Benjelloun", type: "Customer", date: "2023-06-13" },
  ];

  // Mock data for pending reviews
  const pendingReviews = [
    {
      id: 101,
      title: "iPhone 13 Pro",
      seller: "TechImport",
      date: "2023-06-15",
    },
    {
      id: 102,
      title: "Samsung Galaxy S21",
      seller: "MobileWorld",
      date: "2023-06-15",
    },
    {
      id: 103,
      title: "AirPods Pro",
      seller: "AccessoryShop",
      date: "2023-06-14",
    },
    {
      id: 104,
      title: "Xiaomi Redmi Note",
      seller: "SmartGadgets",
      date: "2023-06-14",
    },
  ];

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
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl">
                {isRTL ? "لوحة الإدارة" : "Panneau d'administration"}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "ar" ? "fr" : "ar")}
            >
              {isRTL ? "FR" : "AR"}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/20 p-4 hidden md:block">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              {isRTL ? "لوحة المعلومات" : "Tableau de bord"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              {isRTL ? "المستخدمون" : "Utilisateurs"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isRTL ? "المنتجات" : "Produits"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Megaphone className="mr-2 h-4 w-4" />
              {isRTL ? "الإعلانات" : "Publicités"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              {isRTL ? "الاشتراكات" : "Abonnements"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              {isRTL ? "الإشعارات" : "Notifications"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {isRTL ? "التقارير" : "Rapports"}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              {isRTL ? "الإعدادات" : "Paramètres"}
            </Button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isRTL ? "لوحة المعلومات" : "Tableau de bord"}
          </h1>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "إجمالي المنتجات" : "Total des produits"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "إجمالي المستخدمين" : "Total des utilisateurs"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "المستخدمون النشطون" : "Utilisateurs actifs"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "الزوار اليوميون" : "Visiteurs quotidiens"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.dailyVisitors}
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "مراجعات معلقة" : "Révisions en attente"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.pendingReviews}
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "عناصر تم الإبلاغ عنها" : "Éléments signalés"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.reportedItems}
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Statistics Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "إعلانات نشطة" : "Publicités actives"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.activeAds}</div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "مشتركون مدفوعون" : "Abonnés payants"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.paidSubscribers}
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL ? "إعلانات مميزة" : "Publicités en vedette"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.featuredAds}</div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isRTL
                    ? "إعلانات تنتهي قريبًا"
                    : "Publicités expirant bientôt"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.expiringAds}</div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="reviews">
                {isRTL ? "مراجعات معلقة" : "Révisions en attente"}
              </TabsTrigger>
              <TabsTrigger value="users">
                {isRTL ? "مستخدمون جدد" : "Nouveaux utilisateurs"}
              </TabsTrigger>
              <TabsTrigger value="ads">
                {isRTL ? "الإعلانات" : "Publicités"}
              </TabsTrigger>
              <TabsTrigger value="subscriptions">
                {isRTL ? "الاشتراكات" : "Abonnements"}
              </TabsTrigger>
              <TabsTrigger value="reports">
                {isRTL ? "تقارير" : "Rapports"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {isRTL ? "مراجعات معلقة" : "Révisions en attente"}
                    </CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={isRTL ? "بحث..." : "Rechercher..."}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">
                            {isRTL ? "المعرف" : "ID"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "العنوان" : "Titre"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "البائع" : "Vendeur"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "التاريخ" : "Date"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingReviews.map((review) => (
                          <tr
                            key={review.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-2">{review.id}</td>
                            <td className="py-3 px-2">{review.title}</td>
                            <td className="py-3 px-2">{review.seller}</td>
                            <td className="py-3 px-2">{review.date}</td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  {isRTL ? "عرض" : "Voir"}
                                </Button>
                                <Button size="sm" variant="default">
                                  {isRTL ? "موافقة" : "Approuver"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {isRTL ? "مستخدمون جدد" : "Nouveaux utilisateurs"}
                    </CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={isRTL ? "بحث..." : "Rechercher..."}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">
                            {isRTL ? "المعرف" : "ID"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "الاسم" : "Nom"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "النوع" : "Type"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "تاريخ التسجيل" : "Date d'inscription"}
                          </th>
                          <th className="text-left py-3 px-2">
                            {isRTL ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-2">{user.id}</td>
                            <td className="py-3 px-2">{user.name}</td>
                            <td className="py-3 px-2">{user.type}</td>
                            <td className="py-3 px-2">{user.date}</td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  {isRTL ? "عرض" : "Voir"}
                                </Button>
                                <Button size="sm" variant="default">
                                  {isRTL ? "تعديل" : "Modifier"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "تقارير المستخدمين" : "Rapports des utilisateurs"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {isRTL
                      ? "لا توجد تقارير جديدة في الوقت الحالي."
                      : "Aucun nouveau rapport pour le moment."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {isRTL ? "إدارة الإعلانات" : "Gestion des publicités"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isRTL ? "بحث..." : "Rechercher..."}
                          className="pl-8"
                        />
                      </div>
                      <Button size="sm" variant="default">
                        {isRTL ? "إضافة إعلان" : "Ajouter une publicité"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? "المعرف" : "ID"}</TableHead>
                        <TableHead>{isRTL ? "العنوان" : "Titre"}</TableHead>
                        <TableHead>{isRTL ? "النوع" : "Type"}</TableHead>
                        <TableHead>
                          {isRTL ? "الموقع" : "Emplacement"}
                        </TableHead>
                        <TableHead>{isRTL ? "المدة" : "Durée"}</TableHead>
                        <TableHead>{isRTL ? "الحالة" : "Statut"}</TableHead>
                        <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>AD001</TableCell>
                        <TableCell>iPhone 13 Pro Max</TableCell>
                        <TableCell>Banner</TableCell>
                        <TableCell>Home Page</TableCell>
                        <TableCell>30 days</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {isRTL ? "نشط" : "Actif"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              {isRTL ? "عرض" : "Voir"}
                            </Button>
                            <Button size="sm" variant="default">
                              {isRTL ? "تعديل" : "Modifier"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>AD002</TableCell>
                        <TableCell>Samsung Galaxy S21</TableCell>
                        <TableCell>Sidebar</TableCell>
                        <TableCell>Category Page</TableCell>
                        <TableCell>15 days</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {isRTL ? "قيد المراجعة" : "En révision"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              {isRTL ? "عرض" : "Voir"}
                            </Button>
                            <Button size="sm" variant="default">
                              {isRTL ? "تعديل" : "Modifier"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-0">
              <Card>
                <CardContent>
                  {/* Import and use the SubscriptionList component */}
                  <SubscriptionList language={language} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
