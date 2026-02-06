import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, PlusCircle, ChevronDown, Bell, User, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NAV_LINKS = [
  { path: '/phones', label: 'Produits', children: [
    { path: '/phones', label: 'Smartphones' },
    { path: '/phone-parts', label: 'Pièces Téléphones' },
    { path: '/computers', label: 'Ordinateurs' },
    { path: '/computer-parts', label: 'Pièces Ordinateurs' },
    { path: '/equipment', label: 'Équipements' },
  ]},
  { path: '/repair/phones', label: 'Services', children: [
    { path: '/repair/phones', label: 'Réparation Téléphones' },
    { path: '/repair/computers', label: 'Réparation Ordinateurs' },
  ]},
  { path: '/stores', label: 'Boutiques' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F1419]/95 backdrop-blur-xl">
      {/* Top Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E67E22] to-[#D35400]">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="font-grotesk text-lg font-bold text-white hidden sm:block">
              Mobile<span className="text-[#E67E22]">Maroc</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.path)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.path)
                      ? 'text-[#E67E22] bg-[#E67E22]/10'
                      : 'text-[#A0AEC0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.path && (
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-white/10 bg-[#0F1419]/98 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="flex items-center px-4 py-3 text-sm text-[#A0AEC0] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                name="q"
                placeholder="Rechercher produits, services..."
                className="w-full pl-10 h-10 bg-white/5 border-white/10 text-sm placeholder:text-[#64748B] focus:border-[#E67E22]/50 focus:ring-[#E67E22]/20"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#A0AEC0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#A0AEC0] hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#E67E22]" />
            </button>

            {/* User */}
            <Link
              to="/register"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-[#A0AEC0] hover:text-white hover:bg-white/5 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Post Ad CTA */}
            <Link to="/post-ad">
              <Button size="sm" className="bg-gradient-to-r from-[#E67E22] to-[#D35400] hover:from-[#D35400] hover:to-[#C0392B] text-white font-medium shadow-lg shadow-orange-500/20 gap-1.5">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Publier</span>
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#A0AEC0] hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 bg-[#0F1419]/95 backdrop-blur-xl">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                name="q"
                placeholder="Rechercher..."
                className="w-full pl-10 h-10 bg-white/5 border-white/10 text-sm"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0F1419]/98 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => !link.children && setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(link.path)
                      ? 'text-[#E67E22] bg-[#E67E22]/10'
                      : 'text-[#A0AEC0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-4 w-4" />}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 rounded-lg text-sm text-[#64748B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-white/10 text-[#A0AEC0] hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  S'inscrire / Connexion
                </Button>
              </Link>
              <Link to="/post-ad" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white mt-2">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Publier une Annonce
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
