import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddAdForm, { AdFormData } from "./AddAdForm";

interface Ad {
  id: string;
  title: string;
  type: string;
  location: string;
  duration: string;
  status: "active" | "pending" | "expired" | "rejected";
  impressions?: number;
  clicks?: number;
  startDate?: string;
  endDate?: string;
}

interface AdListProps {
  isRTL?: boolean;
}

const AdList: React.FC<AdListProps> = ({ isRTL = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for ads
  const [ads, setAds] = useState<Ad[]>([
    {
      id: "AD001",
      title: "iPhone 13 Pro Max",
      type: "Banner",
      location: "Home Page",
      duration: "30 days",
      status: "active",
      impressions: 1245,
      clicks: 87,
      startDate: "2023-06-01",
      endDate: "2023-07-01",
    },
    {
      id: "AD002",
      title: "Samsung Galaxy S21",
      type: "Sidebar",
      location: "Category Page",
      duration: "15 days",
      status: "pending",
      impressions: 0,
      clicks: 0,
      startDate: "2023-06-15",
      endDate: "2023-06-30",
    },
    {
      id: "AD003",
      title: "AirPods Pro",
      type: "Medium Rectangle",
      location: "Product Page",
      duration: "7 days",
      status: "expired",
      impressions: 876,
      clicks: 32,
      startDate: "2023-05-20",
      endDate: "2023-05-27",
    },
  ]);

  const handleAddAd = (adData: AdFormData) => {
    const newAd: Ad = {
      id: `AD${String(ads.length + 1).padStart(3, "0")}`,
      title: adData.title,
      type: adData.type,
      location: adData.location,
      duration: `${adData.duration} days`,
      status: "pending",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(
        Date.now() + parseInt(adData.duration) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      impressions: 0,
      clicks: 0,
    };

    setAds([...ads, newAd]);
    setShowAddForm(false);
  };

  const getStatusClass = (status: Ad["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Ad["status"]) => {
    if (isRTL) {
      switch (status) {
        case "active":
          return "نشط";
        case "pending":
          return "قيد المراجعة";
        case "expired":
          return "منتهي الصلاحية";
        case "rejected":
          return "مرفوض";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "active":
          return "Actif";
        case "pending":
          return "En révision";
        case "expired":
          return "Expiré";
        case "rejected":
          return "Rejeté";
        default:
          return status;
      }
    }
  };

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (showAddForm) {
    return (
      <AddAdForm
        onSubmit={handleAddAd}
        onCancel={() => setShowAddForm(false)}
        isRTL={isRTL}
      />
    );
  }

  return (
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
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
              <TableHead>{isRTL ? "الموقع" : "Emplacement"}</TableHead>
              <TableHead>{isRTL ? "المدة" : "Durée"}</TableHead>
              <TableHead>{isRTL ? "المشاهدات" : "Impressions"}</TableHead>
              <TableHead>{isRTL ? "النقرات" : "Clics"}</TableHead>
              <TableHead>{isRTL ? "الحالة" : "Statut"}</TableHead>
              <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>{ad.id}</TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.type}</TableCell>
                <TableCell>{ad.location}</TableCell>
                <TableCell>{ad.duration}</TableCell>
                <TableCell>{ad.impressions}</TableCell>
                <TableCell>{ad.clicks}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 ${getStatusClass(ad.status)} rounded-full text-xs`}
                  >
                    {getStatusText(ad.status)}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdList;
