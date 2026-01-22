import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Scale, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  city: { name: string } | null;
  neighborhood: { name: string } | null;
};

const conditionColors: Record<string, string> = {
  "new": "bg-success text-white",
  "like_new": "bg-orange text-white",
  "good": "bg-yellow text-dark-bg",
  "fair": "bg-text-secondary text-dark-bg",
  "used": "bg-text-secondary text-dark-bg",
};

const conditionLabels: Record<string, string> = {
  "new": "New",
  "like_new": "Like New",
  "good": "Good",
  "fair": "Fair",
  "used": "Used",
};

export default function LatestProductsDark() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title,
          price,
          images,
          condition,
          city:cities(name),
          neighborhood:neighborhoods(name)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-dark-secondary py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-secondary py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-syne font-extrabold text-white">
            Latest Products
          </h2>
          <Link 
            to="/category/smartphones" 
            className="text-orange font-grotesk font-medium hover:underline"
          >
            View All →
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary font-grotesk">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const location = [product.city?.name, product.neighborhood?.name].filter(Boolean).join(", ");
              const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80";
              
              return (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-orange transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-3 right-3 ${conditionColors[product.condition] || "bg-text-secondary text-dark-bg"} border-0 font-grotesk font-medium text-xs`}>
                        {conditionLabels[product.condition] || product.condition}
                      </Badge>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-dark-bg/80 hover:bg-orange flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Scale className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-grotesk font-medium mb-2 line-clamp-2 min-h-[3rem] text-white group-hover:text-orange transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xl font-mono font-bold text-orange">
                          {product.price.toLocaleString()} MAD
                        </p>
                      </div>

                      <div className="flex items-center text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-grotesk truncate">{location || "Morocco"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <Link 
            to="/category/smartphones"
            className="inline-block px-8 py-4 text-lg font-syne font-bold rounded-xl bg-dark-card border-2 border-dark-border text-white hover:bg-orange hover:border-orange transition-all duration-300 hover:-translate-y-1"
          >
            Load More Products
          </Link>
        </div>
      </div>
    </div>
  );
}
