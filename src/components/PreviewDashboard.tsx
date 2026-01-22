import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PreviewDashboard() {
  const routes = [
    { name: "Home", path: "/" },
    { name: "Advertisers", path: "/advertisers" },
    { name: "Technicians", path: "/technicians" },
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Admin - Influencers", path: "/admin/influencers" },
    { name: "Payment Instructions", path: "/payment-instructions" },
    { name: "Subscription Comparison", path: "/subscription-comparison" },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Preview Dashboard</h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preview Dashboard</CardTitle>
          <CardDescription>
            Use this dashboard to navigate to all available pages in the
            application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <Link key={route.path} to={route.path}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                >
                  {route.name}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
