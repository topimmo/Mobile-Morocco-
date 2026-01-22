import { Link } from "react-router-dom";
import StickyNav from "@/components/marketplace/StickyNav";
import Footer from "@/components/marketplace/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <StickyNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none font-grotesk">
            <p className="text-text-secondary text-lg mb-8">
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">1. Acceptance of Terms</h2>
              <p className="text-text-secondary mb-4">
                By accessing and using MobileMorocco ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">2. Platform Description</h2>
              <p className="text-text-secondary mb-4">
                MobileMorocco is a marketplace platform that connects buyers and sellers of mobile devices, computers, accessories, spare parts, and repair services in Morocco. 
              </p>
              <div className="bg-yellow/10 border border-yellow/30 rounded-xl p-4 mb-4">
                <p className="text-yellow font-medium">
                  <strong>Important:</strong> MobileMorocco does NOT process payments. We are solely a platform for discovery and connection between buyers and sellers.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>Provide accurate and truthful information in listings</li>
                <li>Not post fraudulent, misleading, or illegal content</li>
                <li>Respect other users and maintain professional conduct</li>
                <li>Verify products before completing any transaction</li>
                <li>Meet in safe, public locations for transactions</li>
                <li>Not use the platform for any illegal activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">4. Listing Guidelines</h2>
              <p className="text-text-secondary mb-4">
                All listings must:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>Include accurate descriptions and specifications</li>
                <li>Feature real photos of the actual product</li>
                <li>Display honest pricing in Moroccan Dirhams (MAD)</li>
                <li>Clearly state the condition (New/Used)</li>
                <li>Not include prohibited items (stolen goods, counterfeit products, etc.)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">5. Limitation of Liability</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-400">
                  MobileMorocco is NOT responsible for:
                </p>
                <ul className="list-disc list-inside text-text-secondary mt-2 space-y-1">
                  <li>Any transactions between users</li>
                  <li>Quality, safety, or legality of listed items</li>
                  <li>Accuracy of listings or user information</li>
                  <li>Any disputes between buyers and sellers</li>
                  <li>Any financial losses resulting from transactions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">6. Account Termination</h2>
              <p className="text-text-secondary mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms, post fraudulent content, or engage in harmful behavior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">7. Changes to Terms</h2>
              <p className="text-text-secondary mb-4">
                We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">8. Contact</h2>
              <p className="text-text-secondary">
                For questions about these terms, contact us at: <a href="mailto:legal@mobilemorocco.ma" className="text-orange hover:underline">legal@mobilemorocco.ma</a>
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/privacy" className="text-orange hover:underline font-grotesk">
              Privacy Policy →
            </Link>
            <Link to="/disclaimer" className="text-orange hover:underline font-grotesk">
              Disclaimer →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
