// src/shared/components/WhatsAppButton.tsx
"use client";

import { MessageCircle } from "lucide-react";
import { STORE_PHONE, STORE_WHATSAPP } from "@/lib/store-contact";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${STORE_WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label={`تواصل مع ${STORE_PHONE} عبر واتساب`}
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        واتساب {STORE_PHONE}
      </span>
    </a>
  );
}