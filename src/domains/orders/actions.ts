// src/domains/orders/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { CartItem } from "../cart/store";

interface OrderData {
  customer_name: string;
  customer_phone: string;
  delivery_method: "delivery" | "pickup";
  address: string;
  total_price: number;
  items: CartItem[];
}

// نستخدم مفتاح المدير هنا لأن الطلب يتم من زائر، ونحن نحتاج لاسترجاع رقم الطلب
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createOrderAction(data: OrderData) {
  try {
    // 1. إدراج الطلب الأساسي باستخدام مفتاح المدير
    const { data: order, error: orderError } = await supabaseAdmin
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
    const { error: itemsError } = await supabaseAdmin
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