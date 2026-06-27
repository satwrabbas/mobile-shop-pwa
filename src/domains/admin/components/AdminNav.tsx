// src/domains/admin/components/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "../auth/actions";
import { Package, RefreshCw, PlusCircle, LogOut } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // إخفاء الشريط إذا كنا في صفحة تسجيل الدخول
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = [
    { name: "الطلبات", href: "/admin/orders", icon: <Package className="w-5 h-5" /> },
    { name: "طلبات الاستبدال", href: "/admin/trade-in", icon: <RefreshCw className="w-5 h-5" /> },
    { name: "إضافة منتج", href: "/admin/products/new", icon: <PlusCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg hidden md:block">لوحة الإدارة</span>
      </div>

      <nav className="flex items-center gap-2 md:gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ml-auto md:ml-0"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden md:inline">تسجيل الخروج</span>
      </button>
    </div>
  );
}