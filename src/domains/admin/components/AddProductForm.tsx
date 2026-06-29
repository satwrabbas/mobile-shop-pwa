// src/domains/admin/components/AddProductForm.tsx
"use client";

import { useState, useRef } from "react";
import { addProductAction } from "../actions";
import { ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AddProductForm() {
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // دالة لمعاينة الصورة عند اختيارها من الجهاز
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  // إزالة الصورة المختارة
  const removeImage = () => {
    setImagePreview(null);
    if (formRef.current) {
      const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await addProductAction(formData);

    if (result.success) {
      toast.success("تمت إضافة المنتج ومعالجة الصورة بنجاح!");
      formRef.current?.reset();
      setImagePreview(null); // مسح المعاينة بعد النجاح
    } else {
      toast.error(result.error || "حدث خطأ أثناء إضافة المنتج.");
    }

    setIsPending(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
    >
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
          <label className="text-sm font-medium text-gray-700">السعر ($)</label>
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
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative">
          <input
            type="file"
            name="image"
            accept="image/*"
            required={!imagePreview} // الصورة مطلوبة فقط إذا لم يتم اختيارها بعد
            className="hidden"
            id="product-image"
            onChange={handleImageChange}
          />
          
          {imagePreview ? (
            <div className="relative w-full max-w-[200px] aspect-[3/4] mx-auto rounded-lg overflow-hidden border border-gray-200">
              <Image src={imagePreview} alt="معاينة" fill className="object-cover" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center gap-2 py-6">
              <ImagePlus className="w-10 h-10 text-gray-400" />
              <span className="text-sm text-gray-600">اضغط هنا لاختيار صورة من جهازك</span>
              <span className="text-xs text-gray-400">سيتم ضغطها وتصغيرها تلقائياً</span>
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
      >
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