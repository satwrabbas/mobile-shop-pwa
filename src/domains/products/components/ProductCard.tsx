// src/domains/products/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // إذا لم تكن هناك صورة، نعرض صورة افتراضية
  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : 'https://placehold.co/300x400/eeeeee/999999?text=No+Image';
    
  // التحقق مما إذا كان هناك تخفيض صالح
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* صورة المنتج */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] bg-gray-50 overflow-hidden block">
        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            تخفيض
          </div>
        )}
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* تفاصيل المنتج */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mt-1">{product.brand}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600">{product.discount_price} د.ك</span>
                <span className="text-xs text-gray-400 line-through">{product.price} د.ك</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">{product.price} د.ك</span>
            )}
          </div>
          
          <button 
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}