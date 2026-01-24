import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  getAllSubscriptions,
  Subscription,
  renewSubscription,
} from "@/services/subscriptionService";
import { Language } from '@/contexts/LanguageContext';

interface SubscriptionListProps {
  language?: Language;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ language }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const { toast } = useToast();

  const isRTL = language === "ar";

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: isRTL ? "خطأ" : "Erreur",
        description: isRTL
          ? "حدث خطأ أثناء جلب الاشتراكات"
          : "Une erreur s'est produite lors de la récupération des abonnements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleRenewSubscription = async (id: string) => {
    try {
      setRenewingId(id);
      // Default renewal period is 30 days
      const renewalPeriod = 30;
      await renewSubscription(id, renewalPeriod);

      // Refresh the subscription list
      await fetchSubscriptions();

      toast({
        title: isRTL ? "تم التجديد بنجاح" : "Renouvellement réussi",
        description: isRTL
          ? "تم تجديد الاشتراك بنجاح"
          : "L'abonnement a été renouvelé avec succès",
      });
    } catch (error) {
      console.error("Error renewing subscription:", error);
      toast({
        title: isRTL ? "خطأ" : "Erreur",
        description: isRTL
          ? "حدث خطأ أثناء تجديد الاشتراك"
          : "Une erreur s'est produite lors du renouvellement de l'abonnement",
        variant: "destructive",
      });
    } finally {
      setRenewingId(null);
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();
    return (
      subscription.id.toLowerCase().includes(searchTermLower) ||
      subscription.userId.toLowerCase().includes(searchTermLower) ||
      subscription.type.toLowerCase().includes(searchTermLower)
    );
  });

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const getStatusBadge = (subscription: Subscription) => {
    const now = new Date();
    const isActive = subscription.isActive && subscription.endDate > now;

    if (isActive) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          {isRTL ? "نشط" : "Actif"}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          {isRTL ? "منتهي الصلاحية" : "Expiré"}
        </span>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {isRTL ? "إدارة الاشتراكات" : "Gestion des abonnements"}
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? "بحث..." : "Rechercher..."}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          {isRTL ? "جاري التحميل..." : "Chargement..."}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isRTL ? "المعرف" : "ID"}</TableHead>
              <TableHead>{isRTL ? "المستخدم" : "Utilisateur"}</TableHead>
              <TableHead>{isRTL ? "النوع" : "Type"}</TableHead>
              <TableHead>{isRTL ? "تاريخ البدء" : "Date de début"}</TableHead>
              <TableHead>{isRTL ? "تاريخ الانتهاء" : "Date de fin"}</TableHead>
              <TableHead>{isRTL ? "الحالة" : "Statut"}</TableHead>
              <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {isRTL
                    ? "لا توجد اشتراكات متطابقة مع البحث"
                    : "Aucun abonnement ne correspond à votre recherche"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>{subscription.id}</TableCell>
                  <TableCell>{subscription.userId}</TableCell>
                  <TableCell>
                    {subscription.type === "premium"
                      ? isRTL
                        ? "مميز"
                        : "Premium"
                      : isRTL
                        ? "مجاني"
                        : "Gratuit"}
                  </TableCell>
                  <TableCell>{formatDate(subscription.startDate)}</TableCell>
                  <TableCell>{formatDate(subscription.endDate)}</TableCell>
                  <TableCell>{getStatusBadge(subscription)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {isRTL ? "عرض" : "Voir"}
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleRenewSubscription(subscription.id)}
                        disabled={renewingId === subscription.id}
                      >
                        {renewingId === subscription.id
                          ? isRTL
                            ? "جاري التجديد..."
                            : "Renouvellement..."
                          : isRTL
                            ? "تجديد"
                            : "Renouveler"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SubscriptionList;
