import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Globe,
  Grid,
  Home,
  List,
  MapPin,
  Search,
  Settings,
  User,
  Wrench,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const pages = [
  {
    category: 'Public Pages',
    icon: Globe,
    items: [
      { path: '/', label: 'Home', description: 'Landing page with featured listings', icon: Home },
      { path: '/home', label: 'Home Alt', description: 'Alternative home route', icon: Home },
      { path: '/categories', label: 'Categories', description: 'Browse all product categories', icon: Grid },
      { path: '/listings', label: 'Listings', description: 'All marketplace listings with filters', icon: List },
      { path: '/listing/:id/:slug', label: 'Listing Details', description: 'Single listing detail page', icon: Zap },
      { path: '/repair-shops', label: 'Repair Shops', description: 'Directory of repair shops', icon: Wrench },
      { path: '/repair-shop/:id/:slug', label: 'Repair Shop Details', description: 'Individual repair shop profile', icon: MapPin },
      { path: '/search', label: 'Search Results', description: 'Search results page', icon: Search },
      { path: '/category/:slug', label: 'Category Listings', description: 'Listings by category', icon: Grid },
    ]
  },
  {
    category: 'User Pages',
    icon: User,
    items: [
      { path: '/register', label: 'Register', description: 'User registration page', icon: User },
      { path: '/vendor/:id', label: 'Vendor Profile', description: 'Vendor/seller profile', icon: User },
      { path: '/seller/:id', label: 'Seller Profile', description: 'Seller profile (alt route)', icon: User },
    ]
  },
  {
    category: 'Admin Pages',
    icon: Settings,
    items: [
      { path: '/dashboard', label: 'Admin Dashboard', description: 'Admin & ads management panel', icon: Settings },
      { path: '/advertiser/dashboard', label: 'Advertiser Dashboard', description: 'Advertiser campaign management', icon: BarChart3 },
      { path: '/advertiser/create', label: 'Create Advertisement', description: 'Create new ad campaign', icon: AlertCircle },
    ]
  }
];


export function SiteMapPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-grotesk font-bold mb-4">
              Site Map
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete overview of all pages and routes in Mobile Maroc marketplace
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {pages.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <SectionIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-grotesk font-bold">{section.category}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, itemIdx) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={itemIdx}
                        variants={itemVariants}
                        className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <ItemIcon className="h-6 w-6 text-primary flex-shrink-0" />
                          <code className="text-xs bg-white/5 px-2 py-1 rounded text-cyan-400 font-mono">
                            {item.path}
                          </code>
                        </div>
                        <h3 className="font-semibold mb-1">{item.label}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        
                        <Link to={item.path}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full border-white/10 hover:bg-primary hover:text-white"
                          >
                            Visit Page
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div
          variants={itemVariants}
          className="mt-16 glass-card rounded-xl p-6 border border-yellow-500/20 bg-yellow-500/5"
        >
          <h3 className="font-semibold text-yellow-200 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Route Parameters
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><code className="bg-white/5 px-2 py-1 rounded font-mono">:id</code> - Item/Shop ID (UUID)</li>
            <li><code className="bg-white/5 px-2 py-1 rounded font-mono">:slug</code> - SEO-friendly URL slug</li>
            <li><code className="bg-white/5 px-2 py-1 rounded font-mono">:category</code> - Category slug</li>
          </ul>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-primary mb-2">9</div>
            <p className="text-sm text-muted-foreground">Public Pages</p>
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-sm text-muted-foreground">User Pages</p>
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-sm text-muted-foreground">Admin Pages</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Total Routes: <strong>15</strong> | Database-driven content pages not listed</p>
        </div>
      </footer>
    </div>
  );
}
