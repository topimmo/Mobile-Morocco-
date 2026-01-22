import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { RepairShop, WorkingHours } from "@/types/marketplace";
import { Link } from "react-router-dom";

interface RepairShopCardProps {
  shop: RepairShop;
}

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

export default function RepairShopCard({ shop }: RepairShopCardProps) {
  const isOpen = isShopOpen(shop.working_hours);

  return (
    <Link to={`/repair-shop/${shop.id}`}>
      <div className="group bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-orange transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={shop.images?.[0] || "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80"}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge 
            className={`absolute top-3 right-3 ${
              isOpen 
                ? "bg-success text-white" 
                : "bg-dark-secondary text-text-secondary"
            } border-0 font-grotesk font-medium`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-syne font-bold text-white group-hover:text-orange transition-colors line-clamp-1">
            {shop.name}
          </h3>

          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-grotesk line-clamp-1">
              {shop.city?.name}{shop.neighborhood && `, ${shop.neighborhood.name}`}
            </span>
          </div>

          {shop.working_hours && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="font-grotesk">
                {(() => {
                  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  const today = days[new Date().getDay()] as keyof WorkingHours;
                  const todayHours = shop.working_hours?.[today];
                  return todayHours 
                    ? `Today: ${todayHours.open} - ${todayHours.close}`
                    : "Hours not available";
                })()}
              </span>
            </div>
          )}

          {/* Services */}
          {shop.services && shop.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {shop.services.slice(0, 3).map((service, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-dark-border text-text-secondary text-xs"
                >
                  {service}
                </Badge>
              ))}
              {shop.services.length > 3 && (
                <Badge variant="outline" className="border-dark-border text-text-secondary text-xs">
                  +{shop.services.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {shop.phone && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `tel:${shop.phone}`;
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-dark-secondary rounded-xl text-sm font-grotesk hover:bg-orange transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            )}
            {shop.google_maps_url && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.open(shop.google_maps_url, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-dark-secondary rounded-xl text-sm font-grotesk hover:bg-orange transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Directions
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
