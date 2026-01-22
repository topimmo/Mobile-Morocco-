import { useState } from "react";
import { X, Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/marketplace";
import { Link } from "react-router-dom";

interface ComparePhonesProps {
  initialProducts?: Product[];
}

// Mock products for comparison
const availableProducts: Product[] = [
  {
    id: "1",
    user_id: "1",
    category_id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 14999,
    condition: "new",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    ram: "8GB",
    specifications: {
      display: "6.7\" Super Retina XDR",
      processor: "A17 Pro",
      camera: "48MP + 12MP + 12MP",
      battery: "4422 mAh",
      os: "iOS 17",
    },
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80"],
    views: 500,
    status: "approved",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "2",
    category_id: "1",
    title: "Samsung Galaxy S24 Ultra 512GB",
    price: 12999,
    condition: "new",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    storage: "512GB",
    ram: "12GB",
    specifications: {
      display: "6.8\" Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3",
      camera: "200MP + 12MP + 50MP + 10MP",
      battery: "5000 mAh",
      os: "Android 14",
    },
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"],
    views: 450,
    status: "approved",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "3",
    category_id: "1",
    title: "Google Pixel 8 Pro 256GB",
    price: 8900,
    condition: "like_new",
    brand: "Google",
    model: "Pixel 8 Pro",
    storage: "256GB",
    ram: "12GB",
    specifications: {
      display: "6.7\" LTPO OLED",
      processor: "Google Tensor G3",
      camera: "50MP + 48MP + 48MP",
      battery: "5050 mAh",
      os: "Android 14",
    },
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80"],
    views: 320,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "4",
    category_id: "1",
    title: "OnePlus 12 256GB",
    price: 7500,
    condition: "new",
    brand: "OnePlus",
    model: "OnePlus 12",
    storage: "256GB",
    ram: "16GB",
    specifications: {
      display: "6.82\" LTPO AMOLED",
      processor: "Snapdragon 8 Gen 3",
      camera: "50MP + 48MP + 64MP",
      battery: "5400 mAh",
      os: "Android 14",
    },
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80"],
    views: 280,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const conditionLabels: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
  used: "Used",
};

export default function ComparePhones({ initialProducts = [] }: ComparePhonesProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialProducts);
  const [showSelector, setShowSelector] = useState(false);

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 3 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const specKeys = ["display", "processor", "camera", "battery", "os"];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-orange" />
            <h1 className="text-4xl md:text-5xl font-syne font-extrabold">
              Compare Phones
            </h1>
          </div>
          <p className="text-text-secondary font-grotesk text-lg">
            Compare up to 3 smartphones side by side to find the best one for you.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Product Slots */}
          {[0, 1, 2].map((index) => {
            const product = selectedProducts[index];
            
            if (product) {
              return (
                <div key={product.id} className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-dark-bg/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <Badge className="absolute top-3 left-3 bg-orange text-white border-0">
                      {conditionLabels[product.condition]}
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-syne font-bold text-lg mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-mono font-bold text-orange">
                      {product.price.toLocaleString()} MAD
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => setShowSelector(true)}
                className="aspect-square bg-dark-card rounded-2xl border-2 border-dashed border-dark-border hover:border-orange transition-colors flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-dark-secondary flex items-center justify-center">
                  <Plus className="w-8 h-8 text-text-secondary" />
                </div>
                <span className="text-text-secondary font-grotesk">Add Phone</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedProducts.length >= 2 && (
          <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="p-4 text-left font-syne font-bold text-text-secondary">Specification</th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="p-4 text-left font-syne font-bold">
                      {product.brand}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-dark-border bg-dark-secondary/50">
                  <td className="p-4 font-grotesk font-medium">Price</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 font-mono font-bold text-orange">
                      {product.price.toLocaleString()} MAD
                    </td>
                  ))}
                </tr>

                {/* Condition Row */}
                <tr className="border-b border-dark-border">
                  <td className="p-4 font-grotesk font-medium">Condition</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <Badge className={`${
                        product.condition === "new" ? "bg-success" : "bg-orange"
                      } text-white border-0`}>
                        {conditionLabels[product.condition]}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Storage Row */}
                <tr className="border-b border-dark-border bg-dark-secondary/50">
                  <td className="p-4 font-grotesk font-medium">Storage</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 font-grotesk">
                      {product.storage || "-"}
                    </td>
                  ))}
                </tr>

                {/* RAM Row */}
                <tr className="border-b border-dark-border">
                  <td className="p-4 font-grotesk font-medium">RAM</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 font-grotesk">
                      {product.ram || "-"}
                    </td>
                  ))}
                </tr>

                {/* Specification Rows */}
                {specKeys.map((key, idx) => (
                  <tr key={key} className={`border-b border-dark-border ${idx % 2 === 0 ? "bg-dark-secondary/50" : ""}`}>
                    <td className="p-4 font-grotesk font-medium capitalize">{key}</td>
                    {selectedProducts.map((product) => (
                      <td key={product.id} className="p-4 font-grotesk text-sm">
                        {product.specifications?.[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedProducts.length < 2 && (
          <div className="text-center py-12 bg-dark-card rounded-2xl border border-dark-border">
            <p className="text-text-secondary font-grotesk text-lg">
              Select at least 2 phones to compare their specifications.
            </p>
          </div>
        )}

        {/* Product Selector Modal */}
        {showSelector && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-card rounded-2xl border border-dark-border max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-dark-border flex items-center justify-between">
                <h2 className="text-xl font-syne font-bold">Select a Phone</h2>
                <button
                  onClick={() => setShowSelector(false)}
                  className="w-8 h-8 rounded-full hover:bg-dark-secondary flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableProducts
                    .filter(p => !selectedProducts.find(sp => sp.id === p.id))
                    .map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="flex gap-4 p-4 bg-dark-secondary rounded-xl hover:bg-dark-border transition-colors text-left"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-grotesk font-medium line-clamp-2 mb-1">
                            {product.title}
                          </h3>
                          <p className="text-orange font-mono font-bold">
                            {product.price.toLocaleString()} MAD
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
