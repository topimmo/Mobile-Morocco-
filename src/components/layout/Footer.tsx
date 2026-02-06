import { Link } from 'react-router-dom';
import { Smartphone, Phone, Mail, MapPin, ExternalLink, Globe, MessageSquare, PlusCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FOOTER_CATEGORIES = [
  { label: 'Smartphones', path: '/phones' },
  { label: 'Pièces Téléphones', path: '/phone-parts' },
  { label: 'Ordinateurs', path: '/computers' },
  { label: 'Pièces Ordinateurs', path: '/computer-parts' },
  { label: 'Équipements', path: '/equipment' },
];

const FOOTER_SERVICES = [
  { label: 'Réparation Téléphones', path: '/repair/phones' },
  { label: 'Réparation Ordinateurs', path: '/repair/computers' },
  { label: 'Boutiques', path: '/stores' },
  { label: 'Comparer', path: '/compare' },
];

const FOOTER_LEGAL = [
  { label: "Conditions d'utilisation", path: '#' },
  { label: 'Politique de confidentialité', path: '#' },
  { label: 'Mentions légales', path: '#' },
  { label: 'Plan du site', path: '/sitemap' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e13]">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E67E22]/10 via-transparent to-[#00D9FF]/5" />
            <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-grotesk text-2xl md:text-3xl font-bold text-white mb-2">
                  Vous avez quelque chose à vendre?
                </h3>
                <p className="text-[#A0AEC0] text-base">
                  Publiez votre annonce gratuitement et touchez des milliers d'acheteurs au Maroc.
                </p>
              </div>
              <Link to="/post-ad" className="flex-shrink-0">
                <Button size="lg" className="bg-gradient-to-r from-[#E67E22] to-[#D35400] hover:from-[#D35400] hover:to-[#C0392B] text-white font-semibold px-8 py-6 text-base shadow-lg shadow-orange-500/25 gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Publier une Annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start gap-4 rounded-xl p-5 bg-yellow-500/5 border border-yellow-500/15">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-200 text-sm mb-1">Avertissement</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Mobile Maroc est une plateforme de mise en relation et d'annonces. 
                Nous ne participons à aucune transaction commerciale, paiement, expédition ou livraison. 
                Toutes les négociations et accords sont conclus directement entre les utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E67E22] to-[#D35400]">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="font-grotesk text-lg font-bold text-white">
                Mobile<span className="text-[#E67E22]">Maroc</span>
              </span>
            </Link>
            <p className="text-sm text-[#64748B] mb-4 leading-relaxed">
              La marketplace #1 des annonces mobiles et tech au Maroc.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:text-[#E67E22] hover:bg-white/10 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:text-[#E67E22] hover:bg-white/10 transition-colors">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:text-[#E67E22] hover:bg-white/10 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-grotesk font-semibold text-white text-sm mb-4">Catégories</h5>
            <ul className="space-y-2.5">
              {FOOTER_CATEGORIES.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-[#64748B] hover:text-[#E67E22] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-grotesk font-semibold text-white text-sm mb-4">Services</h5>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-[#64748B] hover:text-[#E67E22] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-grotesk font-semibold text-white text-sm mb-4">Légal</h5>
            <ul className="space-y-2.5">
              {FOOTER_LEGAL.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-sm text-[#64748B] hover:text-[#E67E22] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-grotesk font-semibold text-white text-sm mb-4">Contact</h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#64748B]">
                <Phone className="h-4 w-4 text-[#E67E22]" />
                +212 6XX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-sm text-[#64748B]">
                <Mail className="h-4 w-4 text-[#E67E22]" />
                info@mobilemaroc.ma
              </li>
              <li className="flex items-center gap-2 text-sm text-[#64748B]">
                <MapPin className="h-4 w-4 text-[#E67E22]" />
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <p>© 2024 Mobile Maroc. Tous droits réservés. Plateforme d'annonces uniquement.</p>
          <p>Développé avec ❤️ au Maroc</p>
        </div>
      </div>
    </footer>
  );
}
