// src/app/cart/page.tsx
"use client";

import { useCartStore } from "@/domains/cart/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
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
    return total + (price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">السلة فارغة</h1>
        <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للتسوق</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-blue-600 pr-3">مراجعة الطلب</h1>
      
      {/* قائمة المنتجات في السلة */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
              <Image 
                src={item.image_urls?.[0] || 'https://placehold.co/100'} 
                alt={item.title} 
                fill 
                sizes="80px" 
                className="object-cover" 
              />
            </div>
            <div className="flex-grow">
              <Link href={`/product/${item.id}`} className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">
                {item.title}
              </Link>
              <div className="text-sm text-gray-500 mt-1">الكمية: {item.quantity}</div>
            </div>
            <div className="font-bold text-gray-900">
              {(item.discount_price ?? item.price) * item.quantity} د.ك
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center text-lg">
          <span className="font-bold text-gray-700">المجموع الكلي:</span>
          <span className="text-2xl font-bold text-blue-700">{totalPrice} د.ك</span>
        </div>
      </div>

      {/* نموذج إتمام الطلب */}
      <CheckoutForm />
      
    </div>
  );
}