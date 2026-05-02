"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login?message=You%20have%20been%20signed%20out.");
}
