// src/app/cart/page.tsx
"use client";

import { useCartStore } from "@/domains/cart/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // تجنب خطأ Hydration

  const totalPrice = items.reduce((total, item) => {
    const price = item.discount_price ?? item.price;
    return total + (price * item.quantity);
  }, 0);

  const handleWhatsAppCheckout = () => {
    const orderDetails = items.map(item => `- ${item.title} (الكمية: ${item.quantity})`).join('%0A');
    const message = `مرحباً موبايلي، أود طلب المنتجات التالية:%0A${orderDetails}%0A%0Aالإجمالي: ${totalPrice} د.ك`;
    window.open(`https://wa.me/96500000000?text=${message}`, '_blank'); // استبدل الرقم برقمك
  };

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-blue-600 pr-3">سلة المشتريات</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
              <Image 
                src={item.image_urls?.[0] || 'https://placehold.co/100'} 
                alt={item.title} 
                fill 
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
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-gray-600">الإجمالي الكلي:</span>
          <span className="text-3xl font-bold text-blue-700 mr-2">{totalPrice} د.ك</span>
        </div>
        <button 
          onClick={handleWhatsAppCheckout}
          className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          الطلب عبر واتساب
        </button>
      </div>
    </div>
  );
}