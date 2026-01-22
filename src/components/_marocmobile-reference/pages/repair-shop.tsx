import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Phone, MessageCircle, ExternalLink, Mail, Star, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StickyNav from "@/components/marketplace/StickyNav";
import Footer from "@/components/marketplace/Footer";
import { RepairShop, WorkingHours } from "@/types/marketplace";

// Mock repair shop data
const mockShop: RepairShop = {
  id: "1",
  user_id: "1",
  name: "TechFix Casablanca",
  name_ar: "تيك فيكس الدار البيضاء",
  description: `TechFix Casablanca is your trusted destination for professional smartphone and computer repair services. With over 10 years of experience, our certified technicians provide fast, reliable repairs using only high-quality parts.

Our Services:
• Screen Replacement (iPhone, Samsung, Huawei, etc.)
• Battery Replacement
• Charging Port Repair
• Water Damage Recovery
• Software Issues & Updates
• Data Recovery
• Laptop Repair & Upgrades

Why Choose Us:
✓ Same-day repairs for most issues
✓ 90-day warranty on all repairs
✓ Genuine and high-quality parts
✓ Transparent pricing
✓ Free diagnostic

We speak Arabic, French, and English.`,
  services: ["Screen Repair", "Battery Replacement", "Software Fix", "Water Damage", "Data Recovery", "Laptop Repair"],
  city: { id: "1", name: "Casablanca", slug: "casablanca" },
  neighborhood: { id: "1", city_id: "1", name: "Maarif", slug: "maarif" },
  address: "123 Boulevard Zerktouni, Maarif, Casablanca",
  phone: "+212 522 123 456",
  whatsapp: "+212 622 123 456",
  email: "contact@techfix-casa.ma",
  google_maps_url: "https://maps.google.com/?q=33.5731,-7.5898",
  latitude: 33.5731,
  longitude: -7.5898,
  working_hours: {
    monday: { open: "09:00", close: "19:00" },
    tuesday: { open: "09:00", close: "19:00" },
    wednesday: { open: "09:00", close: "19:00" },
    thursday: { open: "09:00", close: "19:00" },
    friday: { open: "09:00", close: "12:00" },
    saturday: { open: "10:00", close: "18:00" },
  },
  images: [
    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80",
    "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  ],
  views: 1250,
  status: "approved",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function isShopOpen(workingHours?: WorkingHours): boolean {
  if (!workingHours) return false;
  
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[now.getDay()] as keyof WorkingHours;
  const todayHours = workingHours[currentDay];
  
  if (!todayHours) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  return currentTime >= openTime && currentTime <= closeTime;
}

export default function RepairShopPage() {
  const { id } = useParams<{ id: string }>();
  const shop = mockShop;
  const isOpen = isShopOpen(shop.working_hours);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayKeys: (keyof WorkingHours)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <StickyNav variant="dark" />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link to="/repair-shops" className="inline-flex items-center gap-2 text-text-secondary hover:text-orange mb-6 font-grotesk">
            <ChevronLeft className="w-5 h-5" />
            Back to Repair Shops
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                {/* Main Image */}
                <div className="aspect-video relative">
                  <img
                    src={shop.images?.[0]}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${
                      isOpen ? "bg-success" : "bg-dark-secondary"
                    } text-white border-0 font-grotesk font-medium text-sm px-4 py-1`}
                  >
                    {isOpen ? "Open Now" : "Closed"}
                  </Badge>
                </div>

                <div className="p-6">
                  <h1 className="text-3xl font-syne font-extrabold mb-2">{shop.name}</h1>
                  {shop.name_ar && (
                    <p className="text-text-secondary font-grotesk text-lg mb-4">{shop.name_ar}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-text-secondary">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-grotesk">
                        {shop.city?.name}{shop.neighborhood && `, ${shop.neighborhood.name}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow" />
                      <span className="font-grotesk">{shop.views} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                <h2 className="text-xl font-syne font-bold mb-4">Services</h2>
                <div className="flex flex-wrap gap-3">
                  {shop.services?.map((service, index) => (
                    <Badge 
                      key={index} 
                      className="bg-orange/20 text-orange border-0 font-grotesk px-4 py-2"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                <h2 className="text-xl font-syne font-bold mb-4">About</h2>
                <p className="font-grotesk text-text-secondary whitespace-pre-wrap">
                  {shop.description}
                </p>
              </div>

              {/* Gallery */}
              {shop.images && shop.images.length > 1 && (
                <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                  <h2 className="text-xl font-syne font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shop.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden">
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-dark-card rounded-2xl border border-dark-border p-6 sticky top-24">
                <h2 className="text-xl font-syne font-bold mb-4">Contact</h2>
                
                <div className="space-y-4 mb-6">
                  {shop.phone && (
                    <a 
                      href={`tel:${shop.phone}`}
                      className="flex items-center gap-3 p-3 bg-dark-secondary rounded-xl hover:bg-orange transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-grotesk">{shop.phone}</span>
                    </a>
                  )}
                  
                  {shop.whatsapp && (
                    <a 
                      href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-success/20 text-success rounded-xl hover:bg-success hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-grotesk">WhatsApp</span>
                    </a>
                  )}

                  {shop.email && (
                    <a 
                      href={`mailto:${shop.email}`}
                      className="flex items-center gap-3 p-3 bg-dark-secondary rounded-xl hover:bg-orange transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-grotesk text-sm">{shop.email}</span>
                    </a>
                  )}
                </div>

                {/* Address */}
                {shop.address && (
                  <div className="mb-6">
                    <h3 className="text-sm text-text-secondary mb-2 font-grotesk">Address</h3>
                    <p className="font-grotesk">{shop.address}</p>
                  </div>
                )}

                {/* Google Maps */}
                {shop.google_maps_url && (
                  <Button
                    asChild
                    className="w-full bg-orange hover:bg-orange/90 font-grotesk"
                  >
                    <a href={shop.google_maps_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                )}
              </div>

              {/* Working Hours */}
              <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                <h2 className="text-xl font-syne font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Working Hours
                </h2>
                
                <div className="space-y-3">
                  {dayNames.map((day, index) => {
                    const dayKey = dayKeys[index];
                    const hours = shop.working_hours?.[dayKey];
                    const isToday = new Date().getDay() === index;
                    
                    return (
                      <div 
                        key={day} 
                        className={`flex justify-between items-center py-2 ${
                          isToday ? "text-orange font-medium" : "text-text-secondary"
                        }`}
                      >
                        <span className="font-grotesk">{day}</span>
                        <span className="font-mono text-sm">
                          {hours ? `${hours.open} - ${hours.close}` : "Closed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
