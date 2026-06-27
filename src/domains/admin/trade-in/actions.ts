// src/domains/admin/trade-in/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// جلب جميع طلبات الاستبدال
export async function getAdminTradeInRequests() {
  try {
    const { data, error } = await supabaseAdmin
      .from("trade_in_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return { success: true, requests: data };
  } catch (error: any) {
    console.error("Get Trade-In Requests Error:", error);
    return { success: false, requests: [] };
  }
}

// تحديث حالة الطلب (وإضافة السعر التقديري إن وجد)
export async function updateTradeInStatus(requestId: string, newStatus: string, estimatedValue?: number) {
  try {
    const updateData: any = { status: newStatus };
    if (estimatedValue !== undefined) {
      updateData.estimated_value = estimatedValue;
    }

    const { error } = await supabaseAdmin
      .from("trade_in_requests")
      .update(updateData)
      .eq("id", requestId);

    if (error) throw error;

    revalidatePath("/admin/trade-in");
    return { success: true };
  } catch (error: any) {
    console.error("Update Trade-In Status Error:", error);
    return { success: false, error: error.message };
  }
}