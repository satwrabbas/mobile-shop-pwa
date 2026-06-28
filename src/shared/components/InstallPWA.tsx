// src/shared/components/InstallPWA.tsx
"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. التحقق مما إذا كان التطبيق يفتح من الشاشة الرئيسية (مثبت بالفعل)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }

    // 2. التقاط حدث جاهزية التثبيت من المتصفح
    const handleBeforeInstallPrompt = (e: Event) => {
      // منع المتصفح من إظهار رسالته الافتراضية المزعجة
      e.preventDefault();
      // حفظ الحدث لاستخدامه عند ضغط العميل على زرنا
      setDeferredPrompt(e);
      // إظهار الزر الخاص بنا
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 3. إخفاء الزر فور نجاح التثبيت
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // إظهار نافذة التثبيت الأصلية للمتصفح
    deferredPrompt.prompt();

    // انتظار استجابة العميل (موافق أم إلغاء)
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  // إذا كان التطبيق مثبتاً بالفعل أو المتصفح لا يدعم التثبيت (مثل أجهزة الآيفون)، لا نعرض شيئاً
  if (isStandalone || !isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors animate-in fade-in"
    >
      <Download className="w-4 h-4" />
      <span className="hidden md:inline">تثبيت التطبيق</span>
      <span className="md:hidden">تثبيت</span>
    </button>
  );
}