import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NearbyServicesSectionProps {
  language?: "ar" | "fr";
}

const NearbyServicesSection = ({
  language = "ar",
}: NearbyServicesSectionProps) => {
  const isRTL = language === "ar";

  const title = language === "ar" 
    ? "منتوجات وخدمات قريبة منك"
    : "Produits et services près de chez vous";
  
  const subtitle = language === "ar"
    ? "اكتشف هواتف، إكسسوارات وخدمات إصلاح متوفرة قريب ليك"
    : "Découvrez des téléphones, accessoires et services de réparation disponibles près de chez vous";
  
  const ctaText = language === "ar"
    ? "سجّل باش تشوف العروض القريبة منك"
    : "Inscrivez-vous pour voir les offres près de chez vous";

  const cards = language === "ar" 
    ? [
        {
          id: "card-1",
          emoji: "📱",
          text: "iPhone مستعمل – حي السلام",
        },
        {
          id: "card-2",
          emoji: "🔧",
          text: "تصليح هواتف – حي النخيل",
        },
        {
          id: "card-3",
          emoji: "🎧",
          text: "سماعات أصلية – وسط المدينة",
        },
        {
          id: "card-4",
          emoji: "🔋",
          text: "بطاريات وشواحن – قريب ليك",
        },
        {
          id: "card-5",
          emoji: "📲",
          text: "Samsung جديد – الحي المحمدي",
        },
        {
          id: "card-6",
          emoji: "💼",
          text: "قطع غيار – الدار البيضاء",
        },
      ]
    : [
        {
          id: "card-1",
          emoji: "📱",
          text: "iPhone d'occasion – Quartier Salam",
        },
        {
          id: "card-2",
          emoji: "🔧",
          text: "Réparation téléphones – Quartier Nakhil",
        },
        {
          id: "card-3",
          emoji: "🎧",
          text: "Écouteurs originaux – Centre-ville",
        },
        {
          id: "card-4",
          emoji: "🔋",
          text: "Batteries et chargeurs – Près de vous",
        },
        {
          id: "card-5",
          emoji: "📲",
          text: "Samsung neuf – Hay Mohammadi",
        },
        {
          id: "card-6",
          emoji: "💼",
          text: "Pièces détachées – Casablanca",
        },
      ];

  return (
    <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="containerPage">
        <div className={cn(isRTL ? "text-right" : "text-center", "mb-6 sm:mb-8")}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 sm:mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="flex items-center gap-3 p-4 md:p-5">
                  <div className="text-3xl md:text-4xl flex-shrink-0">
                    {card.emoji}
                  </div>
                  <p className={cn(
                    "text-sm sm:text-base md:text-lg font-medium text-foreground flex-1",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/auth/register">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NearbyServicesSection;
