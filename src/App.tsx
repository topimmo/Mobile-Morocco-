import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import VendorDashboard from "./components/dashboards/VendorDashboard";
import { 
  HomePage, 
  ProductPage, 
  VendorProfilePage, 
  CategoryPage, 
  SearchResultsPage, 
  RegisterPage, 
  SiteMapPage, 
  StoresPage, 
  ServicesPage,
  LoginPage,
  ProfilePage,
  ForgotPasswordPage,
  AdminDashboardPage,
  ComparisonPage
} from "./components/pages";
import { AdsProvider } from "./lib/ads-context";

function App() {
  return (
    <AdsProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Chargement...</p></div>}>
        <div className="dark">
          <Routes>
            <Route path="/sitemap" element={<SiteMapPage />} />
            <Route path="/dashboard" element={<VendorDashboard />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/phones" element={<CategoryPage />} />
            <Route path="/phone-parts" element={<CategoryPage />} />
            <Route path="/computers" element={<CategoryPage />} />
            <Route path="/computer-parts" element={<CategoryPage />} />
            <Route path="/equipment" element={<CategoryPage />} />
            <Route path="/listing/:id" element={<ProductPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/repair/phones" element={<ServicesPage />} />
            <Route path="/repair/computers" element={<ServicesPage />} />
            <Route path="/seller/:id" element={<VendorProfilePage />} />
            <Route path="/vendor/:id" element={<VendorProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </Suspense>
    </AdsProvider>
  );
}

export default App;
