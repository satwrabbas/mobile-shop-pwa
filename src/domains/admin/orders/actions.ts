// src/domains/admin/orders/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// استخدام مفتاح المدير لتخطي الحماية وجلب كل طلبات المتجر
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAdminOrders() {
  try {
    // جلب الطلبات بالإضافة إلى تفاصيل المنتجات المرتبطة بها
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          quantity,
          price_at_purchase,
          products (
            title
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return { success: true, orders: data };
  } catch (error: any) {
    console.error("Get Orders Error:", error);
    return { success: false, orders: [] };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) throw error;

    // تحديث الكاش لكي تظهر الحالة الجديدة فوراً
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    return { success: false, error: error.message };
  }
}