import { Link } from "react-router-dom";
import StickyNav from "@/components/marketplace/StickyNav";
import Footer from "@/components/marketplace/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <StickyNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none font-grotesk">
            <p className="text-text-secondary text-lg mb-8">
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">1. Information We Collect</h2>
              <p className="text-text-secondary mb-4">
                We collect information you provide directly to us:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>Account information (name, email, phone number)</li>
                <li>Listing information (product details, images, location)</li>
                <li>Communication data between users</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>To provide and maintain our platform</li>
                <li>To facilitate connections between buyers and sellers</li>
                <li>To send important notifications about your account</li>
                <li>To improve our services and user experience</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">3. Information Sharing</h2>
              <p className="text-text-secondary mb-4">
                We do not sell your personal information. We may share information:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>With other users as part of the marketplace functionality</li>
                <li>With service providers who assist our operations</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">4. Data Security</h2>
              <p className="text-text-secondary mb-4">
                We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">5. Your Rights</h2>
              <p className="text-text-secondary mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">6. Cookies</h2>
              <p className="text-text-secondary mb-4">
                We use cookies and similar technologies to improve your experience, analyze usage, and personalize content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">7. Contact Us</h2>
              <p className="text-text-secondary">
                For privacy-related questions, contact us at: <a href="mailto:privacy@mobilemorocco.ma" className="text-orange hover:underline">privacy@mobilemorocco.ma</a>
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/terms" className="text-orange hover:underline font-grotesk">
              Terms of Service →
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
