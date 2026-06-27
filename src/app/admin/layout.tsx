// src/app/admin/layout.tsx
import AdminNav from "@/domains/admin/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AdminNav />
      {/* هنا سيتم عرض محتوى صفحات الإدارة (الطلبات، إضافة منتج، الخ) */}
      <main>{children}</main>
    </div>
  );
}