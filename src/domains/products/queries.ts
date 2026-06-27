// src/domains/products/queries.ts
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  
  // جلب جميع المنتجات وترتيبها من الأحدث للأقدم
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("خطأ في جلب المنتجات:", error.message);
    return [];
  }

  return data as Product[];

  
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("خطأ في جلب تفاصيل المنتج:", error.message);
    return null;
  }

  return data as Product;
}