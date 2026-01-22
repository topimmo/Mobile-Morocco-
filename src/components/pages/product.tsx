import { useParams } from "react-router-dom";
import StickyNav from "@/components/marketplace/StickyNav";
import Footer from "@/components/marketplace/Footer";
import ProductDetail from "@/components/marketplace/ProductDetail";
import { Product } from "@/types/marketplace";

// Mock product data
const mockProduct: Product = {
  id: "1",
  user_id: "1",
  category_id: "1",
  title: "iPhone 14 Pro 256GB - Deep Purple - Excellent Condition",
  description: `This iPhone 14 Pro is in excellent condition with minimal signs of use. 

Features:
- 256GB Storage
- Deep Purple Color
- A16 Bionic Chip
- 48MP Camera System
- Dynamic Island
- Always-On Display

Includes:
- Original box
- Charging cable
- Original documentation

Battery health: 94%
No scratches on screen or body.
Face ID works perfectly.

Reason for selling: Upgrading to iPhone 15 Pro Max.`,
  price: 9500,
  condition: "like_new",
  brand: "Apple",
  model: "iPhone 14 Pro",
  storage: "256GB",
  ram: "6GB",
  specifications: {
    display: "6.1\" Super Retina XDR",
    processor: "A16 Bionic",
    camera: "48MP + 12MP + 12MP",
    battery: "3200 mAh",
    os: "iOS 17",
    color: "Deep Purple",
  },
  images: [
    "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&q=80",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
  ],
  city: { id: "1", name: "Casablanca", slug: "casablanca" },
  neighborhood: { id: "1", city_id: "1", name: "Maarif", slug: "maarif" },
  views: 245,
  status: "approved",
  is_featured: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: { id: "1", name: "Smartphones", slug: "smartphones" },
  seller: {
    id: "1",
    name: "Ahmed M.",
    email: "ahmed@example.com",
  },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  // In a real app, fetch product by ID
  const product = mockProduct;

  return (
    <div className="min-h-screen bg-dark-bg">
      <StickyNav variant="dark" />
      <main className="pt-16">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  );
}
