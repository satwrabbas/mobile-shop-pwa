// src/domains/products/components/SmartBundle.tsx
"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/domains/cart/store";
import { Product } from "../types";

interface SmartBundleProps {
  mainProduct: Product;
  bundle: {
    bundle_price: number;
    accessory: Product;
  };
}

export default function SmartBundle({ mainProduct, bundle }: SmartBundleProps) {
  const addBundle = useCartStore((state) => state.addBundle);
  const [isAdded, setIsAdded] = useState(false);

  const mainPrice = mainProduct.discount_price ?? mainProduct.price;
  const accessoryPrice = bundle.accessory.discount_price ?? bundle.accessory.price;
  const oldTotalPrice = mainPrice + accessoryPrice;
  const savings = oldTotalPrice - bundle.bundle_price;

  const handleAddBundle = () => {
    addBundle(mainProduct, bundle.accessory, bundle.bundle_price);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex-grow">
          <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            وفر {savings} د.ك مع هذه الحزمة
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">اشترِ معاً ووفر أكثر!</h3>
          <p className="text-gray-600 mb-6">احصل على {bundle.accessory.title} بسعر خيالي عند شرائه مع هذا الهاتف.</p>
          
          <div className="flex items-center gap-4">
            {/* صورة الهاتف */}
            <div className="w-20 h-20 bg-white rounded-xl border border-gray-200 p-2 relative">
              <Image src={mainProduct.image_urls?.[0] || 'https://placehold.co/100'} alt="phone" fill className="object-contain p-2" />
            </div>
            
            <Plus className="w-6 h-6 text-blue-400" />
            
            {/* صورة الإكسسوار */}
            <div className="w-20 h-20 bg-white rounded-xl border border-gray-200 p-2 relative">
              <Image src={bundle.accessory.image_urls?.[0] || 'https://placehold.co/100'} alt="accessory" fill className="object-contain p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm text-center min-w-[250px]">
          <div className="text-gray-400 line-through mb-1">بدلاً من {oldTotalPrice} د.ك</div>
          <div className="text-3xl font-bold text-blue-700 mb-4">{bundle.bundle_price} د.ك</div>
          
          <button 
            onClick={handleAddBundle}
            disabled={isAdded}
            className={`w-full font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
              isAdded ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isAdded ? (
              <><Check className="w-5 h-5" /> تمت الإضافة</>
            ) : (
              "إضافة الحزمة للسلة"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}