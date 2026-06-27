// src/app/admin/trade-in/page.tsx
import { getAdminTradeInRequests } from "@/domains/admin/trade-in/actions";
import TradeInList from "@/domains/admin/components/TradeInList";

export const revalidate = 0;

export default async function AdminTradeInPage() {
  const { requests } = await getAdminTradeInRequests();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طلبات الاستبدال</h1>
          <p className="text-gray-500 mt-2">
            مراجعة أجهزة العملاء القديمة وتسعيرها وتحديث حالتها.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
          إجمالي الطلبات: {requests?.length || 0}
        </div>
      </div>
      
      <TradeInList initialRequests={requests || []} />
    </div>
  );
}