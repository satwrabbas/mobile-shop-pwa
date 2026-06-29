// src/app/page.tsx
import { getProducts } from "@/domains/products/queries";
import ProductCard from "@/domains/products/components/ProductCard";
import { Smartphone, Sparkles } from "lucide-react";

// تحديث الصفحة كل 60 ثانية في حال تمت إضافة منتجات جديدة (ISR)
export const revalidate = 60; 

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-12 pb-10">
      
      {/* بانر الترحيب (الستايل الأبيض الجديد) */}
      <section className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-16 text-center shadow-sm">
        {/* خط ديكور علوي خفيف جداً لإضافة لمسة فنية */}
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

      {/* قائمة المنتجات */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-blue-600 pr-3 flex items-center gap-2">
            أحدث المنتجات
          </h2>
        </div>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
              <Smartphone className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد منتجات حالياً</h3>
            <p className="text-gray-500">نعمل على تحديث الكتالوج الخاص بنا، يرجى العودة قريباً!</p>
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