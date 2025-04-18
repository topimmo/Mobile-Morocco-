import React, { useState, useEffect } from "react";
import { technicians, techniciensFr } from "@/data/technicians";
import TechnicianProfile from "./TechnicianProfile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Technician } from "@/types/technician";

interface TechnicianListingProps {
  language?: "ar" | "fr";
}

const TechnicianListing: React.FC<TechnicianListingProps> = ({
  language = "ar",
}) => {
  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const techData = language === "ar" ? technicians : techniciensFr;

  const [filteredTechnicians, setFilteredTechnicians] =
    useState<Technician[]>(techData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique cities and services for filter options
  const cities = [...new Set(techData.map((tech) => tech.city))];
  const services = [...new Set(techData.flatMap((tech) => tech.services))];

  useEffect(() => {
    let filtered = techData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tech) =>
          tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.services.some((service) =>
            service.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter((tech) => tech.city === selectedCity);
    }

    // Apply service filter
    if (selectedService) {
      filtered = filtered.filter((tech) =>
        tech.services.includes(selectedService),
      );
    }

    setFilteredTechnicians(filtered);
  }, [searchTerm, selectedCity, selectedService, techData]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedService("");
  };

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {isRTL ? "فنيو الصيانة" : "Techniciens de réparation"}
          </h1>
          <p className="mt-4 text-primary-foreground/80 md:text-xl">
            {isRTL
              ? "ابحث عن فنيي صيانة الهواتف المحترفين في منطقتك"
              : "Trouvez des techniciens de réparation de téléphones professionnels dans votre région"}
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-1/2 relative">
              <Label htmlFor="search">
                {isRTL ? "ابحث عن فني" : "Rechercher un technicien"}
              </Label>
              <div className="relative">
                <Input
                  id="search"
                  type="search"
                  placeholder={
                    isRTL
                      ? "اسم، مدينة، أو خدمة..."
                      : "Nom, ville ou service..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="md:self-end"
              onClick={toggleFilters}
            >
              <Filter className="h-4 w-4" />
            </Button>

            {searchTerm || selectedCity || selectedService ? (
              <Button
                variant="ghost"
                className="md:self-end"
                onClick={clearFilters}
              >
                {isRTL ? "مسح الفلاتر" : "Effacer les filtres"}
              </Button>
            ) : null}
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">{isRTL ? "المدينة" : "Ville"}</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger id="city">
                    <SelectValue
                      placeholder={
                        isRTL ? "اختر المدينة" : "Sélectionner une ville"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {isRTL ? "جميع المدن" : "Toutes les villes"}
                    </SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service">{isRTL ? "الخدمة" : "Service"}</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger id="service">
                    <SelectValue
                      placeholder={
                        isRTL ? "اختر الخدمة" : "Sélectionner un service"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {isRTL ? "جميع الخدمات" : "Tous les services"}
                    </SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Technician Listing */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          {filteredTechnicians.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {isRTL
                  ? "لا يوجد فنيين مطابقين للبحث"
                  : "Aucun technicien ne correspond à votre recherche"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTechnicians.map((technician) => (
                <TechnicianProfile
                  key={technician.id}
                  technician={technician}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TechnicianListing;
