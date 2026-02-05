import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditItemPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigateTo = useNavigate();

  useEffect(() => {
    // For now, redirect to publish page with edit parameter
    // This avoids duplicating the entire form
    // PublishPhonePage can be enhanced to detect edit mode and prefill data
    if (itemId) {
      // Redirect to create page with edit context
      // Future enhancement: detect item type and redirect to appropriate publish page
      navigateTo(`/publish-phone?edit=${itemId}`, { replace: true });
    } else {
      navigateTo("/dashboard/my-listings", { replace: true });
    }
  }, [itemId, navigateTo]);

  return null;
}
