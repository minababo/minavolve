"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(message: string): never {
  redirect(`/register?error=${encodeURIComponent(message)}`);
}

function getRegisterErrorMessage(message: string, status?: number) {
  const normalized = message.toLowerCase();

  if (
    status === 429 ||
    normalized.includes("rate limit") ||
    normalized.includes("security purposes")
  ) {
    return "Too many signup attempts. Wait a few minutes and try again.";
  }

  if (normalized.includes("invalid") && normalized.includes("email")) {
    return "Enter a valid email address.";
  }

  if (normalized.includes("already registered")) {
    return "That email is already registered. Try signing in instead.";
  }

  if (normalized.includes("password")) {
    return "Use a stronger password. It must be at least 8 characters.";
  }

  return "Unable to create your account. Check your details and try again.";
}

export async function register(formData: FormData) {
  const fullName = getString(formData, "fullName");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (fullName.length < 2) {
    redirectWithError("Enter your full name.");
  }

  if (!email || !password || !confirmPassword) {
    redirectWithError("Enter your email and password.");
  }

  if (password.length < 8) {
    redirectWithError("Password must be at least 8 characters.");
  }

  if (password !== confirmPassword) {
    redirectWithError("Passwords do not match.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirectWithError(getRegisterErrorMessage(error.message, error.status));
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    `/login?message=${encodeURIComponent(
      "Check your email to confirm your account before signing in.",
    )}`,
  );
}
