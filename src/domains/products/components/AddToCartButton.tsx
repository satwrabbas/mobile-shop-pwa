// src/domains/products/components/AddToCartButton.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/domains/cart/store";
import { Product } from "../types";
import toast from "react-hot-toast"; // استيراد دالة الإشعار

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    
    // إطلاق الإشعار المنبثق
    toast.success(`تمت إضافة ${product.title} للسلة بنجاح!`, {
      icon: '🛒',
      duration: 3000,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
    >
      <ShoppingCart className="w-6 h-6" />
      <span>إضافة إلى السلة</span>
    </button>
  );
}