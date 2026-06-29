// src/app/trade-in/page.tsx
"use client";

import { useState } from "react";
import { createTradeInRequest } from "@/domains/trade-in/actions";
import { Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { STORE_PHONE } from "@/lib/store-contact";

export default function TradeInPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    
    const result = await createTradeInRequest({
      customer_name: formData.get("customer_name") as string,
      customer_phone: formData.get("customer_phone") as string,
      device_model: formData.get("device_model") as string,
      device_condition: formData.get("device_condition") as string,
    });

    if (result.success) {
      setIsSuccess(true);
      toast.success("تم إرسال الطلب بنجاح!");
    } else {
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    }
    
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 mt-10">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">تم استلام طلبك بنجاح</h2>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          سيقوم فريقنا بتقييم جهازك والتواصل معك في أقرب وقت لتقديم أفضل سعر استبدال.
        </p>
        <Link href="/" className="inline-block bg-gray-900 text-white font-bold py-4 px-10 rounded-xl hover:bg-black transition-colors active:scale-95">
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-12">
      
      {/* الترويسة الأنيقة */}
      <div className="text-center space-y-6 pt-8">
        <div className="inline-flex items-center justify-center p-4 bg-gray-50 text-gray-900 rounded-2xl mb-2 border border-gray-100">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">استبدال الأجهزة</h1>
        <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          هل ترغب في ترقية هاتفك؟ املأ النموذج أدناه وسنقوم بتقييم جهازك القديم وإعطائك خصماً لاستبداله بجهاز جديد.
        </p>
      </div>

      {/* النموذج الفاخر */}
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 opacity-50"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">الاسم الكريم</label>
            <input type="text" name="customer_name" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all" placeholder="أدخل اسمك" />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
            <input type="tel" name="customer_phone" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all text-left" dir="ltr" placeholder={`مثال: ${STORE_PHONE}`} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">نوع الجهاز وموديله (القديم)</label>
          <input type="text" name="device_model" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all" placeholder="مثال: iPhone 13 Pro Max" />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">حالة الجهاز</label>
          <select name="device_condition" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-all appearance-none">
            <option value="ممتاز (كالجديد)">ممتاز (كالجديد)</option>
            <option value="جيد (خدوش بسيطة)">جيد (خدوش بسيطة)</option>
            <option value="متوسط (خدوش واضحة)">متوسط (خدوش واضحة)</option>
            <option value="شاشة مكسورة">شاشة مكسورة ولكن يعمل</option>
          </select>
        </div>

        <button type="submit" disabled={isPending} className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-5 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95 text-lg mt-4">
          {isPending ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>جاري إرسال الطلب...</span>
            </>
          ) : (
            "إرسال الطلب للتقييم"
          )}
        </button>
      </form>
    </div>
  );
}