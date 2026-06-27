// src/app/admin/orders/page.tsx
import { getAdminOrders } from "@/domains/admin/orders/actions";
import OrdersList from "@/domains/admin/components/OrdersList";

// نوقف الكاش لهذه الصفحة لكي يرى المدير أحدث الطلبات عند تحديث الصفحة
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const { orders } = await getAdminOrders();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-2">
            متابعة طلبات العملاء وتحديث حالتها.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
          إجمالي الطلبات: {orders?.length || 0}
        </div>
      </div>
      
      <OrdersList initialOrders={orders || []} />
    </div>
  );
}