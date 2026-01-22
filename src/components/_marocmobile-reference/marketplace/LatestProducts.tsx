import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2 } from "lucide-react";
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
  "new": "bg-lime text-black",
  "like_new": "bg-yellow text-black",
  "good": "bg-rose text-black",
  "fair": "bg-gray-300 text-black",
  "used": "bg-gray-300 text-black",
};

const conditionLabels: Record<string, string> = {
  "new": "New",
  "like_new": "Like New",
  "good": "Good",
  "fair": "Fair",
  "used": "Used",
};

export default function LatestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  const fetchProducts = async (pageNum: number) => {
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
      .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      if (pageNum === 0) {
        setProducts(data || []);
      } else {
        setProducts(prev => [...prev, ...(data || [])]);
      }
      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl md:text-5xl font-syne font-extrabold mb-8 text-left">
        Latest Products
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-grotesk">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const location = [product.city?.name, product.neighborhood?.name].filter(Boolean).join(", ");
            const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80";
            
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="border-[3px] border-black rounded-lg overflow-hidden bg-white hover:shadow-brutal transition-all duration-300 hover:-translate-y-2">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className={`absolute top-3 right-3 ${conditionColors[product.condition] || "bg-gray-300 text-black"} border-2 border-black font-grotesk font-medium text-xs`}>
                      {conditionLabels[product.condition] || product.condition}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-grotesk font-medium mb-2 line-clamp-2 min-h-[3rem] group-hover:text-terracotta transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xl font-mono font-bold text-terracotta">
                        {product.price.toLocaleString()} MAD
                      </p>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
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

      {hasMore && products.length > 0 && (
        <div className="mt-12 text-center">
          <button 
            onClick={loadMore}
            className="px-8 py-4 text-lg font-syne font-bold border-[3px] border-black bg-white hover:bg-lime hover:shadow-brutal transition-all duration-300 hover:-translate-y-1"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
