import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Phone,
  Smartphone,
  Headphones,
  Wrench,
  Settings,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SubCategory {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface CategoryProps {
  categories?: {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    link?: string;
    subCategories?: SubCategory[];
  }[];
  title?: string;
  language?: "ar" | "fr";
}

const CategorySection = ({
  categories: propCategories,
  title = "تصفح حسب الفئة",
  language = "ar",
}: CategoryProps) => {
  const defaultCategories = [
    {
      id: "phones",
      name: language === "ar" ? "الهواتف" : "Téléphones",
      icon: <Phone className="h-10 w-10" />,
      description:
        language === "ar"
          ? "هواتف جديدة ومستعملة من مختلف العلامات التجارية"
          : "Téléphones neufs et d'occasion de différentes marques",
      link: "/products?category=phones",
      subCategories: [
        {
          id: "new-phones",
          name: language === "ar" ? "هواتف جديدة" : "Téléphones neufs",
          description:
            language === "ar"
              ? "أحدث الهواتف الذكية من مختلف العلامات التجارية"
              : "Les derniers smartphones de différentes marques",
          link: "/products?category=phones&subcategory=new-phones",
        },
        {
          id: "used-phones",
          name: language === "ar" ? "هواتف مستعملة" : "Téléphones d'occasion",
          description:
            language === "ar"
              ? "هواتف بحالة جيدة وبأسعار مناسبة"
              : "Téléphones en bon état à des prix abordables",
          link: "/products?category=phones&subcategory=used-phones",
        },
      ],
    },
    {
      id: "accessories",
      name: language === "ar" ? "إكسسوارات" : "Accessoires",
      icon: <Headphones className="h-10 w-10" />,
      description:
        language === "ar"
          ? "سماعات، أغطية، شواحن وملحقات أخرى"
          : "Écouteurs, coques, chargeurs et autres accessoires",
      link: "/products?category=accessories",
      subCategories: [
        {
          id: "cases-protectors",
          name:
            language === "ar"
              ? "أغطية وواقيات الشاشة"
              : "Coques et protections d'écran",
          description:
            language === "ar"
              ? "حماية لهاتفك من الصدمات والخدوش"
              : "Protection pour votre téléphone contre les chocs et rayures",
          link: "/products?category=accessories&subcategory=cases-protectors",
        },
        {
          id: "chargers-earphones",
          name: language === "ar" ? "شواحن وسماعات" : "Chargeurs et écouteurs",
          description:
            language === "ar"
              ? "شواحن وسماعات أصلية وعالية الجودة"
              : "Chargeurs et écouteurs originaux et de haute qualité",
          link: "/products?category=accessories&subcategory=chargers-earphones",
        },
        {
          id: "cables-misc",
          name:
            language === "ar"
              ? "كابلات وأدوات متنوعة"
              : "Câbles et outils divers",
          description:
            language === "ar"
              ? "كابلات وأدوات متنوعة لهاتفك"
              : "Câbles et outils divers pour votre téléphone",
          link: "/products?category=accessories&subcategory=cables-misc",
        },
      ],
    },
    {
      id: "spare-parts",
      name: language === "ar" ? "قطع غيار" : "Pièces détachées",
      icon: <Settings className="h-10 w-10" />,
      description:
        language === "ar"
          ? "قطع غيار جديدة ومستعملة لمختلف أنواع الهواتف"
          : "Pièces détachées neuves et d'occasion pour différents types de téléphones",
      link: "/products?category=spare-parts",
      subCategories: [
        {
          id: "new-spare-parts",
          name:
            language === "ar" ? "قطع غيار جديدة" : "Pièces détachées neuves",
          description:
            language === "ar"
              ? "قطع غيار أصلية جديدة لمختلف أنواع الهواتف"
              : "Pièces détachées neuves originales pour différents types de téléphones",
          link: "/products?category=spare-parts&subcategory=new-spare-parts",
        },
        {
          id: "used-spare-parts",
          name:
            language === "ar"
              ? "قطع غيار مستعملة"
              : "Pièces détachées d'occasion",
          description:
            language === "ar"
              ? "قطع غيار مستعملة بحالة جيدة وبأسعار مناسبة"
              : "Pièces détachées d'occasion en bon état à des prix abordables",
          link: "/products?category=spare-parts&subcategory=used-spare-parts",
        },
      ],
    },
    {
      id: "repair-equipment",
      name: language === "ar" ? "معدات صيانة" : "Équipement de réparation",
      icon: <Wrench className="h-10 w-10" />,
      description:
        language === "ar"
          ? "أدوات ومعدات احترافية لصيانة الهواتف"
          : "Outils et équipements professionnels pour la réparation de téléphones",
      link: "/products?category=repair-equipment",
      subCategories: [
        {
          id: "new-equipment",
          name: language === "ar" ? "معدات جديدة" : "Équipement neuf",
          description:
            language === "ar"
              ? "أدوات ومعدات جديدة لصيانة اله��اتف"
              : "Outils et équipements neufs pour la réparation de téléphones",
          link: "/products?category=repair-equipment&subcategory=new-equipment",
        },
        {
          id: "used-equipment",
          name: language === "ar" ? "معدات مستعملة" : "Équipement d'occasion",
          description:
            language === "ar"
              ? "أدوات ومعدات مستعملة بحالة جيدة وبأسعار مناسبة"
              : "Outils et équipements d'occasion en bon état à des prix abordables",
          link: "/products?category=repair-equipment&subcategory=used-equipment",
        },
      ],
    },
    {
      id: "technicians-corner",
      name: language === "ar" ? "ركن الفنيين" : "Coin des techniciens",
      icon: <Settings className="h-10 w-10" />,
      description:
        language === "ar"
          ? "قطع غيار مستعملة وأدوات صيانة للفنيين المحترفين"
          : "Pièces détachées d'occasion et outils de maintenance pour techniciens professionnels",
      link: "/technicians",
      subCategories: [
        {
          id: "looking-for-job",
          name: language === "ar" ? "البحث عن عمل" : "Recherche d'emploi",
          description:
            language === "ar"
              ? "فنيون يبحثون عن فرص عمل"
              : "Techniciens à la recherche d'opportunités d'emploi",
          link: "/technicians?filter=jobs",
        },
        {
          id: "offering-services",
          name: language === "ar" ? "تقديم خدمات" : "Offre de services",
          description:
            language === "ar"
              ? "فنيون يقدمون خدمات الصيانة والإصلاح"
              : "Techniciens offrant des services de maintenance et de réparation",
          link: "/technicians?filter=services",
        },
      ],
    },
  ];

  const categories = propCategories || defaultCategories;
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const handlePopoverOpen = (categoryId: string) => {
    setOpenPopover(openPopover === categoryId ? null : categoryId);
  };

  return (
    <section className="w-full py-6 sm:py-8 md:py-12 lg:py-16 bg-background">
      <div className="containerPage">
        <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-primary">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {category.subCategories && category.subCategories.length > 0 ? (
                <Popover
                  open={openPopover === category.id}
                  onOpenChange={() => handlePopoverOpen(category.id)}
                >
                  <PopoverTrigger asChild>
                    <div className="block h-full min-h-[120px]">
                      <Card className="h-full cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-4 md:p-5 text-center h-full min-h-[120px]">
                          <div className="rounded-full bg-primary/10 p-3 mb-3">
                            {React.cloneElement(
                              category.icon as React.ReactElement,
                              {
                                className:
                                  "h-8 w-8 md:h-10 md:w-10",
                              },
                            )}
                          </div>
                          <h3 className="font-semibold text-base md:text-lg mb-1 flex items-center justify-center gap-1">
                            {category.name}
                            <ChevronDown className="h-4 w-4 inline-block ml-1" />
                          </h3>
                          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                            {category.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="center">
                    <div className="grid gap-1 p-2">
                      {category.subCategories.map((subCategory) => (
                        <Link
                          key={subCategory.id}
                          to={subCategory.link}
                          className="block p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <h4 className="font-medium text-sm">
                            {subCategory.name}
                          </h4>
                          <p className="text-muted-foreground text-xs">
                            {subCategory.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link
                  to={category.link || `/products?category=${category.id}`}
                  className="block h-full min-h-[120px]"
                >
                  <Card className="h-full cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300">
                    <CardContent className="flex flex-col items-center justify-center p-4 md:p-5 text-center h-full min-h-[120px]">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        {React.cloneElement(
                          category.icon as React.ReactElement,
                          {
                            className: "h-8 w-8 md:h-10 md:w-10",
                          },
                        )}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;