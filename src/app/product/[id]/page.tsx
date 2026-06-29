// src/app/product/[id]/page.tsx
import { getProductById, getProductBundles } from "@/domains/products/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck, ChevronLeft } from "lucide-react";
import AddToCartButton from "@/domains/products/components/AddToCartButton";
import SmartBundle from "@/domains/products/components/SmartBundle";
import Link from "next/link";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const bundles = await getProductBundles(product.id);
  const firstBundle = bundles?.[0];

  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : 'https://placehold.co/600x800/eeeeee/999999?text=No+Image';
    
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

  return (
    <div className="space-y-12 pb-12">
      
      {/* زر العودة الصغير (Breadcrumb Style) */}
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        العودة للرئيسية
      </Link>

      <div className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* قسم الصورة (خلفية رمادية فاتحة جداً لإبراز حواف الهواتف البيضاء) */}
          <div className="relative aspect-[4/5] bg-gray-50/80 rounded-[2rem] overflow-hidden border border-gray-100 flex items-center justify-center p-8">
            {hasDiscount && (
              <div className="absolute top-6 right-6 z-10 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm">
                تخفيض حصري
              </div>
            )}
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* قسم التفاصيل (تصميم نظيف وأنيق) */}
          <div className="flex flex-col pt-2 md:pt-8">
            <div className="mb-3 text-blue-600 font-bold text-sm tracking-wider uppercase">
              {product.brand}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              {product.title}
            </h1>
            
            <div className="mb-8 pb-8 border-b border-gray-100">
              {hasDiscount ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-red-600">{product.discount_price} $</span>
                  <span className="text-xl text-gray-400 line-through mb-1.5">{product.price} $</span>
                </div>
              ) : (
                <span className="text-5xl font-black text-gray-900">{product.price} $</span>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {product.description || "لا يوجد وصف متاح لهذا المنتج."}
            </p>

            {/* المواصفات بأسلوب أنيق */}
            {product.specs && (
              <div className="mb-10 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">المواصفات الرئيسية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="block text-xs font-bold text-gray-500 uppercase mb-1">{key}</span>
                      <span className="block font-medium text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="mt-auto space-y-6">
              <AddToCartButton product={product} />
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span>ضمان الوكيل المعتمد</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span>شحن سريع وآمن</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* الحزمة الذكية */}
      {firstBundle && firstBundle.accessory && (
        <SmartBundle 
          mainProduct={product} 
          bundle={{
            bundle_price: firstBundle.bundle_price,
            accessory: firstBundle.accessory
          }} 
        />
      )}
    </div>
  );
}