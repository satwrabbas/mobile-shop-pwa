// src/domains/products/types.ts

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: 'phone' | 'accessory';
  brand: string | null;
  stock: number;
  specs: Record<string, any> | null;
  image_urls: string[] | null;
  created_at: string;
}