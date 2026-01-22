import { Search, User, Menu, Globe, X, Scale, Store, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface StickyNavProps {
  variant?: "light" | "dark";
}

export default function StickyNav({ variant = "light" }: StickyNavProps) {
  const [language, setLanguage] = useState<"AR" | "FR">("FR");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleLanguage = () => {
    setLanguage(language === "AR" ? "FR" : "AR");
  };

  const isDark = variant === "dark";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-14 md:h-16 backdrop-blur-md ${
        isDark 
          ? "bg-dark-bg/90 border-b border-dark-border" 
          : "bg-cream/80 border-b-[3px] border-black"
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className={`text-xl md:text-2xl font-syne font-extrabold ${
              isDark ? "text-orange" : "text-terracotta"
            }`}>
              MobileMorocco
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/category/smartphones" className={`font-grotesk font-medium hover:text-orange transition-colors ${
              isDark ? "text-text-secondary" : "text-charcoal"
            }`}>
              Smartphones
            </Link>
            <Link to="/category/computers" className={`font-grotesk font-medium hover:text-orange transition-colors ${
              isDark ? "text-text-secondary" : "text-charcoal"
            }`}>
              Computers
            </Link>
            <Link to="/repair-shops" className={`font-grotesk font-medium hover:text-orange transition-colors ${
              isDark ? "text-text-secondary" : "text-charcoal"
            }`}>
              Repair Shops
            </Link>
            <Link to="/compare" className={`font-grotesk font-medium hover:text-orange transition-colors ${
              isDark ? "text-text-secondary" : "text-charcoal"
            }`}>
              Compare
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-grotesk font-medium text-sm transition-colors ${
                isDark 
                  ? "bg-dark-secondary border border-dark-border hover:bg-orange hover:border-orange text-white" 
                  : "border-[3px] border-black bg-white hover:bg-terracotta hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">{language}</span>
            </button>

            {/* Search Icon */}
            <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDark 
                ? "bg-dark-secondary border border-dark-border hover:bg-orange hover:border-orange" 
                : "border-[3px] border-black bg-white hover:bg-lime"
            }`}>
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <Link to={user ? "/dashboard" : "/login"} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDark 
                ? "bg-dark-secondary border border-dark-border hover:bg-orange hover:border-orange" 
                : "border-[3px] border-black bg-white hover:bg-lime"
            }`}>
              <User className="w-5 h-5" />
            </Link>

            {/* Menu */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors lg:hidden ${
                isDark 
                  ? "bg-dark-secondary border border-dark-border hover:bg-orange hover:border-orange" 
                  : "border-[3px] border-black bg-white hover:bg-lime"
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`fixed inset-0 z-40 pt-16 ${
          isDark ? "bg-dark-bg" : "bg-cream"
        }`}>
          <div className="p-6 space-y-4">
            <Link 
              to="/category/smartphones" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              Smartphones
            </Link>
            <Link 
              to="/category/computers" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              Computers
            </Link>
            <Link 
              to="/category/accessories" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              Accessories
            </Link>
            <Link 
              to="/category/spare-parts" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              <Wrench className="w-5 h-5" />
              Spare Parts
            </Link>
            <Link 
              to="/repair-shops" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              <Store className="w-5 h-5" />
              Repair Shops
            </Link>
            <Link 
              to="/compare" 
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk font-medium ${
                isDark ? "bg-dark-card border border-dark-border" : "bg-white border-[3px] border-black"
              }`}
            >
              <Scale className="w-5 h-5" />
              Compare Phones
            </Link>
            
            <div className="pt-4 border-t border-dark-border">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className={`block p-4 rounded-xl font-grotesk font-medium mb-2 ${
                      isDark ? "bg-orange text-white" : "bg-terracotta text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className={`w-full p-4 rounded-xl font-grotesk font-medium text-left ${
                      isDark ? "bg-dark-secondary text-text-secondary" : "bg-gray-200 text-charcoal"
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                    className={`block p-4 rounded-xl font-grotesk font-medium mb-2 ${
                      isDark ? "bg-orange text-white" : "bg-terracotta text-white"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setMenuOpen(false)}
                    className={`block p-4 rounded-xl font-grotesk font-medium ${
                      isDark ? "bg-dark-secondary border border-dark-border" : "bg-white border-[3px] border-black"
                    }`}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
