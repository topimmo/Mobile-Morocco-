import { Search, MapPin, Grid3X3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type City = {
  id: string;
  name: string;
  slug: string;
};

type Neighborhood = {
  id: string;
  name: string;
  slug: string;
  city_id: string;
};

type Category = {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
};

type Stats = {
  listings: number;
  users: number;
  repairShops: number;
  cities: number;
};

export default function HeroSearchDark() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({ listings: 0, users: 0, repairShops: 0, cities: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [citiesRes, categoriesRes, productsCount, usersCount, shopsCount] = await Promise.all([
        supabase.from("cities").select("id, name, slug").order("name"),
        supabase.from("categories").select("id, name, name_ar, slug").neq("slug", "repair-shops").order("name"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("repair_shops").select("id", { count: "exact", head: true }).eq("status", "approved"),
      ]);

      setCities(citiesRes.data || []);
      setCategories(categoriesRes.data || []);
      setStats({
        listings: productsCount.count || 0,
        users: usersCount.count || 0,
        repairShops: shopsCount.count || 0,
        cities: citiesRes.data?.length || 0,
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const fetchNeighborhoods = async () => {
        const { data } = await supabase
          .from("neighborhoods")
          .select("id, name, slug, city_id")
          .eq("city_id", selectedCity)
          .order("name");
        setNeighborhoods(data || []);
      };
      fetchNeighborhoods();
    } else {
      setNeighborhoods([]);
    }
  }, [selectedCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      navigate(`/category/${selectedCategory}`);
    }
  };

  return (
    <div className="w-full bg-dark-bg py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-syne font-extrabold text-white mb-4">
            Find Your Next
            <span className="text-orange"> Device</span>
          </h1>
          <p className="text-text-secondary font-grotesk text-lg md:text-xl max-w-2xl mx-auto">
            Morocco's premier marketplace for smartphones, computers, and repair services.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن هاتفك / Trouvez votre téléphone"
              className="w-full h-16 md:h-20 pl-14 pr-6 text-lg md:text-xl font-syne font-bold bg-dark-card border-2 border-dark-border rounded-2xl text-white placeholder:text-text-secondary focus:border-orange focus:outline-none transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Dropdown */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedNeighborhood("");
                }}
                className="w-full h-14 pl-12 pr-4 text-base font-grotesk font-medium bg-dark-card border-2 border-dark-border rounded-xl text-white focus:border-orange focus:outline-none transition-colors cursor-pointer appearance-none"
              >
                <option value="">Select City / اختر المدينة</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Neighborhood Dropdown */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                disabled={!selectedCity}
                className="w-full h-14 pl-12 pr-4 text-base font-grotesk font-medium bg-dark-card border-2 border-dark-border rounded-xl text-white focus:border-orange focus:outline-none transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Neighborhood / الحي</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <Grid3X3 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base font-grotesk font-medium bg-dark-card border-2 border-dark-border rounded-xl text-white focus:border-orange focus:outline-none transition-colors cursor-pointer appearance-none"
              >
                <option value="">Category / الفئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/category/${category.slug}`)}
                className={`px-6 py-3 text-sm font-grotesk font-medium rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedCategory === category.slug
                    ? "bg-orange border-orange text-white"
                    : "bg-dark-card border-dark-border text-white hover:border-orange"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </form>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">{stats.listings.toLocaleString()}</p>
            <p className="text-text-secondary font-grotesk text-sm">Active Listings</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">{stats.users.toLocaleString()}</p>
            <p className="text-text-secondary font-grotesk text-sm">Happy Users</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">{stats.repairShops.toLocaleString()}</p>
            <p className="text-text-secondary font-grotesk text-sm">Repair Shops</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">{stats.cities}</p>
            <p className="text-text-secondary font-grotesk text-sm">Cities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
