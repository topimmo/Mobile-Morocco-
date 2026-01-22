import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type City = {
  id: string;
  name: string;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Stats = {
  listings: number;
  users: number;
  repairShops: number;
  cities: number;
};

const legalLinks = [
  { name: "Terms of Service", path: "/terms" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Disclaimer", path: "/disclaimer" },
];

export default function Footer() {
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({ listings: 0, users: 0, repairShops: 0, cities: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [citiesRes, categoriesRes, productsCount, usersCount, shopsCount] = await Promise.all([
        supabase.from("cities").select("id, name, slug").order("name").limit(5),
        supabase.from("categories").select("id, name, slug").order("name"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("repair_shops").select("id", { count: "exact", head: true }).eq("status", "approved"),
      ]);

      setCities(citiesRes.data || []);
      setCategories(categoriesRes.data || []);
      setStats({
        listings: productsCount.count || 0,
        users: usersCount.count || 0,
        repairShops: shopsCount.count || 0,
        cities: citiesRes.data?.length || 0,
      });
    };

    fetchData();
  }, []);
  return (
    <footer className="w-full bg-dark-card text-white py-12 md:py-16 border-t border-dark-border">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-syne font-extrabold mb-4 text-orange">
              MobileMorocco
            </h3>
            <p className="font-grotesk text-sm text-text-secondary mb-4">
              Morocco's premier marketplace for mobile devices, computers, and repair services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl border border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange transition-colors flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl border border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange transition-colors flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl border border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange transition-colors flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl border border-dark-border bg-dark-secondary hover:bg-orange hover:border-orange transition-colors flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-syne font-bold mb-4">Categories</h4>
            <ul className="space-y-2 font-grotesk text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={category.slug === "repair-shops" ? "/repair-shops" : `/category/${category.slug}`} 
                    className="text-text-secondary hover:text-orange transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-lg font-syne font-bold mb-4">Cities</h4>
            <ul className="space-y-2 font-grotesk text-sm">
              {cities.map((city) => (
                <li key={city.id}>
                  <Link to={`/category/smartphones?city=${city.slug}`} className="text-text-secondary hover:text-orange transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-syne font-bold mb-4">Legal</h4>
            <ul className="space-y-2 font-grotesk text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-text-secondary hover:text-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-dark-border pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">
                {stats.listings.toLocaleString()}
              </p>
              <p className="text-sm font-grotesk text-text-secondary">
                Total Listings
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">
                {stats.users.toLocaleString()}
              </p>
              <p className="text-sm font-grotesk text-text-secondary">
                Active Users
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">
                {stats.repairShops.toLocaleString()}
              </p>
              <p className="text-sm font-grotesk text-text-secondary">
                Repair Shops
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-mono font-bold text-orange mb-1">
                {stats.cities}
              </p>
              <p className="text-sm font-grotesk text-text-secondary">
                Cities Covered
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-border pt-6 text-center">
          <p className="text-sm font-grotesk text-text-secondary">
            © 2024 MobileMorocco. All rights reserved. Made with ❤️ in Morocco.
          </p>
        </div>
      </div>
    </footer>
  );
}
