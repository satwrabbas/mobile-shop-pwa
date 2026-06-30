import { ImagePlus, Eye } from "lucide-react";
import Image from "next/image";

export const MAX_IMAGES = 5;
export const MAX_DESC = 500;

export const BRAND_PRESETS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Huawei",
  "Oppo",
  "Realme",
  "Honor",
  "Google",
  "OnePlus",
];

export const PHONE_SPEC_TEMPLATES = [
  "التخزين",
  "الذاكرة",
  "الشاشة",
  "المعالج",
  "الكاميرا",
  "البطارية",
  "نظام التشغيل",
];
export const ACCESSORY_SPEC_TEMPLATES = [
  "النوع",
  "التوافق",
  "اللون",
  "المادة",
  "الطول",
  "الضمان",
];

export type TabId = "basic" | "pricing" | "specs" | "media";
export type Category = "phone" | "accessory";

export interface SpecRow {
  id: string;
  key: string;
  value: string;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function specsFromRecord(specs: Record<string, unknown> | null): SpecRow[] {
  if (!specs || Object.keys(specs).length === 0) {
    return [{ id: uid(), key: "", value: "" }];
  }
  return Object.entries(specs).map(([key, value]) => ({
    id: uid(),
    key,
    value: String(value),
  }));
}

export function isProductFormValid(params: {
  title: string;
  effectiveBrand: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  imageCount: number;
  specs: SpecRow[];
}): boolean {
  const numPrice = parseFloat(params.price);
  const numStock = parseInt(params.stock, 10);

  if (!params.title.trim()) return false;
  if (!params.effectiveBrand.trim()) return false;
  if (!params.description.trim()) return false;
  if (Number.isNaN(numPrice) || numPrice <= 0) return false;
  if (params.stock === "" || Number.isNaN(numStock) || numStock < 0) return false;
  if (params.imageCount === 0) return false;
  if (!params.specs.some((s) => s.key.trim() && s.value.trim())) return false;

  const discountRaw = params.discountPrice.trim();
  if (discountRaw) {
    const numDiscount = parseFloat(discountRaw);
    if (Number.isNaN(numDiscount) || numDiscount >= numPrice) return false;
  }

  return true;
}

export function ProductPreview({
  title,
  brand,
  price,
  discountPrice,
  imagePreview,
  category,
}: {
  title: string;
  brand: string;
  price: string;
  discountPrice: string;
  imagePreview: string | null;
  category: Category;
}) {
  const numPrice = parseFloat(price);
  const numDiscount = discountPrice ? parseFloat(discountPrice) : null;
  const hasDiscount =
    numDiscount !== null && !Number.isNaN(numDiscount) && numDiscount < numPrice;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-700">
        <Eye className="w-4 h-4 text-blue-600" />
        معاينة البطاقة
      </div>
      <div className="p-4">
        <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4">
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              تخفيض
            </div>
          )}
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="معاينة"
              fill
              className="object-cover"
              sizes="280px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
              <ImagePlus className="w-10 h-10" />
              <span className="text-xs">لا توجد صورة</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {title || "اسم المنتج"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{brand || "العلامة التجارية"}</p>
        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
          {category === "phone" ? "هاتف" : "إكسسوار"}
        </span>
        <div className="mt-4 pt-4 border-t border-gray-100">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-red-600">{numDiscount} $</span>
              <span className="text-sm text-gray-400 line-through">{numPrice} $</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {!Number.isNaN(numPrice) && numPrice > 0 ? `${numPrice} $` : "0 $"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
