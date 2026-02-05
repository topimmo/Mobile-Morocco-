import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyStorePage() {
  const navigateTo = useNavigate();
  
  useEffect(() => {
    // Redirect to the comprehensive listings manager instead of showing placeholder
    navigateTo("/dashboard/my-listings", { replace: true });
  }, [navigateTo]);

  return null;
}
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Mes Produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun produit pour le moment
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par ajouter votre premier produit à votre boutique.
                  </p>
                  <Link to="/dashboard/create-item">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="store-info">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la Boutique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configurez les informations de votre boutique pour qu'elle apparaisse dans les résultats de recherche.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gérez les paramètres de votre boutique.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
