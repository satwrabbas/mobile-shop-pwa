// src/app/product/[id]/page.tsx
import { getProductById, getProductBundles } from "@/domains/products/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";
import AddToCartButton from "@/domains/products/components/AddToCartButton";
import SmartBundle from "@/domains/products/components/SmartBundle";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  // جلب تفاصيل المنتج
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // جلب الحزم الذكية المرتبطة بهذا المنتج (إن وجدت)
  const bundles = await getProductBundles(product.id);
  const firstBundle = bundles?.[0]; // نأخذ العرض الأول فقط لعرضه

  const imageUrl =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : "https://placehold.co/600x800/eeeeee/999999?text=No+Image";

  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;

  return (
    <div className="space-y-8">
      {/* البطاقة الرئيسية للمنتج */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* قسم الصورة */}
          <div className="relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {hasDiscount && (
              <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                تخفيض خاص
              </div>
            )}
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* قسم التفاصيل */}
          <div className="flex flex-col">
            <div className="mb-2 text-blue-600 font-semibold text-sm">
              {product.brand}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="mb-6 pb-6 border-b border-gray-100">
              {hasDiscount ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-red-600">
                    {product.discount_price} $
                  </span>
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {product.price} $
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  {product.price} $
                </span>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description || "لا يوجد وصف متاح لهذا المنتج."}
            </p>

            {/* المواصفات إن وجدت */}
            {product.specs && (
              <div className="mb-8 bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">
                  المواصفات الرئيسية:
                </h3>
                <ul className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex items-center text-gray-600 text-sm"
                    >
                      <span className="w-24 font-medium text-gray-800 capitalize">
                        {key}:
                      </span>
                      <span>{String(value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* أزرار الإجراءات والمميزات */}
            <div className="mt-auto space-y-4">
              <AddToCartButton product={product} />

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>ضمان الوكيل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>توصيل سريع</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* عرض الحزمة الذكية إن وجدت (تظهر أسفل البطاقة الرئيسية) */}
      {firstBundle && firstBundle.accessory && (
        <SmartBundle
          mainProduct={product}
          bundle={{
            bundle_price: firstBundle.bundle_price,
            accessory: firstBundle.accessory,
          }}
        />
      )}
    </div>
  );
}
