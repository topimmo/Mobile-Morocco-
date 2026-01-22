import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * PageLayout Component - Swiss Minimal Design
 * Provides consistent page structure with semantic HTML
 * - Fixed navbar height to prevent CLS
 * - Proper <main> landmark for accessibility
 * - Consistent spacing and layout
 */
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
