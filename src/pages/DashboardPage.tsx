import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase/client";
import Navigation from "@/components/Navigation";
import ImporterDashboard from "@/components/dashboards/ImporterDashboard";
import TechnicianDashboard from "@/components/dashboards/TechnicianDashboard";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Store, Wrench, User } from "lucide-react";

type UserType = "importer" | "technician" | "customer" | null;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const labels = {
    welcome: isRTL ? "مرحباً بك" : "Bienvenue",
    selectRole: isRTL ? "اختر نوع حسابك" : "Sélectionnez votre type de compte",
    importer: isRTL ? "بائع / متجر" : "Vendeur / Boutique",
    technician: isRTL ? "فني إصلاح" : "Technicien",
    customer: isRTL ? "عميل" : "Client",
    importerDesc: isRTL ? "بيع الهواتف وقطع الغيار" : "Vendre téléphones et pièces",
    technicianDesc: isRTL ? "تقديم خدمات الإصلاح" : "Offrir des services de réparation",
    customerDesc: isRTL ? "البحث عن منتجات وخدمات" : "Rechercher produits et services",
    notLoggedIn: isRTL ? "يرجى تسجيل الدخول" : "Veuillez vous connecter",
    login: isRTL ? "تسجيل الدخول" : "Se connecter",
  };

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setUserType((profile as any)?.user_type as UserType);
      } catch { setUserType(null); }
      setLoading(false);
    };
    if (!authLoading) fetchUserType();
  }, [user, authLoading]);

  const handleSelectRole = async (type: UserType) => {
    if (!user || !type) return;
    try { await supabase.from("profiles").upsert({ id: user.id, user_type: type, email: user.email }); } catch {}
    setUserType(type);
  };

  if (authLoading || loading) {
    return (<div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}><Navigation /><div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-8 w-64 mb-4" /><div className="grid grid-cols-3 gap-6"><Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div></div></div>);
  }

  if (!user) {
    return (<div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}><Navigation /><div className="max-w-md mx-auto px-4 py-16 text-center"><User className="h-16 w-16 text-gray-300 mx-auto mb-6" /><h1 className="text-2xl font-bold mb-4">{labels.notLoggedIn}</h1><Link to="/auth/login"><Button size="lg">{labels.login}</Button></Link></div></div>);
  }

  if (!userType) {
    return (<div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}><Navigation /><div className="max-w-4xl mx-auto px-4 py-8"><h1 className={cn("text-3xl font-bold mb-2", isRTL && "text-right")}>{labels.welcome}</h1><p className={cn("text-gray-600 mb-8", isRTL && "text-right")}>{labels.selectRole}</p><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card className="cursor-pointer hover:shadow-lg border-2 hover:border-primary" onClick={() => handleSelectRole("importer")}><CardContent className="pt-6 text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Store className="h-8 w-8 text-blue-600" /></div><h3 className="text-lg font-semibold mb-2">{labels.importer}</h3><p className="text-sm text-gray-500">{labels.importerDesc}</p></CardContent></Card><Card className="cursor-pointer hover:shadow-lg border-2 hover:border-primary" onClick={() => handleSelectRole("technician")}><CardContent className="pt-6 text-center"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Wrench className="h-8 w-8 text-green-600" /></div><h3 className="text-lg font-semibold mb-2">{labels.technician}</h3><p className="text-sm text-gray-500">{labels.technicianDesc}</p></CardContent></Card><Card className="cursor-pointer hover:shadow-lg border-2 hover:border-primary" onClick={() => handleSelectRole("customer")}><CardContent className="pt-6 text-center"><div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><User className="h-8 w-8 text-purple-600" /></div><h3 className="text-lg font-semibold mb-2">{labels.customer}</h3><p className="text-sm text-gray-500">{labels.customerDesc}</p></CardContent></Card></div></div></div>);
  }

  switch (userType) {
    case "importer": return <ImporterDashboard />;
    case "technician": return <TechnicianDashboard />;
    case "customer": return <CustomerDashboard />;
    default: return <Navigate to="/" />;
  }
}
