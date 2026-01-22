import StickyNav from "../marketplace/StickyNav";
import HeroSearchDark from "../marketplace/HeroSearchDark";
import CategoryGridDark from "../marketplace/CategoryGridDark";
import FeaturedAds from "../marketplace/FeaturedAds";
import LatestProductsDark from "../marketplace/LatestProductsDark";
import Footer from "../marketplace/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sticky Navigation */}
      <StickyNav variant="dark" />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Search Section */}
        <section className="animate-in fade-in duration-200">
          <HeroSearchDark />
        </section>

        {/* Category Grid Section */}
        <section className="animate-in fade-in duration-300 delay-100">
          <CategoryGridDark />
        </section>

        {/* Featured Ads Carousel */}
        <section className="animate-in fade-in duration-300 delay-150">
          <FeaturedAds />
        </section>

        {/* Latest Products Feed */}
        <section className="animate-in fade-in duration-300 delay-200">
          <LatestProductsDark />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
