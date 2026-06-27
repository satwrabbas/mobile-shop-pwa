// src/domains/products/components/AddToCartButton.tsx
"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/domains/cart/store";
import { Product } from "../types";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    
    // إعادة الزر لشكله الطبيعي بعد ثانيتين
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
        isAdded 
          ? "bg-green-500 text-white" 
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-6 h-6 animate-bounce" />
          <span>تمت الإضافة للسلة بنجاح!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-6 h-6" />
          <span>إضافة إلى السلة</span>
        </>
      )}
    </button>
  );
}