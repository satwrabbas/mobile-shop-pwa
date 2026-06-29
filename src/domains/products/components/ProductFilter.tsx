// src/domains/products/components/ProductFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Smartphone, Headphones, LayoutGrid } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const currentCategory = searchParams.get("cat") || "all";
  const isFirstRender = useRef(true); // لكي نمنع الفلتر من العمل عند التحميل الأول

  useEffect(() => {
    // منع التحديث التلقائي في أول ثانية من تحميل الصفحة
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      // نأخذ القيم الحالية من الرابط مباشرة لكي لا نكسر التوجيه
      const params = new URLSearchParams(window.location.search);
      
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      
      router.replace(`/?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeoutId);
    // راقب كلمة البحث فقط! (تجاهلنا الباقي عمداً لمنع خطأ التوجيه)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category !== "all") {
      params.set("cat", category);
    } else {
      params.delete("cat");
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const categories = [
    { id: "all", name: "الكل", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "phone", name: "هواتف", icon: <Smartphone className="w-4 h-4" /> },
    { id: "accessory", name: "إكسسوارات", icon: <Headphones className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-5 pr-14 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-gray-900"
          placeholder="ابحث عن هاتف، سماعة، أو علامة تجارية..."
        />
      </div>

      <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${
              currentCategory === cat.id
                ? "bg-gray-900 text-white shadow-md border border-gray-900"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}