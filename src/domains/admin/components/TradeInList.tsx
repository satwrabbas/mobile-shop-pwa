// src/domains/admin/components/TradeInList.tsx
"use client";

import { useState } from "react";
import { updateTradeInStatus } from "../trade-in/actions";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  Smartphone,
  Clock,
  CheckCircle,
  FileText,
  BadgeDollarSign,
} from "lucide-react";

type TradeInRequest = any;

export default function TradeInList({
  initialRequests,
}: {
  initialRequests: TradeInRequest[];
}) {
  const [requests, setRequests] = useState<TradeInRequest[]>(initialRequests);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<string>("");

  const toggleExpand = (id: string, currentVal: number | null) => {
    setExpandedId(expandedId === id ? null : id);
    setEstimatedValue(currentVal ? currentVal.toString() : ""); // تعبئة السعر السابق إن وجد
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setLoadingId(requestId);

    // تحويل القيمة المدخلة إلى رقم
    const val = estimatedValue ? parseFloat(estimatedValue) : undefined;

    const result = await updateTradeInStatus(requestId, newStatus, val);

    if (result.success) {
      setRequests(
        requests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: newStatus,
                estimated_value: val !== undefined ? val : r.estimated_value,
              }
            : r,
        ),
      );
    } else {
      alert("حدث خطأ أثناء تحديث الحالة");
    }
    setLoadingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> قيد المراجعة
          </span>
        );
      case "reviewed":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <FileText className="w-3 h-3" /> تم التقييم
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> مكتمل
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
        لا توجد طلبات استبدال حتى الآن.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <div
            onClick={() => toggleExpand(request.id, request.estimated_value)}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {request.customer_name}
                </h3>
                <p className="text-sm text-gray-500">{request.device_model}</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              {getStatusBadge(request.status)}
              {expandedId === request.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedId === request.id && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-2 border-b pb-2">
                    بيانات التواصل
                  </h4>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-blue-500" />{" "}
                    {request.customer_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-500" />{" "}
                    {request.customer_phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                    تاريخ الطلب:{" "}
                    {new Date(request.created_at).toLocaleDateString("ar-EG")}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-2 border-b pb-2">
                    تفاصيل الجهاز
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">الموديل:</span>{" "}
                    {request.device_model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">الحالة:</span>{" "}
                    {request.device_condition}
                  </p>
                  {request.estimated_value && (
                    <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <BadgeDollarSign className="w-4 h-4" />
                      السعر التقديري: {request.estimated_value} $
                    </p>
                  )}
                </div>
              </div>

              {/* قسم التقييم وتحديث الحالة */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3 space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    السعر التقديري ($)
                  </label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="مثال: 150"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    disabled={
                      loadingId === request.id || request.status === "reviewed"
                    }
                    onClick={() => handleStatusChange(request.id, "reviewed")}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full md:w-auto"
                  >
                    تم التقييم
                  </button>
                  <button
                    disabled={
                      loadingId === request.id || request.status === "completed"
                    }
                    onClick={() => handleStatusChange(request.id, "completed")}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full md:w-auto"
                  >
                    إنهاء المعاملة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
