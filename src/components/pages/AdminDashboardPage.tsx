import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import RealTimeStats from '@/components/admin/RealTimeStats';
import AdList from '@/components/admin/AdList';
import NeighborhoodList from '@/components/admin/NeighborhoodList';
import InfluencerList from '@/components/admin/InfluencerList';
import SubscriptionList from '@/components/admin/SubscriptionList';

export function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login', { state: { from: { pathname: '/admin' } } });
      } else if (user.profile?.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  const fetchNeighborhoods = async () => {
    // This would typically fetch from Supabase
    // For now, we'll use an empty array
    setNeighborhoods([]);
  };

  useEffect(() => {
    if (user?.profile?.role === 'admin') {
      fetchNeighborhoods();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.profile?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <SEO
        title="Admin Dashboard - Mobile Morocco"
        description="Panel d'administration Mobile Morocco"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
            <p className="text-muted-foreground mt-2">
              Gérez votre plateforme Mobile Morocco
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="ads">Publicités</TabsTrigger>
              <TabsTrigger value="neighborhoods">Quartiers</TabsTrigger>
              <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
              <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques en temps réel</CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeStats />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des publicités</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="neighborhoods">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des quartiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <NeighborhoodList 
                    neighborhoods={neighborhoods} 
                    onUpdate={fetchNeighborhoods}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="influencers">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des influenceurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfluencerList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des abonnements</CardTitle>
                </CardHeader>
                <CardContent>
                  <SubscriptionList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </>
  );
}
