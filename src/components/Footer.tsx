import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Mobile Maroc</h3>
            <p className="text-sm mb-4">
              La plateforme leader pour acheter, vendre et réparer des téléphones mobiles au Maroc.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Accès Rapide</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/phones" className="hover:text-blue-400 transition">
                  Téléphones
                </Link>
              </li>
              <li>
                <Link to="/spare-parts" className="hover:text-blue-400 transition">
                  Pièces Détachées
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-blue-400 transition">
                  Équipements
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 transition">
                  Services de Réparation
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-blue-400 transition">
                  Boutiques
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Nous Contacter
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-blue-400 transition">
                  Publicité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Nous Contacter</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:support@mobilemaroc.ma" className="hover:text-blue-400 transition">
                  support@mobilemaroc.ma
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+212522123456" className="hover:text-blue-400 transition">
                  +212 5 22 12 34 56
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Legal Links */}
          <div className="flex gap-6 flex-wrap text-sm">
            <Link to="/terms" className="hover:text-blue-400 transition">
              Conditions d'Utilisation
            </Link>
            <Link to="/privacy" className="hover:text-blue-400 transition">
              Politique de Confidentialité
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>&copy; {currentYear} Mobile Maroc. Tous les droits réservés.</p>
          </div>

          {/* Payment Methods */}
          <div className="text-sm">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-700 rounded text-xs">Visa</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs">Mastercard</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs">Virement</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
