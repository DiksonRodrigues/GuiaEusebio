"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export default function BusinessTracker({ businessId }: { businessId: string }) {
  useEffect(() => {
    track("page_view_business", { business_id: businessId });
  }, [businessId]);

  return null;
}
