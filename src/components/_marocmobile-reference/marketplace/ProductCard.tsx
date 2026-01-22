import { Badge } from "@/components/ui/badge";
import { MapPin, Scale } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  location: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  variant?: "light" | "dark";
  onCompare?: () => void;
  showCompare?: boolean;
}

export default function ProductCard({ 
  id,
  title, 
  price, 
  image, 
  location, 
  condition,
  variant = "light",
  onCompare,
  showCompare = false
}: ProductCardProps) {
  const conditionColors = {
    "New": variant === "dark" ? "bg-success text-white" : "bg-lime text-charcoal",
    "Like New": variant === "dark" ? "bg-orange text-white" : "bg-terracotta text-white",
    "Good": variant === "dark" ? "bg-yellow text-dark-bg" : "bg-rose text-charcoal",
    "Fair": variant === "dark" ? "bg-text-secondary text-dark-bg" : "bg-gray-300 text-charcoal",
  };

  const isDark = variant === "dark";

  return (
    <Link to={`/product/${id}`} className="group cursor-pointer block">
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isDark 
          ? "bg-dark-card border border-dark-border hover:border-orange" 
          : "border-[3px] border-black bg-white hover:shadow-brutal"
      }`}>
        {/* Image */}
        <div className={`relative aspect-square overflow-hidden ${
          isDark ? "" : "border-b-[3px] border-black"
        }`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className={`absolute top-3 right-3 ${conditionColors[condition]} ${
            isDark ? "border-0" : "border-[2px] border-black"
          } font-grotesk font-medium text-xs`}>
            {condition}
          </Badge>
          
          {/* Compare Button */}
          {showCompare && onCompare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCompare();
              }}
              className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isDark 
                  ? "bg-dark-bg/80 hover:bg-orange text-white" 
                  : "bg-white/80 hover:bg-lime border-2 border-black"
              }`}
            >
              <Scale className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={`text-lg font-grotesk font-medium mb-2 line-clamp-2 min-h-[3.5rem] ${
            isDark ? "text-white group-hover:text-orange" : ""
          }`}>
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xl font-mono font-bold ${
              isDark ? "text-orange" : "text-terracotta"
            }`}>
              {price} MAD
            </p>
          </div>

          <div className={`flex items-center text-sm ${
            isDark ? "text-text-secondary" : "text-gray-600"
          }`}>
            <MapPin className="w-4 h-4 mr-1" />
            <span className="font-grotesk">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
