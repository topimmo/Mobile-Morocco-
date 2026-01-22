import { useEffect, memo } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'local_business';
  noindex?: boolean;
  // JSON-LD structured data
  structuredData?: object;
  // Additional meta
  keywords?: string;
  author?: string;
  locale?: string;
}

const BASE_URL = 'https://mobilemaroc.ma';
const DEFAULT_TITLE = 'Mobile Maroc - Marketplace des téléphones au Maroc';
const DEFAULT_DESCRIPTION = 'Achetez et vendez des téléphones, accessoires et pièces détachées au Maroc. Trouvez des techniciens et ateliers de réparation près de chez vous.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = 'Mobile Maroc';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  structuredData,
  keywords = 'téléphones, mobiles, accessoires, réparation, Maroc, smartphones, iPhone, Samsung, Xiaomi',
  author = 'Mobile Maroc',
  locale = 'fr_MA',
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);
    
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    }

    // Open Graph / Facebook
    setMetaTag('og:type', type === 'local_business' ? 'business.business' : type, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('og:locale', locale, true);
    setMetaTag('og:locale:alternate', 'ar_MA', true);
    if (canonicalUrl) {
      setMetaTag('og:url', canonicalUrl, true);
    }

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageUrl);
    setMetaTag('twitter:site', '@mobilemaroc');

    // WhatsApp specific
    setMetaTag('og:image:alt', fullTitle, true);

    // Canonical link
    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.rel = 'canonical';
        document.head.appendChild(linkElement);
      }
      linkElement.href = canonicalUrl;
    }

    // JSON-LD Structured Data
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo-structured]');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-structured', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, keywords, author, noindex, type, imageUrl, locale, canonicalUrl, structuredData]);

  return null;
}

// Helper to generate Product structured data
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  seller?: string;
  sku?: string;
  brand?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || undefined,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'MAD',
      availability: 'https://schema.org/InStock',
      itemCondition: product.condition 
        ? `https://schema.org/${product.condition}` 
        : 'https://schema.org/NewCondition',
      seller: product.seller ? {
        '@type': 'Organization',
        name: product.seller,
      } : undefined,
    },
  };
}

// Helper to generate LocalBusiness structured data
export function generateLocalBusinessSchema(business: {
  name: string;
  description: string;
  image?: string;
  address: {
    street?: string;
    city: string;
    region?: string;
    country?: string;
  };
  phone?: string;
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  lat?: number;
  lng?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `#${business.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: business.name,
    description: business.description,
    image: business.image,
    telephone: business.phone,
    priceRange: business.priceRange || '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.country || 'MA',
    },
    geo: business.lat && business.lng ? {
      '@type': 'GeoCoordinates',
      latitude: business.lat,
      longitude: business.lng,
    } : undefined,
    aggregateRating: business.rating && business.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    } : undefined,
  };
}

// Helper to generate Website structured data
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/listings?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Helper to generate BreadcrumbList structured data
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export default memo(SEO);
