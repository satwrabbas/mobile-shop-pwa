// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/domains/admin/auth/actions";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      // إعادة التوجيه للوحة الطلبات عند النجاح
      router.push("/admin/orders");
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ ما");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
          <p className="text-gray-500 mt-2">قم بتسجيل الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" placeholder="admin@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
            <input type="password" name="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 mt-4">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}