import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  TrendingUp,
  AlertCircle,
  Eye,
  MousePointer,
  Plus,
} from "lucide-react";
import {
  getAllAds,
  getAdStats,
  Advertisement,
  activateAd,
  deactivateAd,
} from "@/services/adService";
import AddAdForm, { AdFormData } from "@/components/admin/AddAdForm";
import { useToast } from "@/components/ui/use-toast";

export default function AdvertiserDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdStats>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adsData, statsData] = await Promise.all([
        getAllAds(),
        getAdStats(),
      ]);
      setAds(adsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAd = async (_adData: AdFormData) => {
    toast({
      title: "Publicité créée",
      description: "Votre publicité a été créée avec succès. En attente de paiement.",
    });
    setShowAddForm(false);
    loadData();
  };

  const handleToggleAd = async (adId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateAd(adId);
        toast({
          title: "Publicité désactivée",
          description: "La publicité a été désactivée avec succès.",
        });
      } else {
        await activateAd(adId);
        toast({
          title: "Publicité activée",
          description: "La publicité a été activée avec succès.",
        });
      }
      loadData();
    } catch (_error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setShowAddForm(false)}
            className="mb-4"
          >
            ← Retour
          </Button>
          <AddAdForm
            onSubmit={handleAddAd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Tableau de Bord Publicitaire</h1>
            <p className="text-gray-500 text-sm sm:text-base">Gérez vos campagnes publicitaires</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/")} variant="outline">
              Accueil
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Publicité
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Publicités Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{stats?.active || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Eye className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">
                  {stats?.impressions?.toLocaleString() || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MousePointer className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">
                  {stats?.clicks?.toLocaleString() || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de Clic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">
                  {stats?.ctr?.toFixed(2) || 0}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ads List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm">Toutes</TabsTrigger>
            <TabsTrigger value="active" className="text-xs sm:text-sm">Actives</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">En Attente</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {ads.map((ad) => (
                <Card key={ad.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{ad.title}</CardTitle>
                        <CardDescription>
                          Position: {ad.position} | Du{" "}
                          {new Date(ad.startDate).toLocaleDateString()} au{" "}
                          {new Date(ad.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={ad.isActive ? "default" : "secondary"}
                        >
                          {ad.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge
                          variant={
                            ad.paymentStatus === "confirmed"
                              ? "default"
                              : ad.paymentStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {ad.paymentStatus === "confirmed"
                            ? "Payé"
                            : ad.paymentStatus === "pending"
                            ? "En attente"
                            : "Échoué"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Impressions</p>
                        <p className="text-lg font-semibold">
                          {ad.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Clics</p>
                        <p className="text-lg font-semibold">
                          {ad.clicks.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CTR</p>
                        <p className="text-lg font-semibold">
                          {ad.impressions > 0
                            ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAd(ad.id, ad.isActive)}
                    >
                      {ad.isActive ? "Désactiver" : "Activer"}
                    </Button>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {ads
                .filter((ad) => ad.isActive)
                .map((ad) => (
                  <Card key={ad.id}>
                    <CardHeader>
                      <CardTitle>{ad.title}</CardTitle>
                      <CardDescription>
                        Position: {ad.position}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Impressions</p>
                          <p className="text-lg font-semibold">
                            {ad.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Clics</p>
                          <p className="text-lg font-semibold">
                            {ad.clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CTR</p>
                          <p className="text-lg font-semibold">
                            {ad.impressions > 0
                              ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
                              : 0}
                            %
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {ads
                .filter((ad) => ad.paymentStatus === "pending")
                .map((ad) => (
                  <Card key={ad.id}>
                    <CardHeader>
                      <CardTitle>{ad.title}</CardTitle>
                      <CardDescription>
                        En attente de paiement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Paiement requis</AlertTitle>
                        <AlertDescription>
                          Veuillez effectuer le paiement pour activer cette
                          publicité.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    <CardFooter>
                      <Button>Effectuer le Paiement</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
