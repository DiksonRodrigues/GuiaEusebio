"use client";

import { MessageCircle } from "lucide-react";
import { track } from "@/lib/track";

type Props = {
  whatsapp: string;
  businessId: string;
  className?: string;
};

export default function WhatsAppButton({ whatsapp, businessId, className }: Props) {
  function handleClick() {
    track("whatsapp_click", { business_id: businessId });
  }

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      <MessageCircle size={20} /> WhatsApp
    </a>
  );
}
