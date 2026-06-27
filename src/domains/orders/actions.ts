// src/domains/orders/actions.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CartItem } from "../cart/store";

interface OrderData {
  customer_name: string;
  customer_phone: string;
  delivery_method: "delivery" | "pickup";
  address: string;
  total_price: number;
  items: CartItem[];
}

export async function createOrderAction(data: OrderData) {
  const supabase = await createServerSupabaseClient();

  try {
    // 1. إدراج الطلب الأساسي في جدول orders
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        delivery_method: data.delivery_method,
        address: data.delivery_method === "delivery" ? data.address : null,
        total_price: data.total_price,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error("فشل إنشاء الطلب: " + orderError?.message);
    }

    // 2. تجهيز مصفوفة تفاصيل الطلب (المنتجات)
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.discount_price ?? item.price,
    }));

    // 3. إدراج المنتجات في جدول order_items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error("فشل حفظ منتجات الطلب: " + itemsError.message);
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return { success: false, error: error.message };
  }
}