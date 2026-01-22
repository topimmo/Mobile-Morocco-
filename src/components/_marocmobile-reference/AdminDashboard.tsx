import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  Megaphone, 
  BarChart3, 
  Settings,
  Eye,
  MousePointer,
  ShoppingBag,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Trash2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TabType = "overview" | "products" | "shops" | "ads" | "stats" | "settings";

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

// Mock data
const stats: StatCard[] = [
  { label: "Total Views", value: "125,847", change: "+12.5%", icon: <Eye className="w-6 h-6" />, color: "text-blue-400" },
  { label: "Total Clicks", value: "45,234", change: "+8.3%", icon: <MousePointer className="w-6 h-6" />, color: "text-green-400" },
  { label: "Active Listings", value: "3,456", change: "+5.2%", icon: <ShoppingBag className="w-6 h-6" />, color: "text-orange" },
  { label: "Active Users", value: "8,234", change: "+15.7%", icon: <Users className="w-6 h-6" />, color: "text-purple-400" },
];

const pendingProducts = [
  { id: "1", title: "iPhone 14 Pro 256GB", seller: "Ahmed M.", price: "9,500 MAD", date: "2 hours ago", image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=100&q=80" },
  { id: "2", title: "MacBook Air M2", seller: "Sara K.", price: "14,500 MAD", date: "5 hours ago", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&q=80" },
  { id: "3", title: "Samsung Galaxy S24", seller: "Youssef B.", price: "11,200 MAD", date: "1 day ago", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&q=80" },
];

const pendingAds = [
  { id: "1", title: "Premium Phone Store", placement: "Homepage", duration: "30 days", price: "500 MAD", date: "3 hours ago" },
  { id: "2", title: "Tech Repair Services", placement: "Category", duration: "15 days", price: "250 MAD", date: "1 day ago" },
];

const pendingShops = [
  { id: "1", name: "TechFix Pro", city: "Casablanca", services: ["Screen Repair", "Battery"], date: "4 hours ago" },
  { id: "2", name: "Mobile Doctor", city: "Rabat", services: ["iPhone Repair", "Samsung"], date: "2 days ago" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "products" as TabType, label: "Products", icon: <Package className="w-5 h-5" />, badge: pendingProducts.length },
    { id: "shops" as TabType, label: "Repair Shops", icon: <Store className="w-5 h-5" />, badge: pendingShops.length },
    { id: "ads" as TabType, label: "Advertisements", icon: <Megaphone className="w-5 h-5" />, badge: pendingAds.length },
    { id: "stats" as TabType, label: "Statistics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "settings" as TabType, label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-dark-card border-r border-dark-border p-4 fixed left-0 top-0">
          <div className="mb-8">
            <h1 className="text-xl font-syne font-extrabold text-orange">
              Admin Panel
            </h1>
            <p className="text-text-secondary text-sm font-grotesk">MobileMorocco</p>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-grotesk transition-colors ${
                  activeTab === tab.id
                    ? "bg-orange text-white"
                    : "text-text-secondary hover:bg-dark-secondary hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge && tab.badge > 0 && (
                  <Badge className="bg-red-500 text-white border-0 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-syne font-bold">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-64 h-10 pl-12 pr-4 bg-dark-secondary rounded-xl border border-dark-border focus:border-orange focus:outline-none font-grotesk text-sm"
              />
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className={stat.color}>{stat.icon}</div>
                      <Badge className="bg-success/20 text-success border-0 text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-3xl font-mono font-bold mb-1">{stat.value}</p>
                    <p className="text-text-secondary text-sm font-grotesk">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Pending Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Products */}
                <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-syne font-bold">Pending Products</h3>
                    <Badge className="bg-yellow/20 text-yellow border-0">
                      {pendingProducts.length} pending
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {pendingProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-dark-secondary rounded-xl">
                        <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-grotesk font-medium truncate">{product.title}</p>
                          <p className="text-text-secondary text-sm">{product.seller} • {product.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-success/20 text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Ads */}
                <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-syne font-bold">Pending Ads</h3>
                    <Badge className="bg-yellow/20 text-yellow border-0">
                      {pendingAds.length} pending
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {pendingAds.map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 p-3 bg-dark-secondary rounded-xl">
                        <div className="w-12 h-12 rounded-lg bg-orange/20 flex items-center justify-center">
                          <Megaphone className="w-6 h-6 text-orange" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-grotesk font-medium truncate">{ad.title}</p>
                          <p className="text-text-secondary text-sm">{ad.placement} • {ad.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-success/20 text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-secondary">
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Product</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Seller</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Price</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Status</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProducts.map((product) => (
                    <tr key={product.id} className="border-b border-dark-border hover:bg-dark-secondary/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-grotesk">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 font-grotesk text-text-secondary">{product.seller}</td>
                      <td className="p-4 font-mono font-bold text-orange">{product.price}</td>
                      <td className="p-4">
                        <Badge className="bg-yellow/20 text-yellow border-0">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-success hover:bg-success/90 h-8">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white h-8">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ads Tab */}
          {activeTab === "ads" && (
            <div className="space-y-6">
              <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border bg-dark-secondary">
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Ad Title</th>
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Placement</th>
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Duration</th>
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Price</th>
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Status</th>
                      <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAds.map((ad) => (
                      <tr key={ad.id} className="border-b border-dark-border hover:bg-dark-secondary/50">
                        <td className="p-4 font-grotesk">{ad.title}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-dark-border">
                            {ad.placement}
                          </Badge>
                        </td>
                        <td className="p-4 font-grotesk text-text-secondary">{ad.duration}</td>
                        <td className="p-4 font-mono font-bold text-orange">{ad.price}</td>
                        <td className="p-4">
                          <Badge className="bg-yellow/20 text-yellow border-0">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-success hover:bg-success/90 h-8">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-yellow text-yellow hover:bg-yellow hover:text-dark-bg h-8">
                              <Pause className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white h-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Shops Tab */}
          {activeTab === "shops" && (
            <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border bg-dark-secondary">
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Shop Name</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">City</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Services</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Status</th>
                    <th className="p-4 text-left font-grotesk font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingShops.map((shop) => (
                    <tr key={shop.id} className="border-b border-dark-border hover:bg-dark-secondary/50">
                      <td className="p-4 font-grotesk font-medium">{shop.name}</td>
                      <td className="p-4 font-grotesk text-text-secondary">{shop.city}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {shop.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="border-dark-border text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-yellow/20 text-yellow border-0">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-success hover:bg-success/90 h-8">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white h-8">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className={stat.color}>{stat.icon}</div>
                      <Badge className="bg-success/20 text-success border-0 text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-3xl font-mono font-bold mb-1">{stat.value}</p>
                    <p className="text-text-secondary text-sm font-grotesk">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                <h3 className="text-lg font-syne font-bold mb-4">Analytics Overview</h3>
                <div className="h-64 flex items-center justify-center text-text-secondary">
                  <p className="font-grotesk">Chart visualization would go here</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-dark-card rounded-2xl border border-dark-border p-6">
                <h3 className="text-lg font-syne font-bold mb-4">Content Control</h3>
                <div className="space-y-4">
                  {["Featured Ads Section", "Latest Products", "Repair Shops Directory", "Category Grid"].map((section) => (
                    <div key={section} className="flex items-center justify-between p-4 bg-dark-secondary rounded-xl">
                      <span className="font-grotesk">{section}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
