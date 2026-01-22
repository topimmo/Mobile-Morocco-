import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/services/authService";
import { ImporterProfile } from "@/models/User";
import { mockProfiles, mockStores } from "@/services/mockDataService";
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
import {
  BarChart,
  Store,
  Package,
  TrendingUp,
  AlertCircle,
  Smartphone,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ImporterDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ImporterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { profile, error } = await getUserProfile();

      if (error || !profile) {
        setError("Mode démonstration: connectez-vous pour accéder à toutes les fonctionnalités.");
        // Use mock data for demo
        setProfile(mockProfiles.importer as ImporterProfile);
        setStores(mockStores);
        setLoading(false);
        return;
      }

      if (profile.userType !== "importer") {
        setError("Accès refusé. Cette page est réservée aux importateurs.");
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(profile as ImporterProfile);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Demo fallback profile when user is not authenticated/authorized
  const demoProfile: ImporterProfile = mockProfiles.importer as ImporterProfile;

  const isDemo = !!error;
  const effectiveProfile = profile || demoProfile;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau Importateur</h1>
            <p className="text-gray-500">
              {isDemo ? "Mode démo (lecture seule)" : `Bienvenue, ${effectiveProfile.firstName || "Utilisateur"}`} 
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/publish-phone">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                نشر تلفوني
              </Button>
            </Link>
            <Button onClick={() => navigate("/")} variant="outline">
              Accueil
            </Button>
            {isDemo ? (
              <Button onClick={() => navigate("/login")}>Se connecter</Button>
            ) : null}
          </div>
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Magasins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Store className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{stores.length || effectiveProfile.storeIds?.length || 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{stores.reduce((acc, store) => acc + (store.productCount || 0), 0)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ventes mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">45,600 MAD</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Abonnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold capitalize">{effectiveProfile.subscriptionTier || "Free"}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stores">Magasins</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="stores" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des magasins</CardTitle>
                <CardDescription>
                  {isDemo
                    ? "Aperçu en lecture seule. Connectez-vous pour créer et gérer vos magasins."
                    : "Créez et gérez vos magasins ici. Ajoutez, modifiez ou supprimez des magasins."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map((store, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{store.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{store.description}</p>
                          <p className="mt-2">Ville: {store.city}</p>
                          <p>Produits: {store.productCount}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" disabled={isDemo}>
                            Gérer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Store className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Aucun magasin</h3>
                    <p className="mt-1 text-gray-500">
                      {isDemo
                        ? "Connectez-vous pour créer votre premier magasin."
                        : "Commencez par créer un nouveau magasin."}
                    </p>
                    <div className="mt-6">
                      <Button disabled={isDemo}>Créer un magasin</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des produits</CardTitle>
                <CardDescription>
                  {isDemo
                    ? "Aperçu en lecture seule. Connectez-vous pour gérer votre inventaire."
                    : "Gérez votre inventaire, ajoutez des produits, mettez à jour les prix et suivez le stock."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Aucun produit</h3>
                  <p className="mt-1 text-gray-500">
                    {isDemo
                      ? "Connectez-vous pour ajouter vos produits."
                      : "Ajoutez des produits à votre inventaire pour commencer."}
                  </p>
                  <div className="mt-6">
                    <Button disabled={isDemo}>Ajouter un produit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse</CardTitle>
                <CardDescription>
                  {isDemo
                    ? "Aperçu des statistiques. Connectez-vous pour voir vos données."
                    : "Consultez les statistiques détaillées sur vos magasins et produits."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Bientôt disponible</h3>
                  <p className="mt-1 text-gray-500">
                    Cette fonctionnalité sera disponible dans une prochaine mise à jour.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}