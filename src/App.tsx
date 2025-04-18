import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components for better performance
const AdvertiserSection = lazy(() => import("./components/AdvertiserSection"));
const TechnicianListing = lazy(() => import("./components/TechnicianListing"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const PaymentInstructions = lazy(
  () => import("./components/PaymentInstructions"),
);
const SubscriptionComparison = lazy(
  () => import("./components/SubscriptionComparison"),
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advertisers" element={<AdvertiserSection />} />
          <Route path="/technicians" element={<TechnicianListing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/payment-instructions"
            element={<PaymentInstructions />}
          />
          <Route
            path="/subscription-comparison"
            element={<SubscriptionComparison />}
          />
          {/* Add more routes here as needed */}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
