// src/app/offers/page.tsx
import { getProducts } from "@/domains/products/queries";
import ProductCard from "@/domains/products/components/ProductCard";

export const revalidate = 60; 

export default async function OffersPage() {
  const allProducts = await getProducts();
  
  // فلترة المنتجات التي تحتوي على سعر تخفيض وأقل من السعر الأصلي
  const offers = allProducts.filter(
    (product) => product.discount_price !== null && product.discount_price < product.price
  );
  

  return (
    <div className="space-y-8">
      <div className="bg-red-50 text-red-700 rounded-3xl p-8 text-center border border-red-100">
        <h1 className="text-3xl font-bold mb-2">عروض حصرية 🔥</h1>
        <p className="text-red-600">اغتنم الفرصة واحصل على أفضل الأجهزة بأسعار مخفضة لفترة محدودة.</p>
      </div>

      <section>
        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            لا توجد عروض حالياً، عد قريباً!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}