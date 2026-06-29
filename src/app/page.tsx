// src/app/page.tsx
import { getProducts } from "@/domains/products/queries";
import ProductCard from "@/domains/products/components/ProductCard";
import ProductFilter from "@/domains/products/components/ProductFilter";
import { Smartphone, Sparkles, SearchX } from "lucide-react";
import { Suspense } from "react"; // 1. استيراد Suspense

export const revalidate = 60; 

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const cat = typeof resolvedParams.cat === 'string' ? resolvedParams.cat : undefined;

  const products = await getProducts(q, cat);

  return (
    <div className="space-y-12 pb-10">
      
      <section className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-16 text-center shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-80"></div>
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-full mb-6">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 drop-shadow-sm">
          أهلاً بك في <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-700 to-cyan-500">مركز الباسل</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          اكتشف أحدث الهواتف الذكية وأفضل الإكسسوارات بأسعار لا تقبل المنافسة، مع ضمان الجودة وتجربة تسوق فريدة.
        </p>
      </section>

      <section>
        {/* 2. تغليف الفلتر لكي لا يعطل توجيه Next.js */}
        <Suspense fallback={<div className="h-32 w-full bg-gray-50 animate-pulse rounded-[1.5rem] mb-10"></div>}>
          <ProductFilter />
        </Suspense>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
              {q || cat ? <SearchX className="w-12 h-12" /> : <Smartphone className="w-12 h-12" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {q || cat ? "لم نجد نتائج مطابقة لبحثك" : "لا توجد منتجات حالياً"}
            </h3>
            <p className="text-gray-500">
              {q || cat ? "جرب البحث بكلمات أخرى أو قم بإزالة الفلتر." : "نعمل على تحديث الكتالوج الخاص بنا، يرجى العودة قريباً!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}