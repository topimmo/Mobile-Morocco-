import React from "react";
import { useComparison } from "@/contexts/ComparisonContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BarChart2, X, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ComparisonFloatingButton = () => {
  const { comparisonList, removeFromComparison, clearComparison } =
    useComparison();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed z-floating ${isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'}`}
      style={{ 
        bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))' 
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow relative bg-sky-600 hover:bg-sky-700"
          >
            <BarChart2 className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'مقارنة' : 'Comparer'}
            <Badge
              variant="secondary"
              className={`${isRTL ? 'mr-2' : 'ml-2'} bg-white text-sky-600 hover:bg-white`}
            >
              {comparisonList.length}/3
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {isRTL ? 'مقارنة المنتجات' : 'Comparer les produits'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearComparison}
                className="text-red-500 hover:text-red-700"
              >
                {isRTL ? 'مسح الكل' : 'Effacer tout'}
              </Button>
            </div>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {comparisonList.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 border rounded-lg"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-sm text-orange-600 font-semibold">
                      {product.price.toLocaleString()} DH
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromComparison(product.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              className="w-full bg-sky-600 hover:bg-sky-700" 
              onClick={() => navigate("/compare")}
            >
              {isRTL ? 'عرض المقارنة التفصيلية' : 'Voir la comparaison détaillée'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComparisonFloatingButton;
