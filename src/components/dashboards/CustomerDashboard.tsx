import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/services/authService";
import { CustomerProfile } from "@/models/User";
import { mockProfiles } from "@/services/mockDataService";
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
import { ShoppingBag, Heart, Search, Ticket, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { profile, error } = await getUserProfile();

      if (error || !profile) {
        setError("Mode démonstration: connectez-vous pour accéder à toutes les fonctionnalités.");
        // Use mock data for demo
        setProfile(mockProfiles.customer as CustomerProfile);
        setLoading(false);
        return;
      }

      if (profile.userType !== "customer") {
        setError("Accès refusé. Cette page est réservée aux clients.");
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(profile as CustomerProfile);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Demo fallback profile when user is not authenticated/authorized
  const demoProfile: CustomerProfile = mockProfiles.customer as CustomerProfile;
  
  const isDemo = !!error;
  const effectiveProfile = profile || demoProfile;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Tableau Client</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {isDemo ? "Mode démo (lecture seule)" : `Bienvenue, ${effectiveProfile.firstName || "Utilisateur"}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/publish-phone">
              <Button className="bg-sky-600 hover:bg-sky-700">
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
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">
                  {effectiveProfile?.purchaseHistory?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Favoris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold">
                  {effectiveProfile?.favoriteProducts?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Recherches récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">
                  {effectiveProfile?.recentSearches?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets de support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Ticket className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">0</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
            <TabsTrigger value="orders" className="text-xs sm:text-sm">Mes commandes</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">Favoris</TabsTrigger>
            <TabsTrigger value="tickets" className="text-xs sm:text-sm">Support</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profil</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des commandes</CardTitle>
                <CardDescription>
                  Consultez vos commandes passées et suivez les commandes en cours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {effectiveProfile?.purchaseHistory?.length ? (
                  <div className="divide-y">
                    {effectiveProfile.purchaseHistory.map((purchase, index) => (
                      <div
                        key={index}
                        className="py-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">
                            ID Produit: {purchase.productId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{purchase.price} MAD</p>
                          <Button variant="link" size="sm" className="p-0" disabled={isDemo}>
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Aucune commande</h3>
                    <p className="mt-1 text-gray-500">
                      Vos achats apparaîtront ici.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => navigate("/products")}>
                        Parcourir les produits
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits favoris</CardTitle>
                <CardDescription>
                  Produits que vous avez ajoutés à vos favoris.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {effectiveProfile?.favoriteProducts?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {effectiveProfile.favoriteProducts.map((productId, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>Produit {productId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>iPhone 13 Pro - 128GB</p>
                          <p className="font-bold mt-2">8,500 MAD</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" disabled={isDemo}>
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" disabled={isDemo}>
                            <Heart className="h-4 w-4 text-red-500" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">
                      Aucun favori
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Ajoutez des produits à vos favoris pour y accéder facilement.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => navigate("/products")}>
                        Parcourir les produits
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tickets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets de support</CardTitle>
                <CardDescription>
                  Consultez et gérez vos demandes de support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">
                    Aucun ticket de support
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Besoin d'aide ? Créez un ticket de support et notre équipe vous assistera.
                  </p>
                  <div className="mt-6">
                    <Button disabled={isDemo}>Créer un ticket</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et préférences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom</p>
                      <p>
                        {effectiveProfile?.firstName} {effectiveProfile?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{effectiveProfile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p>{effectiveProfile?.phoneNumber || "Non renseigné"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Localisation
                      </p>
                      <p>
                        {effectiveProfile?.city || "Non renseigné"},{" "}
                        {effectiveProfile?.country || "Maroc"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Préférences de notification
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          effectiveProfile?.notificationPreferences.email
                            ? "default"
                            : "outline"
                        }
                      >
                        Email{" "}
                        {effectiveProfile?.notificationPreferences.email ? "Activé" : "Désactivé"}
                      </Badge>
                      <Badge
                        variant={
                          effectiveProfile?.notificationPreferences.inApp
                            ? "default"
                            : "outline"
                        }
                      >
                        In-App{" "}
                        {effectiveProfile?.notificationPreferences.inApp ? "Activé" : "Désactivé"}
                      </Badge>
                      <Badge
                        variant={
                          effectiveProfile?.notificationPreferences.whatsapp
                            ? "default"
                            : "outline"
                        }
                      >
                        WhatsApp{" "}
                        {effectiveProfile?.notificationPreferences.whatsapp
                          ? "Activé"
                          : "Désactivé"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button disabled={isDemo}>Modifier le profil</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}