import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-foreground border-t border-border">
      {/* Main Footer Content - Dark Swiss Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-foreground text-lg font-bold mb-4">Mobile Maroc</h3>
            <p className="text-sm mb-6 leading-relaxed text-muted-foreground">
              La plateforme leader pour acheter, vendre et réparer des téléphones mobiles au Maroc.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition text-muted-foreground" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary transition text-muted-foreground" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary transition text-muted-foreground" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary transition text-muted-foreground" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold mb-4">Accès Rapide</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition text-sm text-muted-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/phones" className="hover:text-primary transition text-sm text-muted-foreground">
                  Téléphones
                </Link>
              </li>
              <li>
                <Link to="/spare-parts" className="hover:text-primary transition text-sm text-muted-foreground">
                  Pièces Détachées
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-primary transition text-sm text-muted-foreground">
                  Équipements
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition text-sm text-muted-foreground">
                  Services de Réparation
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-primary transition text-sm text-muted-foreground">
                  Boutiques
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-foreground font-bold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary transition text-sm text-muted-foreground">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition text-sm text-muted-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition text-sm text-muted-foreground">
                  Nous Contacter
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-primary transition text-sm text-muted-foreground">
                  Publicité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground font-bold mb-4">Nous Contacter</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-muted-foreground" />
                <a href="mailto:support@mobilemaroc.ma" className="hover:text-primary transition text-muted-foreground text-sm">
                  support@mobilemaroc.ma
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-muted-foreground" />
                <a href="tel:+212522123456" className="hover:text-primary transition text-muted-foreground text-sm">
                  +212 5 22 12 34 56
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-1 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 md:pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm">
          {/* Legal Links */}
          <div className="flex gap-4 md:gap-6 flex-wrap text-sm">
            <Link to="/terms" className="hover:text-primary transition text-muted-foreground">
              Conditions d'Utilisation
            </Link>
            <Link to="/privacy" className="hover:text-primary transition text-muted-foreground">
              Politique de Confidentialité
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>&copy; {currentYear} Mobile Maroc. Tous les droits réservés.</p>
          </div>

          {/* Payment Methods */}
          <div className="text-sm">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Visa</span>
              <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Mastercard</span>
              <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">Virement</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
