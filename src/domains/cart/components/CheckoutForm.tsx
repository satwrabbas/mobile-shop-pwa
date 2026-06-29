// src/domains/cart/components/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "../store";
import { createOrderAction } from "@/domains/orders/actions";
import { Loader2, CheckCircle2, Store, Truck, MessageCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { STORE_NAME, STORE_PHONE, STORE_WHATSAPP } from "@/lib/store-contact";

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
      <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100 shadow-sm">
        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-500 mb-8">
          رقم الطلب الخاص بك: <br />
          <span className="font-mono bg-gray-50 px-3 py-1.5 rounded-lg text-lg text-gray-900 font-bold mt-2 inline-block border border-gray-100">
            {orderId?.slice(0, 8)}
          </span>
        </p>
        
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(`مرحباً ${STORE_NAME}، قمت بإنشاء طلب جديد برقم: ${orderId?.slice(0, 8)}\nيرجى تأكيد الطلب.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            تأكيد عبر واتساب
          </a>
          <Link href="/" className="w-full bg-gray-50 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors active:scale-95 border border-gray-200">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
      <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">بيانات التوصيل والدفع</h2>
      
      {/* اختيار طريقة الاستلام (ستايل أسود أنيق) */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setDeliveryMethod("delivery")}
          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
            deliveryMethod === "delivery" 
              ? "border-gray-900 bg-gray-900 text-white" 
              : "border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
          }`}
        >
          <Truck className="w-6 h-6" />
          <span className="font-bold text-sm">توصيل للمنزل</span>
        </button>
        <button
          type="button"
          onClick={() => setDeliveryMethod("pickup")}
          className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all ${
            deliveryMethod === "pickup" 
              ? "border-gray-900 bg-gray-900 text-white" 
              : "border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
          }`}
        >
          <Store className="w-6 h-6" />
          <span className="font-bold text-sm">استلام من المحل</span>
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">الاسم الكريم</label>
          <input
            type="text"
            name="customer_name"
            required
            className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all"
            placeholder="أدخل اسمك بالكامل"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            name="customer_phone"
            required
            className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all text-left"
            dir="ltr"
            placeholder={`مثال: ${STORE_PHONE}`}
          />
        </div>

        {deliveryMethod === "delivery" && (
          <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
            <label className="text-sm font-bold text-gray-700">عنوان التوصيل بالتفصيل</label>
            <textarea
              name="address"
              required
              rows={3}
              className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all resize-none"
              placeholder="المدينة، المنطقة، القطعة، الشارع، رقم المنزل..."
            ></textarea>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-5 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95 text-lg shadow-md shadow-gray-900/20"
      >
        {isPending ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري تأكيد الطلب...</span>
          </>
        ) : (
          `تأكيد الطلب (${totalPrice} $) - الدفع عند الاستلام`
        )}
      </button>
    </form>
  );
}