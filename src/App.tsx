import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { usePageTracking } from "@/hooks/useAnalytics";
import ComparisonFloatingButton from "@/components/ComparisonFloatingButton";
import ErrorBoundary, { GlobalErrorBoundary, PageErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkErrorBanner } from "@/components/common/InlineError";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { ProtectedRoute, AdminRoute, TechnicianRoute, ImporterRoute } from "@/components/ProtectedRoute";
import { AdminGuard, AgentGuard, MerchantGuard } from "@/components/RoleGuard";
import { isEnvValid } from "@/config/env";
import EnvErrorFallback from "@/components/EnvErrorFallback";

// Public pages
const Home = lazy(() => import("@/pages/HomePage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const CityPage = lazy(() => import("@/pages/CityPage"));
const ListingsPage = lazy(() => import("@/pages/ListingsPage"));
const ListingDetailsPage = lazy(() => import("@/pages/ListingDetailsPage"));
const RepairShopsPage = lazy(() => import("@/pages/RepairShopsPage"));
const RepairShopDetailsPage = lazy(() => import("@/pages/RepairShopDetailsPage"));
const TechniciansPage = lazy(() => import("@/components/TechniciansPage"));

// New Platform pages
const PhonesPage = lazy(() => import("@/pages/PhonesPage"));
const SparePartsPage = lazy(() => import("@/pages/SparePartsPage"));
const EquipmentPage = lazy(() => import("@/pages/EquipmentPage"));
const ComputersPage = lazy(() => import("@/pages/ComputersPage"));
const ComputerPartsPage = lazy(() => import("@/pages/ComputerPartsPage"));
const ComputerRepairPage = lazy(() => import("@/pages/ComputerRepairPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const StoresPage = lazy(() => import("@/pages/StoresPage"));
const StoreProfilePage = lazy(() => import("@/pages/StoreProfilePage"));
const ItemDetailsPage = lazy(() => import("@/pages/ItemDetailsPage"));
const AdvertisePage = lazy(() => import("@/pages/AdvertisePage"));
const AdRequestPage = lazy(() => import("@/pages/AdRequestPage"));
const PublishPhonePage = lazy(() => import("@/pages/PublishPhonePage"));
const PublishComputerPage = lazy(() => import("@/pages/PublishComputerPage"));
const PublishComputerPartPage = lazy(() => import("@/pages/PublishComputerPartPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const FavoritesPage = lazy(() => import("@/components/FavoritesPage"));
const TestCreateListingPage = lazy(() => import("@/pages/TestCreateListingPage"));

// Legal pages
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));

// Auth pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const AccountTypeSelectionPage = lazy(() => import("@/pages/auth/AccountTypeSelectionPage"));
const AuthCallbackPage = lazy(() => import("@/pages/auth/AuthCallbackPage"));

// Admin dashboard
const AdminDashboard = lazy(() => import("@/pages/admin/DashboardPage"));

// Agent dashboard
const AgentDashboard = lazy(() => import("@/pages/agent/DashboardPage"));

// Merchant dashboard
const MerchantDashboard = lazy(() => import("@/pages/merchant/DashboardPage"));

// User dashboard pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const MyStorePage = lazy(() => import("@/pages/dashboard/MyStorePage"));
const CreateItemPage = lazy(() => import("@/pages/dashboard/CreateItemPage"));

// Error pages
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));

function AppContent() {
  // Track page views on route changes
  usePageTracking();
  
  // Monitor network connectivity
  const { isOffline } = useNetworkStatus();
  
  // Scroll to top on route change
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Global network status banner */}
      <NetworkErrorBanner isOffline={isOffline} className="sticky top-0 z-50" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        }
      >
        <Routes>
          {/* Public Pages - Wrapped with PageErrorBoundary */}
          <Route path="/" element={<PageErrorBoundary><Home /></PageErrorBoundary>} />
          <Route path="/categories/:slug" element={<PageErrorBoundary><CategoryPage /></PageErrorBoundary>} />
          <Route path="/cities/:slug" element={<PageErrorBoundary><CityPage /></PageErrorBoundary>} />
          <Route path="/listings" element={<PageErrorBoundary><ListingsPage /></PageErrorBoundary>} />
          <Route path="/listings/:slug" element={<PageErrorBoundary><ListingDetailsPage /></PageErrorBoundary>} />
          <Route path="/repair-shops" element={<PageErrorBoundary><RepairShopsPage /></PageErrorBoundary>} />
          <Route path="/repair-shops/:slug" element={<PageErrorBoundary><RepairShopDetailsPage /></PageErrorBoundary>} />
          <Route path="/technicians" element={<PageErrorBoundary><TechniciansPage /></PageErrorBoundary>} />

          {/* New Platform Pages */}
          <Route path="/phones" element={<PageErrorBoundary><PhonesPage /></PageErrorBoundary>} />
          <Route path="/spare-parts" element={<PageErrorBoundary><SparePartsPage /></PageErrorBoundary>} />
          <Route path="/equipment" element={<PageErrorBoundary><EquipmentPage /></PageErrorBoundary>} />
          <Route path="/computers" element={<PageErrorBoundary><ComputersPage /></PageErrorBoundary>} />
          <Route path="/computer-parts" element={<PageErrorBoundary><ComputerPartsPage /></PageErrorBoundary>} />
          <Route path="/computer-repair" element={<PageErrorBoundary><ComputerRepairPage /></PageErrorBoundary>} />
          <Route path="/services" element={<PageErrorBoundary><ServicesPage /></PageErrorBoundary>} />
          <Route path="/stores" element={<PageErrorBoundary><StoresPage /></PageErrorBoundary>} />
          <Route path="/stores/:slug" element={<PageErrorBoundary><StoreProfilePage /></PageErrorBoundary>} />
          <Route path="/items/:slug" element={<PageErrorBoundary><ItemDetailsPage /></PageErrorBoundary>} />
          <Route path="/advertise" element={<PageErrorBoundary><AdvertisePage /></PageErrorBoundary>} />
          <Route path="/ads/request" element={<PageErrorBoundary><AdRequestPage /></PageErrorBoundary>} />
          <Route path="/publish-phone" element={
            <ProtectedRoute>
              <PageErrorBoundary><PublishPhonePage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/publish-computer" element={
            <ProtectedRoute>
              <PageErrorBoundary><PublishComputerPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/publish-computer-part" element={
            <ProtectedRoute>
              <PageErrorBoundary><PublishComputerPartPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/compare" element={<PageErrorBoundary><ComparePage /></PageErrorBoundary>} />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <PageErrorBoundary><FavoritesPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Test page for improved listing form */}
          <Route path="/test-listing-form" element={
            <ProtectedRoute>
              <PageErrorBoundary><TestCreateListingPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Legal Pages */}
          <Route path="/about" element={<PageErrorBoundary><AboutPage /></PageErrorBoundary>} />
          <Route path="/contact" element={<PageErrorBoundary><ContactPage /></PageErrorBoundary>} />
          <Route path="/faq" element={<PageErrorBoundary><FAQPage /></PageErrorBoundary>} />
          <Route path="/terms" element={<PageErrorBoundary><TermsPage /></PageErrorBoundary>} />
          <Route path="/privacy" element={<PageErrorBoundary><PrivacyPage /></PageErrorBoundary>} />

          {/* Auth Pages */}
          <Route path="/auth/login" element={<PageErrorBoundary><LoginPage /></PageErrorBoundary>} />
          <Route path="/auth/register" element={<PageErrorBoundary><RegisterPage /></PageErrorBoundary>} />
          <Route path="/auth/reset-password" element={<PageErrorBoundary><ResetPasswordPage /></PageErrorBoundary>} />
          <Route path="/auth/callback" element={<PageErrorBoundary><AuthCallbackPage /></PageErrorBoundary>} />
          <Route path="/auth/select-account-type" element={
            <ProtectedRoute>
              <PageErrorBoundary><AccountTypeSelectionPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Admin Dashboard - Protected with RoleGuard */}
          <Route path="/admin" element={
            <AdminGuard>
              <PageErrorBoundary><AdminDashboard /></PageErrorBoundary>
            </AdminGuard>
          } />
          <Route path="/admin/dashboard" element={
            <AdminGuard>
              <PageErrorBoundary><AdminDashboard /></PageErrorBoundary>
            </AdminGuard>
          } />

          {/* Agent Dashboard - Protected with RoleGuard */}
          <Route path="/agent" element={
            <AgentGuard>
              <PageErrorBoundary><AgentDashboard /></PageErrorBoundary>
            </AgentGuard>
          } />

          {/* Merchant Dashboard - Protected with RoleGuard */}
          <Route path="/merchant" element={
            <MerchantGuard>
              <PageErrorBoundary><MerchantDashboard /></PageErrorBoundary>
            </MerchantGuard>
          } />

          {/* User Dashboard - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageErrorBoundary><DashboardPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/my-store" element={
            <ProtectedRoute>
              <PageErrorBoundary><MyStorePage /></PageErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/create-item" element={
            <ProtectedRoute>
              <PageErrorBoundary><CreateItemPage /></PageErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Error Pages */}
          <Route path="/unauthorized" element={<PageErrorBoundary><UnauthorizedPage /></PageErrorBoundary>} />

          {/* 404 Page for unknown routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ComparisonFloatingButton />
      <Toaster />
    </div>
  );
}

function App() {
  // Show env error fallback if required environment variables are missing
  if (!isEnvValid()) {
    return <EnvErrorFallback />;
  }

  return (
    <GlobalErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ComparisonProvider>
            <FavoritesProvider>
              <AppContent />
            </FavoritesProvider>
          </ComparisonProvider>
        </AuthProvider>
      </LanguageProvider>
    </GlobalErrorBoundary>
  );
}

export default App;