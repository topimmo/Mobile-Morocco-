import { Search } from "lucide-react";
import { useState } from "react";

const cities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kenitra", "Tétouan"
];

const neighborhoods: Record<string, string[]> = {
  "Casablanca": ["Maarif", "Anfa", "Ain Diab", "Hay Hassani", "Sidi Moumen"],
  "Rabat": ["Agdal", "Hassan", "Hay Riad", "Souissi", "Océan"],
  "Marrakech": ["Guéliz", "Hivernage", "Médina", "Palmeraie", "Targa"],
  "Fès": ["Ville Nouvelle", "Médina", "Zouagha", "Saiss", "Atlas"],
  "Tanger": ["Malabata", "Centre Ville", "Médina", "Boubana", "Mesnana"],
};

const categories = ["Smartphones", "Computers", "Accessories", "Spare Parts", "Repair Shops"];

export default function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="space-y-8">
        {/* Main Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن هاتفك / Trouvez votre téléphone"
            className="w-full h-14 md:h-16 px-6 pr-14 text-lg md:text-xl font-syne font-extrabold border-[3px] border-black bg-white focus:border-terracotta focus:outline-none transition-colors"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-charcoal" />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Dropdown */}
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedNeighborhood("");
            }}
            className="h-12 px-4 text-base font-grotesk font-medium border-[3px] border-black bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Select City / اختر المدينة</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Neighborhood Dropdown */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            disabled={!selectedCity}
            className="h-12 px-4 text-base font-grotesk font-medium border-[3px] border-black bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Neighborhood / الحي</option>
            {selectedCity && neighborhoods[selectedCity]?.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-12 px-4 text-base font-grotesk font-medium border-[3px] border-black bg-white focus:border-terracotta focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">Category / الفئة</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 text-sm font-grotesk font-medium border-[3px] border-black transition-all hover:scale-105 ${
                selectedCategory === category
                  ? "bg-terracotta text-white"
                  : "bg-white text-charcoal hover:bg-lime"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
