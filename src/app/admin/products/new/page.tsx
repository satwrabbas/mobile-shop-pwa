// src/app/admin/products/new/page.tsx
import AddProductForm from "@/domains/admin/components/AddProductForm";
import Link from "next/link";
import { ChevronLeft, PackagePlus } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            العودة لقائمة المنتجات
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <PackagePlus className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">إضافة منتج جديد</h1>
              <p className="text-gray-500 mt-1">
                أنشئ منتجاً احترافياً مع تخصيص كامل للمواصفات والتسعير والصور
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddProductForm />
    </div>
  );
}
