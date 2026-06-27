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
  addBundle: (mainProduct: Product, accessoryProduct: Product, bundlePrice: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      // الدالة الجديدة لإضافة حزمة (منتجين معاً بسعر مخفض)
      addBundle: (mainProduct, accessoryProduct, bundlePrice) => {
        set((state) => {
          const mainPrice = mainProduct.discount_price ?? mainProduct.price;
          // حساب السعر المتبقي للإكسسوار بعد خصم سعر الهاتف من إجمالي الحزمة
          const accessoryBundlePrice = bundlePrice - mainPrice;

          // تعديل الإكسسوار ليكون سعره هو السعر المخفض داخل الحزمة
          const discountedAccessory = {
            ...accessoryProduct,
            discount_price: accessoryBundlePrice > 0 ? accessoryBundlePrice : 0,
            title: `${accessoryProduct.title} (عرض الحزمة)`
          };

          // استخدام منطق الإضافة مرتين (للهاتف وللإكسسوار المخفض)
          let newItems = [...state.items];
          
          // إضافة الهاتف
          const existingMain = newItems.find((i) => i.id === mainProduct.id);
          if (existingMain) existingMain.quantity += 1;
          else newItems.push({ ...mainProduct, quantity: 1 });

          // إضافة الإكسسوار المخفض (نجعل له ID مختلف قليلاً لكي لا يندمج مع الإكسسوار العادي لو تم طلبه لوحده)
          const bundleAccId = `bundle-${accessoryProduct.id}`;
          const existingAcc = newItems.find((i) => i.id === bundleAccId);
          if (existingAcc) existingAcc.quantity += 1;
          else newItems.push({ ...discountedAccessory, id: bundleAccId, quantity: 1 });

          return { items: newItems };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'mobile-shop-cart',
    }
  )
);