// src/app/admin/products/page.tsx
import { getAdminProducts } from "@/domains/admin/products/actions";
import AdminProductsList from "@/domains/admin/components/AdminProductsList";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const { products } = await getAdminProducts();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-gray-500 mt-2">
            تعديل الأسعار، الخصومات، أو حذف المنتجات.
          </p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>منتج جديد</span>
        </Link>
      </div>
      
      {products && products.length > 0 ? (
        <AdminProductsList initialProducts={products} />
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
          لا توجد منتجات حالياً.
        </div>
      )}
    </div>
  );
}