// src/domains/products/components/AddToCartIcon.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/domains/cart/store";
import { Product } from "../types";
import toast from "react-hot-toast";

export default function AddToCartIcon({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // يمنع فتح صفحة المنتج عند الضغط على الزر
    e.stopPropagation(); 
    addItem(product);
    toast.success(`تمت إضافة ${product.title} للسلة!`, {
      icon: '🛒',
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors active:scale-95"
      aria-label="أضف إلى السلة"
    >
      <ShoppingCart className="w-5 h-5" />
    </button>
  );
}