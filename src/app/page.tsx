// src/app/page.tsx
import { getProducts } from "@/domains/products/queries";
import ProductCard from "@/domains/products/components/ProductCard";

// تحديث الصفحة كل 60 ثانية في حال تمت إضافة منتجات جديدة (ISR)
export const revalidate = 60; 

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-10">
      {/* بانر الترحيب */}
      <section className="bg-blue-600 text-white rounded-3xl p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">أهلاً بك في مركز الباسل</h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
          اكتشف أحدث الهواتف الذكية وأفضل الإكسسوارات بأسعار لا تقبل المنافسة.
        </p>
      </section>

      {/* قائمة المنتجات */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-blue-600 pr-3">
            أحدث المنتجات
          </h2>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">لا توجد منتجات مضافة حالياً في المتجر.</p>
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