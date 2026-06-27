// src/app/admin/page.tsx
import { getDashboardStats } from "@/domains/admin/dashboard/actions";
import { DollarSign, ShoppingBag, RefreshCw, Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";

// تحديث فوري للإحصائيات في كل مرة تفتح فيها الصفحة
export const revalidate = 0; 

export default async function AdminDashboardPage() {
  const { stats } = await getDashboardStats();

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-500 mt-2">
          مرحباً بك في لوحة تحكم متجر موبايلي. إليك ملخص أداء المتجر.
        </p>
      </div>

      {/* شبكة البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* بطاقة المبيعات */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-green-100 text-sm font-medium mb-1">إجمالي المبيعات (المكتملة)</p>
            <h3 className="text-4xl font-bold">{stats?.totalSales} <span className="text-xl">د.ك</span></h3>
          </div>
          <DollarSign className="absolute left-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
        </div>

        {/* بطاقة الطلبات الجديدة */}
        <Link href="/admin/orders" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.pendingOrders}</h3>
            <p className="text-gray-500 text-sm">طلبات بانتظار التنفيذ</p>
          </div>
        </Link>

        {/* بطاقة طلبات الاستبدال */}
        <Link href="/admin/trade-in" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <RefreshCw className="w-6 h-6" />
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.pendingTradeIns}</h3>
            <p className="text-gray-500 text-sm">طلبات استبدال للمراجعة</p>
          </div>
        </Link>

        {/* بطاقة المنتجات */}
        <Link href="/admin/products/new" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalProducts}</h3>
            <p className="text-gray-500 text-sm">إجمالي المنتجات المعروضة</p>
          </div>
        </Link>

      </div>
    </div>
  );
}