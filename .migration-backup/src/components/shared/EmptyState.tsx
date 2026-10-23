import { Search, PackageOpen, Store, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type?: 'search' | 'listings' | 'stores' | 'services' | 'generic';
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const CONFIGS = {
  search: {
    icon: Search,
    title: 'Aucun résultat trouvé',
    description: 'Essayez de modifier vos critères de recherche ou de parcourir nos catégories.',
    ctaLabel: 'Parcourir les catégories',
    ctaLink: '/phones',
  },
  listings: {
    icon: PackageOpen,
    title: 'Aucune annonce disponible',
    description: 'Soyez le premier à publier dans cette catégorie !',
    ctaLabel: 'Publier une annonce',
    ctaLink: '/post-ad',
  },
  stores: {
    icon: Store,
    title: 'Aucune boutique trouvée',
    description: "Il n'y a pas encore de boutiques dans cette zone. Revenez bientôt !",
    ctaLabel: 'Voir toutes les boutiques',
    ctaLink: '/stores',
  },
  services: {
    icon: Wrench,
    title: 'Aucun service disponible',
    description: 'Pas de services de réparation trouvés pour le moment.',
    ctaLabel: 'Voir les réparateurs',
    ctaLink: '/repair/phones',
  },
  generic: {
    icon: PackageOpen,
    title: 'Rien à afficher',
    description: 'Le contenu sera disponible prochainement.',
    ctaLabel: "Retour à l'accueil",
    ctaLink: '/',
  },
};

export function EmptyState({
  type = 'generic',
  title,
  description,
  ctaLabel,
  ctaLink,
}: EmptyStateProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-6">
        <Icon className="h-10 w-10 text-[#64748B]" />
      </div>
      <h3 className="font-grotesk text-xl font-semibold text-white mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-[#64748B] max-w-md mb-6">
        {description || config.description}
      </p>
      <Link to={ctaLink || config.ctaLink}>
        <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white gap-2">
          {ctaLabel || config.ctaLabel}
        </Button>
      </Link>
    </div>
  );
}
