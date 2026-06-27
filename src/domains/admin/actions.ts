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

export async function addProductAction(formData: FormData) {
  try {
    // 1. استخراج البيانات من النموذج
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const discountRaw = formData.get("discount_price") as string;
    const discountPrice = discountRaw ? parseFloat(discountRaw) : null;
    const category = formData.get("category") as string;
    const brand = formData.get("brand") as string;
    const description = formData.get("description") as string;
    const file = formData.get("image") as File;

    let imageUrl = null;

    // 2. معالجة الصورة باستخدام Sharp
    if (file && file.size > 0) {
      // تحويل الملف إلى Buffer لمعالجته
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // ضغط الصورة، وتعديل مقاسها، وتحويلها لـ WebP
      const processedImage = await sharp(buffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true }) // حد أقصى للأبعاد
        .webp({ quality: 80 }) // ضغط الجودة لتقليل الحجم
        .toBuffer();

      // إنشاء اسم فريد للصورة
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      // رفع الصورة لـ Supabase Storage
      const { error: uploadError } = await supabaseAdmin.storage
        .from("product-images")
        .upload(fileName, processedImage, {
          contentType: "image/webp",
        });

      if (uploadError) throw new Error("فشل رفع الصورة: " + uploadError.message);

      // جلب الرابط العام للصورة
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // 3. حفظ بيانات المنتج في قاعدة البيانات
    const { error: dbError } = await supabaseAdmin.from("products").insert({
      title,
      price,
      discount_price: discountPrice,
      category,
      brand,
      description,
      image_urls: imageUrl ? [imageUrl] : [],
    });

    if (dbError) throw new Error("فشل حفظ المنتج: " + dbError.message);

    // 4. تحديث الكاش لكي يظهر المنتج فوراً للعملاء
    revalidatePath("/");
    revalidatePath("/offers");

    return { success: true };
  } catch (error: any) {
    console.error("Add Product Error:", error);
    return { success: false, error: error.message };
  }
}