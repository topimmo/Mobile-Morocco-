import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/services/authService";
import { TechnicianProfile } from "@/models/User";
import { mockProfiles, mockServiceRequests } from "@/services/mockDataService";
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
  Calendar,
  Star,
  Wrench,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateRepairShopForm } from "@/components/CreateRepairShopForm";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [showCreateShopDialog, setShowCreateShopDialog] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { profile, error } = await getUserProfile();

      if (error || !profile) {
        setError("Mode démonstration: connectez-vous pour accéder à toutes les fonctionnalités.");
        // Use mock data for demo
        setProfile(mockProfiles.technician as TechnicianProfile);
        setServiceRequests(mockServiceRequests);
        setLoading(false);
        return;
      }

      if (profile.userType !== "technician") {
        setError("Accès refusé. Cette page est réservée aux techniciens.");
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(profile as TechnicianProfile);
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
  const demoProfile: TechnicianProfile = mockProfiles.technician as TechnicianProfile;

  const isDemo = !!error;
  const effectiveProfile = profile || demoProfile;

  // Count service requests by status
  const completedJobs = serviceRequests.filter(req => req.status === 'completed').length;
  const pendingJobs = serviceRequests.filter(req => req.status === 'pending' || req.status === 'accepted').length;
  const uniqueCustomers = [...new Set(serviceRequests.map(req => req.customerName))].length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Tableau Technicien</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {isDemo ? "Mode démo (lecture seule)" : `Bienvenue, ${effectiveProfile.firstName || "Utilisateur"}`} 
            </p>
          </div>
          <div className="flex gap-2">
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
              <CardTitle className="text-sm font-medium">Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold">
                  {effectiveProfile?.rating || "N/A"}
                </div>
                {effectiveProfile?.reviewCount && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({effectiveProfile.reviewCount} avis)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Jobs terminés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wrench className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{completedJobs}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Jobs en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{pendingJobs}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <div className="text-2xl font-bold">{uniqueCustomers}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
            <TabsTrigger value="jobs" className="text-xs sm:text-sm">Demandes</TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm">Mes services</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Planning</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Demandes de réparation</CardTitle>
                <CardDescription>
                  Consultez et gérez les demandes entrantes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serviceRequests.length > 0 ? (
                  <div className="divide-y">
                    {serviceRequests.map((request, index) => (
                      <div key={index} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{request.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {request.service} - {request.device}
                          </p>
                          <p className="text-xs text-gray-400">{request.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              request.status === 'completed' 
                                ? 'default' 
                                : request.status === 'pending' 
                                  ? 'outline' 
                                  : 'secondary'
                            }
                          >
                            {request.status === 'completed' 
                              ? 'Terminé' 
                              : request.status === 'pending' 
                                ? 'En attente' 
                                : 'Accepté'}
                          </Badge>
                          {request.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isDemo}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isDemo}>
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Aucune demande</h3>
                    <p className="mt-1 text-gray-500">
                      Vous n'avez aucune demande en attente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes services</CardTitle>
                <CardDescription>
                  Gérez les services que vous offrez.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {effectiveProfile?.servicesOffered?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {effectiveProfile.servicesOffered.map((service, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{service}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Tarif: Contactez pour le prix</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" disabled={isDemo}>
                            Modifier
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Aucun service</h3>
                    <p className="mt-1 text-gray-500">
                      Ajoutez vos services pour attirer des clients.
                    </p>
                    <div className="mt-6">
                      <Button disabled={isDemo}>Ajouter un service</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon planning</CardTitle>
                <CardDescription>
                  Gérez votre disponibilité et vos horaires.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-2 text-center min-w-[600px]">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => {
                      const dayKey = day.toLowerCase() as keyof NonNullable<
                        typeof effectiveProfile
                      >["availability"];
                    const isAvailable = effectiveProfile?.availability?.[dayKey];

                    return (
                      <div key={index} className="p-2">
                        <p className="text-sm font-medium mb-2">{day}</p>
                        <Badge
                          variant={isAvailable ? "default" : "outline"}
                          className="w-full"
                        >
                          {isAvailable ? "Disponible" : "Indisponible"}
                        </Badge>
                      </div>
                    );
                  })}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <Button disabled={isDemo}>Mettre à jour</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ma boutique de réparation</CardTitle>
              <CardDescription>
                Créez votre boutique pour que les clients vous trouvent facilement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">Pas de boutique créée</h3>
                <p className="mt-1 text-gray-500">
                  Créez votre boutique pour augmenter votre visibilité.
                </p>
                <Dialog open={showCreateShopDialog} onOpenChange={setShowCreateShopDialog}>
                  <DialogTrigger asChild>
                    <Button className="mt-4" disabled={isDemo}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une boutique
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Créer une boutique de réparation</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations de votre boutique pour être visible sur la plateforme.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateRepairShopForm
                      onSuccess={(shopId) => {
                        setShowCreateShopDialog(false);
                      }}
                      onCancel={() => setShowCreateShopDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mes spécialités</CardTitle>
              <CardDescription>
                Domaines dans lesquels vous êtes spécialisé.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {effectiveProfile?.specialties?.length ? (
                <div className="flex flex-wrap gap-2">
                  {effectiveProfile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Aucune spécialité ajoutée.</p>
                  <Button variant="outline" className="mt-2" disabled={isDemo}>
                    Ajouter des spécialités
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}