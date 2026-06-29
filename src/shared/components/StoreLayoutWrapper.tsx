// src/shared/components/StoreLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";

export default function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // التحقق مما إذا كان الرابط هو لوحة الإدارة
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* الترويسة تظهر فقط إذا لم نكن في لوحة الإدارة */}
      {!isAdmin && <Header />}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* زر الواتساب يظهر فقط إذا لم نكن في لوحة الإدارة */}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}