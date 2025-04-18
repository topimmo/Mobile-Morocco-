import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Phone, Mail, MessageSquare, Star } from "lucide-react";
import { Technician } from "@/types/technician";

interface TechnicianProfileProps {
  technician: Technician;
  language?: "ar" | "fr";
}

const TechnicianProfile: React.FC<TechnicianProfileProps> = ({
  technician,
  language = "ar",
}) => {
  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className={`overflow-hidden h-full bg-white ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.id}`}
            />
            <AvatarFallback>{getInitials(technician.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{technician.name}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{technician.city}</span>
            </div>
            {technician.rating && (
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">
                  {technician.rating}
                  <span className="text-muted-foreground ml-1">
                    ({technician.reviewCount})
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {isRTL ? "الخدمات" : "Services"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {technician.services.map((service, index) => (
              <Badge key={index} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {technician.portfolio && technician.portfolio.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {isRTL ? "معرض الأعمال" : "Portfolio"}
            </h4>
            <Carousel className="w-full">
              <CarouselContent>
                {technician.portfolio.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${technician.name} - ${isRTL ? "عمل" : "travail"} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-3" />
            </Carousel>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {isRTL ? "معلومات الاتصال" : "Contact"}
          </h4>
          <div className="space-y-2">
            {technician.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{technician.contact.phone}</span>
              </div>
            )}
            {technician.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{technician.contact.email}</span>
              </div>
            )}
            {technician.contact.whatsapp && (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>WhatsApp: {technician.contact.whatsapp}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/20 flex justify-between">
        <Button className="w-full">
          {isRTL ? "طلب خدمة" : "Demander un service"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicianProfile;
