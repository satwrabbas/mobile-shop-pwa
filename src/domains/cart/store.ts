// src/domains/cart/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../products/types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // إضافة منتج للسلة
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            // إذا كان المنتج موجوداً مسبقاً، نزيد العدد فقط
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          // إذا كان منتجاً جديداً، نضيفه بعدد 1
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      // إزالة منتج من السلة
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      // إفراغ السلة بالكامل
      clearCart: () => set({ items: [] }),

      // حساب إجمالي عدد المنتجات لعرضه في الترويسة
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'mobile-shop-cart', // اسم الملف في الـ LocalStorage
    }
  )
);