// src/domains/admin/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { revalidatePath } from "next/cache";

// نهيئ عميل بصلاحيات المدير لتخطي RLS بأمان داخل بيئة الخادم فقط
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadProductImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const processedImage = await sharp(buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("product-images")
    .upload(fileName, processedImage, { contentType: "image/webp" });

  if (uploadError) throw new Error("فشل رفع الصورة: " + uploadError.message);

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function addProductAction(formData: FormData) {
  try {
    const title = (formData.get("title") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const discountRaw = formData.get("discount_price") as string;
    const discountPrice = discountRaw ? parseFloat(discountRaw) : null;
    const category = formData.get("category") as string;
    const brand = (formData.get("brand") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const stockRaw = formData.get("stock") as string;
    const stock = stockRaw ? parseInt(stockRaw, 10) : 0;
    const specsRaw = formData.get("specs") as string;

    if (!title) throw new Error("اسم المنتج مطلوب.");
    if (Number.isNaN(price) || price <= 0) throw new Error("السعر غير صالح.");
    if (discountPrice !== null && (Number.isNaN(discountPrice) || discountPrice >= price)) {
      throw new Error("سعر التخفيض يجب أن يكون أقل من السعر الأصلي.");
    }
    if (Number.isNaN(stock) || stock < 0) throw new Error("المخزون غير صالح.");

    let specs: Record<string, string> | null = null;
    if (specsRaw) {
      const parsed = JSON.parse(specsRaw) as Record<string, string>;
      const filtered = Object.fromEntries(
        Object.entries(parsed).filter(([k, v]) => k.trim() && String(v).trim())
      );
      specs = Object.keys(filtered).length > 0 ? filtered : null;
    }

    const files = formData.getAll("images").filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    if (files.length === 0) throw new Error("يجب إرفاق صورة واحدة على الأقل.");

    const imageUrls: string[] = [];
    for (const file of files.slice(0, 5)) {
      imageUrls.push(await uploadProductImage(file));
    }

    const { error: dbError } = await supabaseAdmin.from("products").insert({
      title,
      price,
      discount_price: discountPrice,
      category,
      brand,
      description: description || null,
      stock,
      specs,
      image_urls: imageUrls,
    });

    if (dbError) throw new Error("فشل حفظ المنتج: " + dbError.message);

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error: any) {
    console.error("Add Product Error:", error);
    return { success: false, error: error.message };
  }
}