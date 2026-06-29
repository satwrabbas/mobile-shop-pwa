// src/domains/cart/components/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "../store";
import { createOrderAction } from "@/domains/orders/actions";
import { Loader2, CheckCircle2, Store, Truck, MessageCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutForm() {
  const { items, clearCart } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const totalPrice = items.reduce((total, item) => {
    const price = item.discount_price ?? item.price;
    return total + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    const result = await createOrderAction({
      customer_name: formData.get("customer_name") as string,
      customer_phone: formData.get("customer_phone") as string,
      delivery_method: deliveryMethod,
      address: formData.get("address") as string,
      total_price: totalPrice,
      items: items,
    });

    if (result.success) {
      setIsSuccess(true);
      setOrderId(result.orderId || null);
      clearCart();
      toast.success("تم استلام طلبك بنجاح!");
    } else {
      toast.error(result.error || "حدث خطأ أثناء إنشاء الطلب.");
    }
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-green-100 shadow-sm mt-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-600 mb-6">رقم الطلب: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{orderId?.slice(0, 8)}</span></p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="inline-block bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors">
            العودة للرئيسية
          </Link>
          <a
            href={`https://wa.me/96500000000?text=${encodeURIComponent(`مرحباً مركز الباسل، قمت بإنشاء طلب جديد برقم: ${orderId?.slice(0,8)}\nيرجى تأكيد الطلب.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            تأكيد عبر واتساب
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">بيانات الاستلام</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={() => setDeliveryMethod("delivery")} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${deliveryMethod === "delivery" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
          <Truck className="w-6 h-6" />
          <span className="font-medium">توصيل للمنزل</span>
        </button>
        <button type="button" onClick={() => setDeliveryMethod("pickup")} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${deliveryMethod === "pickup" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
          <Store className="w-6 h-6" />
          <span className="font-medium">استلام من المحل</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">الاسم الكريم</label>
          <input type="text" name="customer_name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
          <input type="tel" name="customer_phone" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="space-y-2 animate-in fade-in">
          <label className="text-sm font-medium text-gray-700">عنوان التوصيل بالتفصيل</label>
          <textarea name="address" required rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
      )}

      <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : `تأكيد الطلب (${totalPrice} $) - الدفع عند الاستلام`}
      </button>
    </form>
  );
}