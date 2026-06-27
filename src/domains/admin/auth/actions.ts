// src/domains/admin/auth/actions.ts
"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerSupabaseClient();

  // محاولة تسجيل الدخول
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return { success: true };
}