import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Advertisement = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  placement: string;
  city: { name: string } | null;
  clicks: number;
  impressions: number;
};

export default function FeaturedAds() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          id,
          title,
          description,
          image_url,
          link_url,
          placement,
          clicks,
          impressions,
          city:cities(name)
        `)
        .eq("status", "active")
        .eq("placement", "homepage")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching advertisements:", error);
      } else {
        setAds(data || []);
      }
      setLoading(false);
    };

    fetchAds();
  }, []);

  const trackClick = async (adId: string) => {
    await supabase.rpc("increment_ad_clicks", { ad_id: adId }).catch(console.error);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-dark-card py-12 md:py-16 border-y border-dark-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-syne font-extrabold text-white">
              Featured Ads
            </h2>
            <p className="text-text-secondary font-grotesk mt-1">
              Sponsored listings from verified sellers
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-xl border-2 border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange text-white transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-xl border-2 border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange text-white transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary font-grotesk">No featured ads available at the moment.</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {ads.map((ad) => {
              const AdWrapper = ad.link_url ? "a" : Link;
              const linkProps = ad.link_url 
                ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
                : { to: `/product/${ad.id}` };

              return (
                <AdWrapper
                  key={ad.id}
                  {...(linkProps as any)}
                  onClick={() => trackClick(ad.id)}
                  className="flex-shrink-0 w-[280px] md:w-[350px] snap-start group cursor-pointer"
                >
                  <div className="rounded-2xl overflow-hidden border-2 border-orange/50 bg-gradient-to-br from-orange/10 to-yellow/10 hover:border-orange transition-all duration-300 hover:-translate-y-2">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-yellow text-dark-bg border-0 font-mono font-bold">
                        SPONSORED
                      </Badge>
                    </div>

                    <div className="p-5 bg-dark-secondary">
                      <h3 className="text-xl font-syne font-bold mb-2 line-clamp-1 text-white group-hover:text-orange transition-colors">
                        {ad.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        {ad.description && (
                          <p className="text-sm font-grotesk text-text-secondary line-clamp-1 flex-1">
                            {ad.description}
                          </p>
                        )}
                        <p className="text-sm font-grotesk text-text-secondary">
                          {ad.city?.name || "Morocco"}
                        </p>
                      </div>
                    </div>
                  </div>
                </AdWrapper>
              );
            })}
          </div>
        )}

        {/* Advertise CTA */}
        <div className="mt-8 text-center">
          <Link 
            to="/advertise"
            className="inline-flex items-center gap-2 text-orange font-grotesk font-medium hover:underline"
          >
            Want to feature your product? Create an ad →
          </Link>
        </div>
      </div>
    </div>
  );
}
