// src/domains/products/queries.ts
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Product } from "./types";

// 1. دالة جلب المنتجات (الآن تدعم البحث والتصنيف)
export async function getProducts(searchQuery?: string, category?: string): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // تفعيل فلتر التصنيف (إذا كان موجوداً ولا يساوي 'all')
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // تفعيل فلتر البحث بالاسم أو العلامة التجارية (غير حساس لحالة الأحرف)
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("خطأ في جلب المنتجات:", error.message);
    return [];
  }

  return data as Product[];
}

// 2. دالة جلب منتج واحد (لصفحة تفاصيل المنتج)
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
// 3. دالة جلب الحزم الذكية المرتبطة بالمنتج
export async function getProductBundles(productId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('bundles')
    .select(`
      id,
      bundle_price,
      accessory:accessory_product_id (*)
    `)
    .eq('main_product_id', productId);

  if (error || !data) return [];
  
  // نعيد صياغة البيانات ونخبر TypeScript أن الإكسسوار هو من نوع Product
  return data.map((bundle: any) => ({
    id: bundle.id,
    bundle_price: bundle.bundle_price,
    // إذا رجعت البيانات كمصفوفة نأخذ العنصر الأول، وإلا نأخذها كما هي
    accessory: (Array.isArray(bundle.accessory) ? bundle.accessory[0] : bundle.accessory) as Product
  }));
}