// src/domains/admin/components/AddProductForm.tsx
"use client";

import { useState, useRef } from "react";
import { addProductAction } from "../actions";
import { ImagePlus, Loader2, CheckCircle2 } from "lucide-react";

export default function AddProductForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const result = await addProductAction(formData);

    if (result.success) {
      setStatus({ type: "success", message: "تمت إضافة المنتج ومعالجة الصورة بنجاح!" });
      formRef.current?.reset(); // تفريغ الحقول بعد النجاح
    } else {
      setStatus({ type: "error", message: result.error || "حدث خطأ غير معروف." });
    }
    
    setIsPending(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      
      {status.type && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {status.type === "success" && <CheckCircle2 className="w-5 h-5" />}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">اسم المنتج</label>
          <input type="text" name="title" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: iPhone 15" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">العلامة التجارية</label>
          <input type="text" name="brand" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: Apple" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">السعر (د.ك)</label>
          <input type="number" step="0.01" name="price" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">سعر التخفيض (اختياري)</label>
          <input type="number" step="0.01" name="discount_price" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">القسم</label>
        <select name="category" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="phone">هواتف</option>
          <option value="accessory">إكسسوارات</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">الوصف</label>
        <textarea name="description" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="اكتب وصفاً مفصلاً للمنتج..."></textarea>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">صورة المنتج</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
          <input type="file" name="image" accept="image/*" required className="hidden" id="product-image" />
          <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center gap-2">
            <ImagePlus className="w-10 h-10 text-gray-400" />
            <span className="text-sm text-gray-600">اضغط هنا لاختيار صورة من جهازك</span>
            <span className="text-xs text-gray-400">سيتم ضغطها وتصغيرها تلقائياً</span>
          </label>
        </div>
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري الرفع والمعالجة...</span>
          </>
        ) : (
          "إضافة المنتج"
        )}
      </button>
    </form>
  );
}