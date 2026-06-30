// src/domains/admin/products/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. جلب منتج واحد للمدير
export async function getAdminProductById(productId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) throw error;
    return { success: true, product: data };
  } catch (error: unknown) {
    console.error("Get Admin Product Error:", error);
    return { success: false, product: null };
  }
}

// 2. جلب المنتجات للمدير
export async function getAdminProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, products: data };
  } catch (error: any) {
    console.error("Get Admin Products Error:", error);
    return { success: false, products: [] };
  }
}

// 2. تحديث بيانات المنتج (السعر، التخفيض، المخزون)
export async function updateProductQuickDetails(
  productId: string,
  price: number,
  discount_price: number | null,
  stock: number
) {
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ price, discount_price, stock })
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. حذف المنتج
export async function deleteProductAction(productId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      // 23503 هو كود الخطأ في PostgreSQL عند محاولة حذف شيء مرتبط بجدول آخر
      if (error.code === '23503') {
        throw new Error("لا يمكن حذف هذا المنتج لأنه مرتبط بطلبات سابقة. يرجى تصفير المخزون بدلاً من حذفه.");
      }
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}