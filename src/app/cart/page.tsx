// src/app/cart/page.tsx
"use client";

import { useCartStore } from "@/domains/cart/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import CheckoutForm from "@/domains/cart/components/CheckoutForm";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalPrice = items.reduce((total, item) => {
    const price = item.discount_price ?? item.price;
    return total + price * item.quantity;
  }, 0);

  // حالة السلة الفارغة (Clean State)
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">سلة المشتريات فارغة</h1>
        <p className="text-gray-500 mb-8 max-w-md text-lg">
          لم تقم بإضافة أي منتجات إلى السلة بعد. تصفح أحدث عروضنا واكتشف منتجاتنا المميزة.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للتسوق</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">
      
      <div className="text-center pt-6 pb-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">مراجعة الطلب</h1>
        <p className="text-gray-500 mt-3">تأكد من المنتجات المختارة قبل إتمام عملية الشراء.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* قائمة المنتجات في السلة */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">المنتجات ({items.length})</h2>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 md:gap-6 group">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 p-2">
                    <Image
                      src={item.image_urls?.[0] || "https://placehold.co/100"}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <Link href={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-gray-600 transition-colors line-clamp-1 text-lg">
                      {item.title}
                    </Link>
                    <div className="text-sm font-medium text-gray-500 mt-1">
                      الكمية: {item.quantity}
                    </div>
                  </div>
                  
                  <div className="text-left shrink-0">
                    <div className="font-black text-gray-900 text-lg mb-2">
                      {(item.discount_price ?? item.price) * item.quantity} $
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center justify-end gap-1 ml-auto opacity-70 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      إزالة
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-500 text-lg">المجموع الكلي:</span>
              <span className="text-3xl font-black text-gray-900">
                {totalPrice} $
              </span>
            </div>
          </div>
        </div>

        {/* نموذج إتمام الطلب (Checkout) */}
        <div className="lg:col-span-5">
          <CheckoutForm />
        </div>
        
      </div>
    </div>
  );
}