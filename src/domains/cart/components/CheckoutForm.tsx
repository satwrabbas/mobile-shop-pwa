// src/domains/cart/components/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "../store";
import { createOrderAction } from "@/domains/orders/actions";
import { Loader2, CheckCircle2, Store, Truck } from "lucide-react";
import Link from "next/link";

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
      clearCart(); // إفراغ السلة بعد نجاح الطلب
    } else {
      alert("حدث خطأ أثناء إنشاء الطلب، يرجى المحاولة مرة أخرى.");
    }
    
    setIsPending(false);
  };

  // واجهة النجاح
  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-green-100 shadow-sm mt-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-600 mb-6">رقم الطلب الخاص بك: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{orderId?.slice(0,8)}</span></p>
        
        <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  // واجهة الدفع
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">بيانات الاستلام</h2>
      
      {/* اختيار طريقة الاستلام */}
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
          <input type="text" name="customer_name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="أدخل اسمك" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
          <input type="tel" name="customer_phone" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="رقم للتواصل" />
        </div>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-700">عنوان التوصيل بالتفصيل</label>
          <textarea name="address" required rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="المدينة، المنطقة، القطعة، الشارع، رقم المنزل..."></textarea>
        </div>
      )}

      <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري تأكيد الطلب...</span>
          </>
        ) : (
          `تأكيد الطلب (${totalPrice} د.ك) - الدفع عند الاستلام`
        )}
      </button>
    </form>
  );
}