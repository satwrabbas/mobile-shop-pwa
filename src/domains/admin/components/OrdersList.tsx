// src/domains/admin/components/OrdersList.tsx
"use client";

import { useState } from "react";
import { updateOrderStatus } from "../orders/actions";
import { ChevronDown, ChevronUp, MapPin, Phone, User, Package, Clock, CheckCircle, XCircle } from "lucide-react";

// تعريف مبسط لشكل البيانات القادمة من الاستعلام
type Order = any; 

export default function OrdersList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("حدث خطأ أثناء تحديث الحالة");
    }
    setLoadingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> قيد الانتظار</span>;
      case 'completed': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> مكتمل</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> ملغي</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (orders.length === 0) {
    return <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500">لا توجد طلبات حتى الآن.</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all">
          
          {/* رأس البطاقة (الجزء الظاهر دائماً) */}
          <div 
            onClick={() => toggleExpand(order.id)}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{order.customer_name}</h3>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("ar-EG")} - {order.total_price} د.ك</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              {getStatusBadge(order.status)}
              {expandedId === order.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>

          {/* تفاصيل البطاقة (تظهر عند التمدد) */}
          {expandedId === order.id && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* معلومات العميل */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-2 border-b pb-2">بيانات العميل</h4>
                  <p className="flex items-center gap-2 text-sm text-gray-600"><User className="w-4 h-4 text-blue-500"/> {order.customer_name}</p>
                  <p className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-blue-500"/> {order.customer_phone}</p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500"/> 
                    {order.delivery_method === 'delivery' ? order.address : 'استلام من المحل'}
                  </p>
                </div>

                {/* المنتجات المطلوبة */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-2 border-b pb-2">المنتجات</h4>
                  <ul className="space-y-2">
                    {order.order_items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between text-sm text-gray-600">
                        <span>{item.quantity}x {item.products?.title || 'منتج محذوف'}</span>
                        <span className="font-medium">{item.price_at_purchase} د.ك</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex justify-between font-bold text-gray-900">
                    <span>الإجمالي:</span>
                    <span>{order.total_price} د.ك</span>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  disabled={loadingId === order.id || order.status === 'completed'}
                  onClick={() => handleStatusChange(order.id, 'completed')}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  تحديد كمكتمل
                </button>
                <button 
                  disabled={loadingId === order.id || order.status === 'cancelled'}
                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                  className="bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  إلغاء الطلب
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}