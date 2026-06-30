// src/domains/admin/components/AdminProductsList.tsx
"use client";

import { useState } from "react";
import {
  updateProductQuickDetails,
  deleteProductAction,
} from "../products/actions";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, X, Check, Loader2, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsList({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    price: 0,
    discount_price: "",
    stock: 0,
  });

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      price: product.price,
      discount_price: product.discount_price ? product.discount_price.toString() : "",
      stock: product.stock || 0,
    });
  };

  const handleSave = async (productId: string) => {
    setLoadingId(productId);

    const discount = editForm.discount_price ? parseFloat(editForm.discount_price) : null;
    const result = await updateProductQuickDetails(productId, editForm.price, discount, editForm.stock);

    if (result.success) {
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, price: editForm.price, discount_price: discount, stock: editForm.stock } : p
        )
      );
      setEditingId(null);
      toast.success("تم تحديث بيانات المنتج بنجاح!");
    } else {
      toast.error(result.error || "حدث خطأ أثناء التحديث.");
    }
    setLoadingId(null);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج نهائياً؟")) return;

    setLoadingId(productId);
    const result = await deleteProductAction(productId);

    if (result.success) {
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("تم حذف المنتج بنجاح.");
    } else {
      toast.error(result.error || "لا يمكن حذف المنتج.");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row p-4 gap-4 items-center">
          
          <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
            {/* تمت إضافة sizes="96px" هنا لحل التحذير الأصفر */}
            <Image
              src={product.image_urls?.[0] || "https://placehold.co/100"}
              alt={product.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="flex-grow text-center md:text-right w-full">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.brand} - {product.category === "phone" ? "هاتف" : "إكسسوار"}</p>

            {editingId === product.id ? (
              <div className="bg-blue-50 p-3 rounded-xl grid grid-cols-3 gap-2 mt-2">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">السعر</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} className="w-full p-2 text-sm rounded border border-blue-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">الخصم (اختياري)</label>
                  <input type="number" value={editForm.discount_price} onChange={(e) => setEditForm({ ...editForm, discount_price: e.target.value })} className="w-full p-2 text-sm rounded border border-blue-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">المخزون</label>
                  <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })} className="w-full p-2 text-sm rounded border border-blue-200" />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <span className="text-gray-900">السعر: {product.price} $</span>
                {product.discount_price && <span className="text-red-600">التخفيض: {product.discount_price} $</span>}
                <span className={`px-2 py-1 rounded-md ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  المخزون: {product.stock}
                </span>
              </div>
            )}
          </div>

          <div className="flex md:flex-col gap-2 shrink-0">
            {editingId === product.id ? (
              <>
                <button onClick={() => handleSave(product.id)} disabled={loadingId === product.id} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center">
                  {loadingId === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition flex items-center justify-center"
                  title="تعديل المنتج"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => startEditing(product)}
                  className="bg-amber-50 text-amber-600 p-2 rounded-lg hover:bg-amber-100 transition flex items-center justify-center"
                  title="تعديل سريع للسعر والمخزون"
                >
                  <DollarSign className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(product.id)} disabled={loadingId === product.id} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition disabled:opacity-50 flex items-center justify-center">
                  {loadingId === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}