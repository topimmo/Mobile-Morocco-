import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  getAllInfluencers,
  addSampleInfluencers,
  Influencer,
} from "@/services/influencerService";
import { useToast } from "@/components/ui/use-toast";

export default function InfluencerList() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingInfluencers, setAddingInfluencers] = useState(false);
  const { toast } = useToast();

  const loadInfluencers = async () => {
    setLoading(true);
    try {
      const data = await getAllInfluencers();
      setInfluencers(data);
    } catch (error) {
      console.error("Error loading influencers:", error);
      toast({
        title: "Error",
        description: "Failed to load influencers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfluencers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSampleInfluencers = async () => {
    setAddingInfluencers(true);
    try {
      const count = await addSampleInfluencers();
      toast({
        title: "Success",
        description: `Added ${count} influencers to the database`,
      });
      loadInfluencers();
    } catch (error) {
      console.error("Error adding sample influencers:", error);
      toast({
        title: "Error",
        description: "Failed to add sample influencers",
        variant: "destructive",
      });
    } finally {
      setAddingInfluencers(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Influencer Management</h2>
        <Button
          onClick={handleAddSampleInfluencers}
          disabled={addingInfluencers}
        >
          {addingInfluencers ? "Adding..." : "Add Sample Influencers"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading influencers...</div>
      ) : influencers.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">No influencers found in the database.</p>
          <p>Click the button above to add sample influencers.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>
            List of influencers for marketing campaigns
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers.map((influencer) => (
              <TableRow key={influencer.id}>
                <TableCell className="font-medium">
                  {influencer.name}
                  {influencer.is_verified && (
                    <span className="ml-1 text-blue-500">✓</span>
                  )}
                </TableCell>
                <TableCell>{influencer.platform}</TableCell>
                <TableCell>
                  {formatNumber(influencer.followers_count)}
                </TableCell>
                <TableCell>{influencer.engagement_rate}%</TableCell>
                <TableCell>{influencer.niche || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={influencer.is_active ? "default" : "outline"}>
                    {influencer.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
