// src/domains/products/components/SmartBundle.tsx
"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/domains/cart/store";
import { Product } from "../types";
import toast from "react-hot-toast";

interface SmartBundleProps {
  mainProduct: Product;
  bundle: {
    bundle_price: number;
    accessory: Product;
  };
}

export default function SmartBundle({ mainProduct, bundle }: SmartBundleProps) {
  const addBundle = useCartStore((state) => state.addBundle);

  const mainPrice = mainProduct.discount_price ?? mainProduct.price;
  const accessoryPrice = bundle.accessory.discount_price ?? bundle.accessory.price;
  const oldTotalPrice = mainPrice + accessoryPrice;
  const savings = oldTotalPrice - bundle.bundle_price;

  const handleAddBundle = () => {
    addBundle(mainProduct, bundle.accessory, bundle.bundle_price);
    toast.success("تمت إضافة الحزمة الذكية للسلة، استمتع بالخصم!", {
      icon: '🎁',
      duration: 3500,
    });
  };

  return (
    <div className="mt-16 bg-white border border-blue-100 shadow-sm rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
      {/* خط ديكور علوي أزرق */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        
        <div className="flex-grow text-center lg:text-right">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            وفر {savings} $ مع هذه الحزمة
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4">اشترِ معاً ووفر أكثر</h3>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            احصل على <span className="font-bold text-gray-900">{bundle.accessory.title}</span> بسعر خيالي عند شرائه مع هذا الهاتف كحزمة متكاملة.
          </p>
          
          <div className="flex items-center justify-center lg:justify-start gap-6">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 p-3 relative">
              <Image src={mainProduct.image_urls?.[0] || 'https://placehold.co/100'} alt="phone" fill className="object-contain p-3" sizes="96px" />
            </div>
            <Plus className="w-8 h-8 text-gray-300" />
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 p-3 relative">
              <Image src={bundle.accessory.image_urls?.[0] || 'https://placehold.co/100'} alt="accessory" fill className="object-contain p-3" sizes="96px" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center min-w-[280px] w-full lg:w-auto">
          <div className="text-gray-400 line-through mb-2 font-medium">بدلاً من {oldTotalPrice} $</div>
          <div className="text-4xl font-black text-blue-600 mb-8">{bundle.bundle_price} $</div>
          
          <button 
            onClick={handleAddBundle}
            className="w-full font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white active:scale-95"
          >
            إضافة الحزمة للسلة
          </button>
        </div>

      </div>
    </div>
  );
}