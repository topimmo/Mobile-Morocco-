import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportProductProps {
  productId: string;
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
}

export interface ReportData {
  productId: string;
  reason: string;
  additionalNotes: string;
}

const reportReasons = [
  { value: "unavailable", label: "Product no longer available" },
  { value: "fake_info", label: "Fake information" },
  { value: "inappropriate_images", label: "Inappropriate images" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "wrong_category", label: "Listed in wrong category" },
  { value: "spam", label: "Spam or misleading" },
  { value: "other", label: "Other reason" },
];

const ReportProduct = ({
  productId,
  productTitle,
  isOpen,
  onClose,
  onSubmit,
}: ReportProductProps) => {
  const [reason, setReason] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!reason) return;

    setIsSubmitting(true);

    // Prepare report data
    const reportData: ReportData = {
      productId,
      reason,
      additionalNotes,
    };

    // Submit the report
    onSubmit(reportData);

    // Reset form and close dialog
    setTimeout(() => {
      setReason("");
      setAdditionalNotes("");
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setReason("");
    setAdditionalNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product-title" className="text-sm font-medium">
              Product
            </Label>
            <p id="product-title" className="text-sm text-gray-500">
              {productTitle}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for reporting *
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Please provide any additional details..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportProduct;
