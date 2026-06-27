// src/app/trade-in/page.tsx
"use client";

import { useState } from "react";
import { createTradeInRequest } from "@/domains/trade-in/actions";
import { Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";

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
    } else {
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    }
    
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-10 shadow-sm border border-green-100 mt-10">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          سيقوم فريقنا بتقييم جهازك والتواصل معك في أقرب وقت لتقديم أفضل سعر استبدال.
        </p>
        <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4 bg-blue-50 rounded-3xl p-8 border border-blue-100">
        <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-900">استبدال الأجهزة القديمة</h1>
        <p className="text-gray-600 text-lg">
          هل ترغب في ترقية هاتفك؟ املأ النموذج أدناه وسنقوم بتقييم جهازك القديم وإعطائك خصماً لاستبداله بجهاز جديد من متجرنا.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">الاسم الكريم</label>
            <input type="text" name="customer_name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="أدخل اسمك" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
            <input type="tel" name="customer_phone" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: 90000000" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">نوع الجهاز وموديله (الجهاز القديم)</label>
          <input type="text" name="device_model" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: iPhone 13 Pro Max" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">حالة الجهاز</label>
          <select name="device_condition" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="ممتاز (كالجديد)">ممتاز (كالجديد)</option>
            <option value="جيد (خدوش بسيطة)">جيد (خدوش بسيطة)</option>
            <option value="متوسط (خدوش واضحة)">متوسط (خدوش واضحة)</option>
            <option value="شاشة مكسورة">شاشة مكسورة ولكن يعمل</option>
          </select>
        </div>

        <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
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