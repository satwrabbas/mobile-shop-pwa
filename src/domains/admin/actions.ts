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

const MAX_IMAGES = 5;

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
    if (!description) throw new Error("وصف المنتج مطلوب.");
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
      if (Object.keys(filtered).length === 0) {
        throw new Error("يجب إضافة مواصفة واحدة على الأقل.");
      }
      specs = filtered;
    } else {
      throw new Error("يجب إضافة مواصفة واحدة على الأقل.");
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

export async function updateProductAction(productId: string, formData: FormData) {
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
    const existingUrlsRaw = formData.get("existing_image_urls") as string;
    const imageOrderRaw = formData.get("image_order") as string;

    if (!title) throw new Error("اسم المنتج مطلوب.");
    if (!description) throw new Error("وصف المنتج مطلوب.");
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
      if (Object.keys(filtered).length === 0) {
        throw new Error("يجب إضافة مواصفة واحدة على الأقل.");
      }
      specs = filtered;
    } else {
      throw new Error("يجب إضافة مواصفة واحدة على الأقل.");
    }

    let existingUrls: string[] = [];
    if (existingUrlsRaw) {
      existingUrls = JSON.parse(existingUrlsRaw) as string[];
    }

    const files = formData.getAll("images").filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    const newImageUrls: string[] = [];
    for (const file of files.slice(0, MAX_IMAGES)) {
      newImageUrls.push(await uploadProductImage(file));
    }

    let imageUrls: string[] = [];

    if (imageOrderRaw) {
      const imageOrder = JSON.parse(imageOrderRaw) as Array<
        { type: "existing"; url: string } | { type: "new" }
      >;
      let newIndex = 0;
      for (const entry of imageOrder) {
        if (entry.type === "existing") {
          imageUrls.push(entry.url);
        } else if (newIndex < newImageUrls.length) {
          imageUrls.push(newImageUrls[newIndex++]);
        }
      }
    } else {
      imageUrls = [...existingUrls, ...newImageUrls];
    }

    if (imageUrls.length === 0) throw new Error("يجب إرفاق صورة واحدة على الأقل.");

    const { error: dbError } = await supabaseAdmin
      .from("products")
      .update({
        title,
        price,
        discount_price: discountPrice,
        category,
        brand,
        description,
        stock,
        specs,
        image_urls: imageUrls,
      })
      .eq("id", productId);

    if (dbError) throw new Error("فشل تحديث المنتج: " + dbError.message);

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/products");
    revalidatePath(`/product/${productId}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("Update Product Error:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع.";
    return { success: false, error: message };
  }
}