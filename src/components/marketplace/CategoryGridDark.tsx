import { Smartphone, Laptop, Headphones, Wrench, Store, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphones: Smartphone,
  computers: Laptop,
  accessories: Headphones,
  "spare-parts": Wrench,
  "repair-shops": Store,
};

const colorMap: Record<string, string> = {
  smartphones: "orange",
  computers: "yellow",
  accessories: "success",
  "spare-parts": "text-secondary",
  "repair-shops": "yellow",
};

const spanMap: Record<string, string> = {
  smartphones: "md:col-span-2 md:row-span-2",
  computers: "md:col-span-1 md:row-span-1",
  accessories: "md:col-span-1 md:row-span-1",
  "spare-parts": "md:col-span-1 md:row-span-1",
  "repair-shops": "md:col-span-1 md:row-span-1",
};

type CategoryWithCount = {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  count: number;
};

export default function CategoryGridDark() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name, name_ar, slug")
        .order("name");

      if (categoriesData) {
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (cat) => {
            if (cat.slug === "repair-shops") {
              const { count } = await supabase
                .from("repair_shops")
                .select("id", { count: "exact", head: true })
                .eq("status", "approved");
              return { ...cat, count: count || 0 };
            } else {
              const { count } = await supabase
                .from("products")
                .select("id", { count: "exact", head: true })
                .eq("status", "approved")
                .eq("category_id", cat.id);
              return { ...cat, count: count || 0 };
            }
          })
        );
        setCategories(categoriesWithCounts);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-dark-bg py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-dark-bg py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-syne font-extrabold mb-8 text-white">
          Browse Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.slug] || Smartphone;
            const color = colorMap[category.slug] || "orange";
            const span = spanMap[category.slug] || "md:col-span-1 md:row-span-1";
            const path = category.slug === "repair-shops" ? "/repair-shops" : `/category/${category.slug}`;
            const isPopular = category.slug === "smartphones";
            
            const colorClass = color === "orange" ? "text-orange" :
                              color === "yellow" ? "text-yellow" :
                              color === "success" ? "text-success" :
                              "text-text-secondary";
            const bgHover = color === "orange" ? "group-hover:bg-orange/10" :
                           color === "yellow" ? "group-hover:bg-yellow/10" :
                           color === "success" ? "group-hover:bg-success/10" :
                           "group-hover:bg-white/5";
            
            return (
              <Link
                key={category.id}
                to={path}
                className={`${span} group relative p-6 md:p-8 bg-dark-card border border-dark-border rounded-2xl hover:border-orange transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden`}
              >
                <div className={`absolute inset-0 ${bgHover} transition-colors duration-300`} />
                
                {isPopular && (
                  <Badge className="absolute top-4 right-4 bg-orange text-white border-0 font-grotesk">
                    Popular
                  </Badge>
                )}
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <Icon className={`w-10 h-10 md:w-14 md:h-14 mb-4 ${colorClass}`} />
                    <h3 className="text-xl md:text-2xl font-syne font-extrabold mb-1 text-white group-hover:text-orange transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-base font-grotesk text-text-secondary mb-4">
                      {category.name_ar}
                    </p>
                  </div>
                  
                  <div className="font-mono font-bold text-base text-text-secondary group-hover:text-white transition-colors">
                    {category.count.toLocaleString()} items
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
