import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import RepairShopCard from "./RepairShopCard";
import { RepairShop } from "@/types/marketplace";

// Mock data for repair shops
const mockRepairShops: RepairShop[] = [
  {
    id: "1",
    user_id: "1",
    name: "TechFix Casablanca",
    name_ar: "تيك فيكس الدار البيضاء",
    description: "Professional smartphone and computer repair services. We specialize in screen replacements, battery changes, and software issues.",
    services: ["Screen Repair", "Battery Replacement", "Software Fix", "Water Damage"],
    city: { id: "1", name: "Casablanca", slug: "casablanca" },
    neighborhood: { id: "1", city_id: "1", name: "Maarif", slug: "maarif" },
    address: "123 Boulevard Zerktouni, Maarif",
    phone: "+212 522 123 456",
    whatsapp: "+212 622 123 456",
    google_maps_url: "https://maps.google.com/?q=33.5731,-7.5898",
    working_hours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "12:00" },
      saturday: { open: "10:00", close: "18:00" },
    },
    images: ["https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80"],
    views: 1250,
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "2",
    name: "Mobile Doctor Rabat",
    name_ar: "دكتور الموبايل الرباط",
    description: "Expert mobile phone repairs with same-day service. Original parts guaranteed.",
    services: ["iPhone Repair", "Samsung Repair", "Charging Port", "Camera Fix"],
    city: { id: "2", name: "Rabat", slug: "rabat" },
    neighborhood: { id: "2", city_id: "2", name: "Agdal", slug: "agdal" },
    address: "45 Avenue Fal Ould Oumeir, Agdal",
    phone: "+212 537 789 012",
    whatsapp: "+212 637 789 012",
    google_maps_url: "https://maps.google.com/?q=33.9911,-6.8498",
    working_hours: {
      monday: { open: "08:30", close: "20:00" },
      tuesday: { open: "08:30", close: "20:00" },
      wednesday: { open: "08:30", close: "20:00" },
      thursday: { open: "08:30", close: "20:00" },
      friday: { open: "14:00", close: "20:00" },
      saturday: { open: "09:00", close: "17:00" },
    },
    images: ["https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400&q=80"],
    views: 890,
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "3",
    name: "iRepair Marrakech",
    name_ar: "آي ريبير مراكش",
    description: "Apple certified repair center. MacBook, iPhone, iPad specialists.",
    services: ["MacBook Repair", "iPhone Screen", "iPad Repair", "Data Recovery"],
    city: { id: "3", name: "Marrakech", slug: "marrakech" },
    neighborhood: { id: "3", city_id: "3", name: "Guéliz", slug: "gueliz" },
    address: "78 Rue de la Liberté, Guéliz",
    phone: "+212 524 456 789",
    whatsapp: "+212 624 456 789",
    google_maps_url: "https://maps.google.com/?q=31.6295,-8.0084",
    working_hours: {
      monday: { open: "09:00", close: "18:30" },
      tuesday: { open: "09:00", close: "18:30" },
      wednesday: { open: "09:00", close: "18:30" },
      thursday: { open: "09:00", close: "18:30" },
      friday: { open: "09:00", close: "12:00" },
      saturday: { open: "10:00", close: "16:00" },
    },
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"],
    views: 2100,
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "4",
    name: "PhoneLab Tanger",
    name_ar: "فون لاب طنجة",
    description: "Fast and reliable phone repairs. All brands welcome.",
    services: ["Screen Repair", "Unlocking", "Software Update", "Accessories"],
    city: { id: "5", name: "Tanger", slug: "tanger" },
    neighborhood: { id: "5", city_id: "5", name: "Centre Ville", slug: "centre-ville" },
    address: "12 Boulevard Pasteur",
    phone: "+212 539 321 654",
    whatsapp: "+212 639 321 654",
    google_maps_url: "https://maps.google.com/?q=35.7595,-5.8340",
    working_hours: {
      monday: { open: "10:00", close: "19:00" },
      tuesday: { open: "10:00", close: "19:00" },
      wednesday: { open: "10:00", close: "19:00" },
      thursday: { open: "10:00", close: "19:00" },
      friday: { open: "10:00", close: "12:00" },
      saturday: { open: "10:00", close: "18:00" },
    },
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80"],
    views: 650,
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const cities = ["All Cities", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

export default function RepairShopsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const filteredShops = mockRepairShops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === "All Cities" || shop.city?.name === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-4">
            Repair Shops Directory
          </h1>
          <p className="text-text-secondary font-grotesk text-lg">
            Find trusted repair shops near you for smartphones, computers, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search shops or services..."
                className="w-full h-12 pl-12 pr-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk text-white placeholder:text-text-secondary"
              />
            </div>

            {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk text-white appearance-none cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Open Now Filter */}
            <Button
              variant={showOpenOnly ? "default" : "outline"}
              onClick={() => setShowOpenOnly(!showOpenOnly)}
              className={`h-12 rounded-xl font-grotesk ${
                showOpenOnly 
                  ? "bg-success hover:bg-success/90 text-white border-0" 
                  : "border-dark-border hover:bg-dark-secondary"
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Open Now Only
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-text-secondary font-grotesk mb-6">
          {filteredShops.length} repair shop{filteredShops.length !== 1 ? 's' : ''} found
        </p>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <RepairShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary font-grotesk text-lg">
              No repair shops found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
