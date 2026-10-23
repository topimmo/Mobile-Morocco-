import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import ProductComparison from '@/components/ProductComparison';

export function ComparisonPage() {
  return (
    <>
      <SEO
        title="Comparer les produits - Mobile Morocco"
        description="Comparez jusqu'à 3 produits côte à côte pour faire le meilleur choix"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Comparaison de produits</h1>
            <p className="text-muted-foreground mt-2">
              Comparez jusqu'à 3 produits côte à côte
            </p>
          </div>
          <ProductComparison />
        </div>
        <Footer />
      </div>
    </>
  );
}
