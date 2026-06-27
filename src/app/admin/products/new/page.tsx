// src/app/admin/products/new/page.tsx
import AddProductForm from "@/domains/admin/components/AddProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
        <p className="text-gray-500 mt-2">
          قم بإدخال بيانات المنتج. سيقوم النظام تلقائياً بضغط الصورة المرفوعة لضمان سرعة الموقع.
        </p>
      </div>
      
      <AddProductForm />
    </div>
  );
}