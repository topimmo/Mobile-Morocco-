import { useState, useEffect } from "react";
import { Upload, CreditCard, Clock, MapPin, Megaphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StickyNav from "./StickyNav";
import Footer from "./Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type Placement = "homepage" | "category" | "city";
type Duration = 7 | 15 | 30;

type Category = {
  id: string;
  name: string;
  slug: string;
};

type City = {
  id: string;
  name: string;
  slug: string;
};

const placements = [
  { id: "homepage" as Placement, name: "Homepage", description: "Maximum visibility on the main page", price: 500 },
  { id: "category" as Placement, name: "Category Page", description: "Target specific product categories", price: 300 },
  { id: "city" as Placement, name: "City Page", description: "Target users in specific cities", price: 200 },
];

const durations = [
  { days: 7 as Duration, discount: 0 },
  { days: 15 as Duration, discount: 10 },
  { days: 30 as Duration, discount: 20 },
];

export default function AdvertisementForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [placement, setPlacement] = useState<Placement>("homepage");
  const [duration, setDuration] = useState<Duration>(7);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesRes, citiesRes] = await Promise.all([
        supabase.from("categories").select("id, name, slug").neq("slug", "repair-shops").order("name"),
        supabase.from("cities").select("id, name, slug").order("name"),
      ]);
      setCategories(categoriesRes.data || []);
      setCities(citiesRes.data || []);
    };
    fetchData();
  }, []);

  const selectedPlacement = placements.find(p => p.id === placement);
  const selectedDuration = durations.find(d => d.days === duration);
  const basePrice = selectedPlacement?.price || 0;
  const discount = selectedDuration?.discount || 0;
  const finalPrice = basePrice * (duration / 7) * (1 - discount / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!user) {
      navigate("/login");
      return;
    }

    if (!imageFile || !receiptFile) {
      setError("Please upload both ad image and payment receipt");
      return;
    }

    setSubmitting(true);

    try {
      const timestamp = Date.now();
      const imageExt = imageFile.name.split(".").pop();
      const receiptExt = receiptFile.name.split(".").pop();
      const imagePath = `ads/${user.id}/${timestamp}.${imageExt}`;
      const receiptPath = `receipts/${user.id}/${timestamp}.${receiptExt}`;

      const [imageUpload, receiptUpload] = await Promise.all([
        supabase.storage.from("advertisements").upload(imagePath, imageFile),
        supabase.storage.from("advertisements").upload(receiptPath, receiptFile),
      ]);

      if (imageUpload.error) throw imageUpload.error;
      if (receiptUpload.error) throw receiptUpload.error;

      const imageUrl = supabase.storage.from("advertisements").getPublicUrl(imagePath).data.publicUrl;
      const receiptUrl = supabase.storage.from("advertisements").getPublicUrl(receiptPath).data.publicUrl;

      const { error: insertError } = await supabase.from("advertisements").insert({
        user_id: user.id,
        title,
        description,
        image_url: imageUrl,
        link_url: linkUrl || null,
        placement,
        category_id: placement === "category" ? selectedCategory : null,
        city_id: placement === "city" ? selectedCity : null,
        duration_days: duration,
        price: finalPrice,
        payment_receipt_url: receiptUrl,
        status: "pending",
      });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting advertisement:", err);
      setError(err.message || "Failed to submit advertisement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <StickyNav variant="dark" />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-dark-card rounded-2xl border border-dark-border p-12">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Megaphone className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl font-syne font-extrabold mb-4">
                Advertisement Submitted!
              </h1>
              <p className="text-text-secondary font-grotesk mb-8">
                Your advertisement has been submitted for review. Our team will verify your payment receipt and activate your ad within 24-48 hours.
              </p>
              <div className="bg-yellow/10 border border-yellow/30 rounded-xl p-4 mb-8">
                <p className="text-yellow font-grotesk text-sm">
                  <strong>Important:</strong> Your ad will remain pending until we confirm your bank transfer payment.
                </p>
              </div>
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-orange hover:bg-orange/90 font-grotesk"
              >
                Submit Another Ad
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <StickyNav variant="dark" />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-syne font-extrabold mb-4">
              Create Advertisement
            </h1>
            <p className="text-text-secondary font-grotesk text-lg">
              Promote your products or services to thousands of Moroccan buyers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ad Details */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
              <h2 className="text-xl font-syne font-bold mb-6">Ad Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Ad Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Premium Phone Store - Best Prices"
                    className="w-full h-12 px-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief description of your ad..."
                    className="w-full px-4 py-3 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Link URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://your-website.com"
                    className="w-full h-12 px-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Ad Image *
                  </label>
                  <div className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center hover:border-orange transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="ad-image"
                      required
                    />
                    <label htmlFor="ad-image" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-text-secondary mx-auto mb-3" />
                      <p className="text-text-secondary font-grotesk">
                        {imageFile ? imageFile.name : "Click to upload ad image"}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Recommended: 1200x628px (PNG, JPG)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Placement Selection */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
              <h2 className="text-xl font-syne font-bold mb-6">Ad Placement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {placements.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlacement(p.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      placement === p.id
                        ? "border-orange bg-orange/10"
                        : "border-dark-border hover:border-text-secondary"
                    }`}
                  >
                    <h3 className="font-syne font-bold mb-1">{p.name}</h3>
                    <p className="text-text-secondary text-sm font-grotesk mb-2">
                      {p.description}
                    </p>
                    <p className="text-orange font-mono font-bold">
                      {p.price} MAD/week
                    </p>
                  </button>
                ))}
              </div>

              {/* Category/City Selection */}
              {placement === "category" && (
                <div className="mt-4">
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk"
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {placement === "city" && (
                <div className="mt-4">
                  <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                    Select City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk"
                  >
                    <option value="">Choose a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Duration Selection */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
              <h2 className="text-xl font-syne font-bold mb-6">Duration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {durations.map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setDuration(d.days)}
                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                      duration === d.days
                        ? "border-orange bg-orange/10"
                        : "border-dark-border hover:border-text-secondary"
                    }`}
                  >
                    {d.discount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-success text-white border-0">
                        -{d.discount}%
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-orange" />
                      <span className="font-syne font-bold">{d.days} Days</span>
                    </div>
                    <p className="text-text-secondary text-sm font-grotesk">
                      {d.discount > 0 ? `Save ${d.discount}%` : "Standard rate"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
              <h2 className="text-xl font-syne font-bold mb-6">Payment</h2>
              
              {/* Price Summary */}
              <div className="bg-dark-secondary rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary font-grotesk">Placement</span>
                  <span className="font-grotesk">{selectedPlacement?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary font-grotesk">Duration</span>
                  <span className="font-grotesk">{duration} days</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary font-grotesk">Discount</span>
                    <span className="text-success font-grotesk">-{discount}%</span>
                  </div>
                )}
                <div className="border-t border-dark-border pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-syne font-bold">Total</span>
                    <span className="text-2xl font-mono font-bold text-orange">
                      {finalPrice.toFixed(0)} MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Info */}
              <div className="bg-yellow/10 border border-yellow/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-6 h-6 text-yellow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-syne font-bold text-yellow mb-2">
                      Payment via Bank Transfer
                    </h3>
                    <p className="text-text-secondary text-sm font-grotesk mb-3">
                      Please transfer the total amount to the following account:
                    </p>
                    <div className="bg-dark-bg rounded-lg p-3 font-mono text-sm">
                      <p><span className="text-text-secondary">Bank:</span> Attijariwafa Bank</p>
                      <p><span className="text-text-secondary">Account:</span> 007 810 0001234567890 12</p>
                      <p><span className="text-text-secondary">Name:</span> MobileMorocco SARL</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-grotesk">
                  Upload Payment Receipt *
                </label>
                <div className="border-2 border-dashed border-dark-border rounded-xl p-6 text-center hover:border-orange transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="receipt"
                    required
                  />
                  <label htmlFor="receipt" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary font-grotesk">
                      {receiptFile ? receiptFile.name : "Upload bank transfer receipt"}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 font-grotesk">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-orange hover:bg-orange/90 font-syne font-bold text-lg rounded-xl disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Advertisement"
              )}
            </Button>

            <p className="text-center text-text-secondary text-sm font-grotesk">
              Your ad will be reviewed and activated within 24-48 hours after payment verification.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
