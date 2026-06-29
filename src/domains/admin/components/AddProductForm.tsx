"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addProductAction } from "../actions";
import {
  ImagePlus,
  Loader2,
  X,
  Smartphone,
  Headphones,
  DollarSign,
  Settings2,
  Images,
  Eye,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const DRAFT_KEY = "admin-product-draft";
const MAX_IMAGES = 5;
const MAX_DESC = 500;

const BRAND_PRESETS = ["Apple", "Samsung", "Xiaomi", "Huawei", "Oppo", "Realme", "Honor", "Google", "OnePlus"];

const PHONE_SPEC_TEMPLATES = ["التخزين", "الذاكرة", "الشاشة", "المعالج", "الكاميرا", "البطارية", "نظام التشغيل"];
const ACCESSORY_SPEC_TEMPLATES = ["النوع", "التوافق", "اللون", "المادة", "الطول", "الضمان"];

type TabId = "basic" | "pricing" | "specs" | "media";
type Category = "phone" | "accessory";

interface SpecRow {
  id: string;
  key: string;
  value: string;
}

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface FormDraft {
  title: string;
  brand: string;
  category: Category;
  description: string;
  price: string;
  discount_price: string;
  stock: string;
  specs: SpecRow[];
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "basic", label: "المعلومات", icon: <Smartphone className="w-4 h-4" /> },
  { id: "pricing", label: "التسعير", icon: <DollarSign className="w-4 h-4" /> },
  { id: "specs", label: "المواصفات", icon: <Settings2 className="w-4 h-4" /> },
  { id: "media", label: "الصور", icon: <Images className="w-4 h-4" /> },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function ProductPreview({
  title,
  brand,
  price,
  discountPrice,
  imagePreview,
  category,
}: {
  title: string;
  brand: string;
  price: string;
  discountPrice: string;
  imagePreview: string | null;
  category: Category;
}) {
  const numPrice = parseFloat(price);
  const numDiscount = discountPrice ? parseFloat(discountPrice) : null;
  const hasDiscount = numDiscount !== null && !Number.isNaN(numDiscount) && numDiscount < numPrice;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-700">
        <Eye className="w-4 h-4 text-blue-600" />
        معاينة البطاقة
      </div>
      <div className="p-4">
        <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4">
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              تخفيض
            </div>
          )}
          {imagePreview ? (
            <Image src={imagePreview} alt="معاينة" fill className="object-cover" sizes="280px" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
              <ImagePlus className="w-10 h-10" />
              <span className="text-xs">لا توجد صورة</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {title || "اسم المنتج"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{brand || "العلامة التجارية"}</p>
        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
          {category === "phone" ? "هاتف" : "إكسسوار"}
        </span>
        <div className="mt-4 pt-4 border-t border-gray-100">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-red-600">{numDiscount} $</span>
              <span className="text-sm text-gray-400 line-through">{numPrice} $</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {!Number.isNaN(numPrice) && numPrice > 0 ? `${numPrice} $` : "0 $"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddProductForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isPending, setIsPending] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [category, setCategory] = useState<Category>("phone");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [specs, setSpecs] = useState<SpecRow[]>([{ id: uid(), key: "", value: "" }]);

  const effectiveBrand = brand === "other" ? customBrand : brand;

  const discountPercent = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discountPrice);
    if (!price || !discountPrice || Number.isNaN(p) || Number.isNaN(d) || d >= p) return null;
    return Math.round(((p - d) / p) * 100);
  }, [price, discountPrice]);

  const specTemplates = category === "phone" ? PHONE_SPEC_TEMPLATES : ACCESSORY_SPEC_TEMPLATES;

  const completionScore = useMemo(() => {
    let score = 0;
    if (title.trim()) score += 20;
    if (effectiveBrand.trim()) score += 15;
    if (price && parseFloat(price) > 0) score += 20;
    if (images.length > 0) score += 25;
    if (description.trim()) score += 10;
    if (specs.some((s) => s.key.trim() && s.value.trim())) score += 10;
    return score;
  }, [title, effectiveBrand, price, images.length, description, specs]);

  const saveDraft = useCallback(() => {
    const draft: FormDraft = {
      title,
      brand: brand === "other" ? customBrand : brand,
      category,
      description,
      price,
      discount_price: discountPrice,
      stock,
      specs,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    toast.success("تم حفظ المسودة محلياً", { duration: 2000 });
  }, [title, brand, customBrand, category, description, price, discountPrice, stock, specs]);

  const loadDraft = useCallback((silent = false) => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as FormDraft;
      setTitle(draft.title || "");
      if (draft.brand && BRAND_PRESETS.includes(draft.brand)) {
        setBrand(draft.brand);
        setCustomBrand("");
      } else if (draft.brand) {
        setBrand("other");
        setCustomBrand(draft.brand);
      } else {
        setBrand("");
        setCustomBrand("");
      }
      setCategory(draft.category || "phone");
      setDescription(draft.description || "");
      setPrice(draft.price || "");
      setDiscountPrice(draft.discount_price || "");
      setStock(draft.stock || "1");
      setSpecs(draft.specs?.length ? draft.specs : [{ id: uid(), key: "", value: "" }]);
      if (!silent) toast.success("تم استرجاع المسودة");
    } catch {
      if (!silent) toast.error("تعذر استرجاع المسودة");
    }
  }, []);

  const resetForm = () => {
    if (!window.confirm("هل تريد مسح جميع البيانات؟")) return;
    setTitle("");
    setBrand("");
    setCustomBrand("");
    setCategory("phone");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setStock("1");
    setSpecs([{ id: uid(), key: "", value: "" }]);
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    localStorage.removeItem(DRAFT_KEY);
    setActiveTab("basic");
    toast.success("تم مسح النموذج");
  };

  useEffect(() => {
    if (localStorage.getItem(DRAFT_KEY)) loadDraft(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`الحد الأقصى ${MAX_IMAGES} صور`);
      return;
    }

    const toAdd = files.slice(0, remaining).map((file) => ({
      id: uid(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...toAdd]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { id: uid(), key: "", value: "" }]);
  };

  const updateSpec = (id: string, field: "key" | "value", value: string) => {
    setSpecs((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSpec = (id: string) => {
    setSpecs((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)));
  };

  const applySpecTemplate = (templateKey: string) => {
    const exists = specs.some((s) => s.key === templateKey);
    if (exists) {
      toast.error("هذه المواصفة موجودة بالفعل");
      return;
    }
    const empty = specs.find((s) => !s.key.trim() && !s.value.trim());
    if (empty) {
      updateSpec(empty.id, "key", templateKey);
    } else {
      setSpecs((prev) => [...prev, { id: uid(), key: templateKey, value: "" }]);
    }
  };

  const applyDiscountPercent = (percent: number) => {
    const p = parseFloat(price);
    if (Number.isNaN(p) || p <= 0) {
      toast.error("أدخل السعر أولاً");
      return;
    }
    setDiscountPrice((p * (1 - percent / 100)).toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("اسم المنتج مطلوب");
      setActiveTab("basic");
      return;
    }
    if (!effectiveBrand.trim()) {
      toast.error("العلامة التجارية مطلوبة");
      setActiveTab("basic");
      return;
    }
    if (images.length === 0) {
      toast.error("يجب إرفاق صورة واحدة على الأقل");
      setActiveTab("media");
      return;
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("brand", effectiveBrand.trim());
    formData.append("category", category);
    formData.append("description", description.trim());
    formData.append("price", price);
    if (discountPrice) formData.append("discount_price", discountPrice);
    formData.append("stock", stock);

    const specsObj = Object.fromEntries(
      specs.filter((s) => s.key.trim() && s.value.trim()).map((s) => [s.key.trim(), s.value.trim()])
    );
    formData.append("specs", JSON.stringify(specsObj));

    images.forEach((img) => formData.append("images", img.file));

    const result = await addProductAction(formData);

    if (result.success) {
      toast.success("تمت إضافة المنتج بنجاح!");
      localStorage.removeItem(DRAFT_KEY);
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setTitle("");
      setBrand("");
      setCustomBrand("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setStock("1");
      setSpecs([{ id: uid(), key: "", value: "" }]);
      setActiveTab("basic");
    } else {
      toast.error(result.error || "حدث خطأ أثناء إضافة المنتج.");
    }

    setIsPending(false);
  };

  const primaryPreview = images[0]?.preview ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* شريط التقدم */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900">اكتمال البيانات</span>
            <span className="text-sm text-gray-500">{completionScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ مسودة
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              مسح
            </button>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-blue-600 to-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: `${completionScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* النموذج */}
        <div className="xl:col-span-3 space-y-4">
          {/* التبويبات */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-h-[420px]">
            {/* تبويب المعلومات */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">اسم المنتج *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                    placeholder="مثال: iPhone 15 Pro Max 256GB"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">القسم *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { id: "phone" as const, label: "هواتف", icon: Smartphone },
                        { id: "accessory" as const, label: "إكسسوارات", icon: Headphones },
                      ] as const
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCategory(id)}
                        className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                          category === id
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-7 h-7" />
                        <span className="font-bold text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">العلامة التجارية *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required={brand !== "other"}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                    >
                      <option value="">اختر العلامة</option>
                      {BRAND_PRESETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="other">علامة أخرى...</option>
                    </select>
                  </div>
                  {brand === "other" && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-sm font-bold text-gray-700">اسم العلامة</label>
                      <input
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                        placeholder="أدخل اسم العلامة"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700">الوصف</label>
                    <span className={`text-xs ${description.length > MAX_DESC ? "text-red-500" : "text-gray-400"}`}>
                      {description.length}/{MAX_DESC}
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                    rows={5}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white resize-none transition-all"
                    placeholder="اكتب وصفاً جذاباً يبرز مميزات المنتج..."
                  />
                </div>
              </div>
            )}

            {/* تبويب التسعير */}
            {activeTab === "pricing" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">السعر الأصلي ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">سعر التخفيض ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                      placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                    />
                  </div>
                </div>

                {discountPercent !== null && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                    <span className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-lg">
                      -{discountPercent}%
                    </span>
                    <span className="text-sm text-red-700 font-medium">
                      وفّر {(parseFloat(price) - parseFloat(discountPrice)).toFixed(2)} $ للعميل
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">خصم سريع</label>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyDiscountPercent(pct)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">المخزون *</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                  {parseInt(stock) === 0 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      المنتج سيظهر بدون مخزون — لن يتمكن العملاء من الطلب
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* تبويب المواصفات */}
            {activeTab === "specs" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">قوالب جاهزة</label>
                  <div className="flex flex-wrap gap-2">
                    {specTemplates.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applySpecTemplate(key)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        + {key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={spec.id} className="flex gap-2 items-start">
                      <span className="text-xs text-gray-400 font-mono pt-3.5 w-5">{index + 1}</span>
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpec(spec.id, "key", e.target.value)}
                        placeholder="المواصفة"
                        className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(spec.id, "value", e.target.value)}
                        placeholder="القيمة"
                        className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(spec.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSpecRow}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  إضافة مواصفة مخصصة
                </button>
              </div>
            )}

            {/* تبويب الصور */}
            {activeTab === "media" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="product-images"
                  onChange={handleImagesChange}
                />

                <label
                  htmlFor="product-images"
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center gap-3"
                >
                  <ImagePlus className="w-12 h-12 text-gray-400" />
                  <div>
                    <span className="text-sm font-bold text-gray-700 block">اضغط لرفع الصور</span>
                    <span className="text-xs text-gray-400 mt-1 block">
                      حتى {MAX_IMAGES} صور — يتم ضغطها تلقائياً إلى WebP
                    </span>
                  </div>
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, index) => (
                      <div key={img.id} className="relative group">
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <Image src={img.preview} alt="" fill className="object-cover" sizes="150px" />
                          {index === 0 && (
                            <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              رئيسية
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, "up")}
                              className="bg-white/90 text-gray-800 p-1.5 rounded-lg text-xs font-bold"
                            >
                              ↑
                            </button>
                          )}
                          {index < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, "down")}
                              className="bg-white/90 text-gray-800 p-1.5 rounded-lg text-xs font-bold"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="bg-red-500 text-white p-1.5 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* أزرار الإجراء */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الرفع والحفظ...
                </>
              ) : (
                "نشر المنتج"
              )}
            </button>
            <Link
              href="/admin/products"
              className="sm:w-auto px-6 py-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              إلغاء
            </Link>
          </div>
        </div>

        {/* المعاينة الجانبية */}
        <div className="xl:col-span-2 space-y-4">
          <div className="xl:sticky xl:top-6 space-y-4">
            <ProductPreview
              title={title}
              brand={effectiveBrand}
              price={price}
              discountPrice={discountPrice}
              imagePreview={primaryPreview}
              category={category}
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 text-sm">
              <h4 className="font-bold text-gray-900">ملخص سريع</h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>القسم</span>
                  <span className="font-medium text-gray-900">{category === "phone" ? "هاتف" : "إكسسوار"}</span>
                </div>
                <div className="flex justify-between">
                  <span>المخزون</span>
                  <span className={`font-medium ${parseInt(stock) > 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock || "0"} قطعة
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الصور</span>
                  <span className="font-medium text-gray-900">{images.length}/{MAX_IMAGES}</span>
                </div>
                <div className="flex justify-between">
                  <span>المواصفات</span>
                  <span className="font-medium text-gray-900">
                    {specs.filter((s) => s.key && s.value).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
