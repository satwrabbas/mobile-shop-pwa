// src/shared/components/Header.tsx
"use client"; // مهم جداً: هذا يخبر Next.js أن هذا المكون يعمل في المتصفح

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/domains/cart/store';
import { useEffect, useState } from 'react';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  // لتجنب خطأ Hydration في Next.js مع الـ LocalStorage
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          موبايلي
        </Link>

        <nav className="hidden md:flex gap-6 font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
          <Link href="/offers" className="hover:text-blue-600">العروض</Link>
        </nav>

        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {mounted && totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
              {totalItems}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
}