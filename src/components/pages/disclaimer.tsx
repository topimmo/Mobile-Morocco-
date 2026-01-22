import { Link } from "react-router-dom";
import { AlertTriangle, Shield, CreditCard, Users } from "lucide-react";
import StickyNav from "@/components/marketplace/StickyNav";
import Footer from "@/components/marketplace/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <StickyNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <AlertTriangle className="w-12 h-12 text-yellow" />
            <h1 className="text-4xl md:text-5xl font-syne font-extrabold">
              Disclaimer
            </h1>
          </div>
          
          <div className="prose prose-invert max-w-none font-grotesk">
            <p className="text-text-secondary text-lg mb-8">
              Please read this disclaimer carefully before using MobileMorocco.
            </p>

            {/* Main Warning Box */}
            <div className="bg-yellow/10 border-2 border-yellow rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <CreditCard className="w-8 h-8 text-yellow flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-syne font-bold text-yellow mb-2">
                    No Payment Processing
                  </h2>
                  <p className="text-text-secondary">
                    MobileMorocco is a <strong className="text-white">marketplace platform only</strong>. We do NOT process, handle, or facilitate any payments between users. All financial transactions occur directly between buyers and sellers outside of our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Responsibility */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-syne font-bold text-red-400 mb-2">
                    Transaction Responsibility
                  </h2>
                  <p className="text-text-secondary mb-4">
                    MobileMorocco is <strong className="text-white">NOT responsible</strong> for:
                  </p>
                  <ul className="list-disc list-inside text-text-secondary space-y-2">
                    <li>Any transactions between users</li>
                    <li>The quality, safety, legality, or authenticity of listed items</li>
                    <li>The accuracy of product descriptions or images</li>
                    <li>The ability of sellers to sell items or buyers to pay</li>
                    <li>Any disputes, claims, or damages arising from transactions</li>
                    <li>Lost, stolen, or damaged items during exchange</li>
                    <li>Fraudulent listings or scams</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Responsibility */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-orange flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-syne font-bold text-orange mb-2">
                    Your Responsibility
                  </h2>
                  <p className="text-text-secondary mb-4">
                    As a user, you are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-text-secondary space-y-2">
                    <li>Verifying the identity of other users</li>
                    <li>Inspecting products before purchase</li>
                    <li>Ensuring safe meeting locations</li>
                    <li>Conducting due diligence on all transactions</li>
                    <li>Reporting suspicious activity to authorities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-success">Safety Tips</h2>
              <div className="bg-success/10 border border-success/30 rounded-2xl p-6">
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Always meet in public, well-lit places</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Bring a friend or family member to meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Inspect products thoroughly before paying</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Verify IMEI numbers for phones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Never share personal financial information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>Trust your instincts - if something feels wrong, walk away</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Notice */}
            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">Legal Notice</h2>
              <p className="text-text-secondary mb-4">
                By using MobileMorocco, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2">
                <li>You use the platform at your own risk</li>
                <li>We provide the service "as is" without warranties</li>
                <li>We are not liable for any direct, indirect, or consequential damages</li>
                <li>You will not hold MobileMorocco responsible for any losses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-syne font-bold mb-4 text-orange">Contact</h2>
              <p className="text-text-secondary">
                To report fraud or suspicious activity: <a href="mailto:report@mobilemorocco.ma" className="text-orange hover:underline">report@mobilemorocco.ma</a>
              </p>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/terms" className="text-orange hover:underline font-grotesk">
              Terms of Service →
            </Link>
            <Link to="/privacy" className="text-orange hover:underline font-grotesk">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
