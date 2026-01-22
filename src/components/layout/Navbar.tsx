import Navigation from '@/components/Navigation';

/**
 * Navbar Component - Swiss Minimal Design
 * Wraps the Navigation component with consistent styling
 * Fixed height to prevent CLS (Cumulative Layout Shift)
 */
export default function Navbar() {
  return (
    <Navigation />
  );
}
