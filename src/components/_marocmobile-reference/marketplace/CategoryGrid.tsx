import { Smartphone, Laptop, Headphones, Wrench, Store } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    nameAr: "الهواتف الذكية",
    icon: Smartphone,
    color: "terracotta",
    count: 1247,
    span: "md:col-span-2 md:row-span-2",
    path: "/category/smartphones",
  },
  {
    id: "computers",
    name: "Computers",
    nameAr: "الحواسيب",
    icon: Laptop,
    color: "lime",
    count: 856,
    span: "md:col-span-1 md:row-span-1",
    path: "/category/computers",
  },
  {
    id: "accessories",
    name: "Accessories",
    nameAr: "الإكسسوارات",
    icon: Headphones,
    color: "rose",
    count: 2134,
    span: "md:col-span-1 md:row-span-1",
    path: "/category/accessories",
  },
  {
    id: "spare-parts",
    name: "Spare Parts",
    nameAr: "قطع الغيار",
    icon: Wrench,
    color: "charcoal",
    count: 543,
    span: "md:col-span-1 md:row-span-1",
    path: "/category/spare-parts",
  },
  {
    id: "repair-shops",
    name: "Repair Shops",
    nameAr: "محلات الإصلاح",
    icon: Store,
    color: "lime",
    count: 189,
    span: "md:col-span-1 md:row-span-1",
    path: "/repair-shops",
  },
];

export default function CategoryGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-4xl md:text-5xl font-syne font-extrabold mb-8 text-left">
        Browse Categories
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const bgColor = category.color === "terracotta" ? "bg-terracotta" :
                         category.color === "lime" ? "bg-lime" :
                         category.color === "rose" ? "bg-rose" :
                         "bg-charcoal";
          
          return (
            <Link
              key={category.id}
              to={category.path}
              className={`${category.span} group relative p-8 border-[3px] border-black bg-white hover:shadow-brutal transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden`}
            >
              {/* Background Color on Hover */}
              <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <Icon className={`w-12 h-12 md:w-16 md:h-16 mb-4 ${category.color === "terracotta" ? "text-terracotta" : category.color === "lime" ? "text-lime" : category.color === "rose" ? "text-rose" : "text-charcoal"}`} />
                  <h3 className="text-2xl md:text-3xl font-syne font-extrabold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-lg font-grotesk text-gray-600 mb-4">
                    {category.nameAr}
                  </p>
                </div>
                
                <div className="font-mono font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.count.toLocaleString()} items
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
