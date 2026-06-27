// src/domains/trade-in/actions.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

interface TradeInRequestData {
  customer_name: string;
  customer_phone: string;
  device_model: string;
  device_condition: string;
}

export async function createTradeInRequest(data: TradeInRequestData) {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase
      .from("trade_in_requests")
      .insert({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        device_model: data.device_model,
        device_condition: data.device_condition,
        status: "pending",
      });

    if (error) {
      throw new Error("فشل إرسال الطلب: " + error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Trade-In Error:", error);
    return { success: false, error: error.message };
  }
}