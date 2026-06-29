// src/app/offers/page.tsx
import { getProducts } from "@/domains/products/queries";
import ProductCard from "@/domains/products/components/ProductCard";
import { Flame, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; 

export default async function OffersPage() {
  const allProducts = await getProducts();
  const offers = allProducts.filter(
    (product) => product.discount_price !== null && product.discount_price < product.price
  );

  return (
    <div className="space-y-12 pb-12">
      
      {/* البانر التسويقي (الستايل الأبيض الجديد) */}
      <section className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-16 text-center shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500 opacity-80"></div>
        
        <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-600 rounded-full mb-6">
          <Flame className="w-6 h-6" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 drop-shadow-sm">
          عروض <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-rose-400">حصرية</span>
        </h1>
        
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          اغتنم الفرصة الآن! وفر أكثر مع تشكيلتنا المختارة من الهواتف الذكية والإكسسوارات بأسعار تنافسية قبل نفاد الكمية.
        </p>
      </section>

      {/* قسم عرض المنتجات */}
      <section>
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
              <Tag className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد عروض حالياً</h3>
            <p className="text-gray-500 mb-6">نحن نقوم بتحديث عروضنا باستمرار. يرجى العودة لاحقاً!</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95">
              <ArrowRight className="w-5 h-5" />
              <span>العودة للمتجر</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-red-500 pr-3">
                المنتجات المخفضة
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {offers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}