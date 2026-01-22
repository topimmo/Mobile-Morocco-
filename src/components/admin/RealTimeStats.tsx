import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Eye,
  DollarSign,
  Activity,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  impressions: number;
  conversionRate: number;
}

const RealTimeStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 10234,
    activeUsers: 1456,
    totalProducts: 5678,
    totalOrders: 892,
    revenue: 456789,
    impressions: 125678,
    conversionRate: 3.2,
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        setStats((prev) => ({
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
          impressions: prev.impressions + Math.floor(Math.random() * 50),
          totalOrders: prev.totalOrders + (Math.random() > 0.7 ? 1 : 0),
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const statCards = [
    {
      title: "Utilisateurs Totaux",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Utilisateurs Actifs",
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "En direct",
      changeType: "neutral" as const,
    },
    {
      title: "Produits",
      value: stats.totalProducts.toLocaleString(),
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Commandes",
      value: stats.totalOrders.toLocaleString(),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Revenu (MAD)",
      value: stats.revenue.toLocaleString(),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Impressions",
      value: stats.impressions.toLocaleString(),
      icon: Eye,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: `${stats.conversionRate}% CVR`,
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Statistiques en Temps Réel</h2>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          />
          <span className="text-sm text-gray-600">
            {isLive ? "En direct" : "Pause"}
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            {isLive ? "Pause" : "Reprendre"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <Badge
                    variant={
                      stat.changeType === "positive"
                        ? "default"
                        : (stat.changeType as string) === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RealTimeStats;
