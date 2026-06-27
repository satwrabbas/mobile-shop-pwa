// src/domains/admin/dashboard/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getDashboardStats() {
  try {
    // 1. إجمالي المبيعات (نجمع أسعار الطلبات المكتملة فقط)
    const { data: salesData } = await supabaseAdmin
      .from("orders")
      .select("total_price")
      .eq("status", "completed");

    const totalSales = salesData?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0;

    // 2. عدد طلبات الشراء قيد الانتظار
    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // 3. عدد طلبات الاستبدال قيد المراجعة
    const { count: pendingTradeIns } = await supabaseAdmin
      .from("trade_in_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // 4. إجمالي المنتجات في المتجر
    const { count: totalProducts } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    return {
      success: true,
      stats: {
        totalSales,
        pendingOrders: pendingOrders || 0,
        pendingTradeIns: pendingTradeIns || 0,
        totalProducts: totalProducts || 0,
      }
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { success: false, stats: null };
  }
}