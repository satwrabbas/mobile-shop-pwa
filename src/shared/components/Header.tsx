// src/shared/components/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/domains/cart/store';
import { useEffect, useState } from 'react';
import InstallPWA from './InstallPWA';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* زر القائمة للهواتف */}
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
          <Menu className="w-6 h-6" />
        </button>

        {/* الشعار والاسم */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* هنا استخدمنا أيقونة الـ PWA كشعار للموقع */}
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm">
            <Image 
              src="/icon-192x192.png" 
              alt="شعار المتجر" 
              fill 
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-blue-600 tracking-tight">
            مركز الباسل
          </span>
        </Link>

        {/* روابط التنقل للشاشات الكبيرة */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
          <Link href="/offers" className="hover:text-blue-600 transition-colors">العروض</Link>
          <Link href="/trade-in" className="hover:text-blue-600 transition-colors">استبدال الأجهزة</Link>
        </nav>

        {/* قسم الأزرار (السلة وزر التثبيت) */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <InstallPWA />

          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          
        </div>

      </div>
    </header>
  );
}