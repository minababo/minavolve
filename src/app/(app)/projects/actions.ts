"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectFormSchema } from "@/lib/validators/project";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithCreateError(message: string): never {
  redirect(`/projects/new?error=${encodeURIComponent(message)}`);
}

function getProjectCreateErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("project_key") &&
    (normalized.includes("schema cache") || normalized.includes("column"))
  ) {
    return "The projects table is missing the Issue #10 project_key column. Apply the latest Supabase schema before creating projects.";
  }

  if (
    normalized.includes("start_date") ||
    normalized.includes("target_end_date")
  ) {
    return "The projects table is missing the Issue #10 date columns. Apply the latest Supabase schema before creating projects.";
  }

  if (
    normalized.includes("projects_status_check") ||
    normalized.includes("violates check constraint")
  ) {
    return "The selected status is not supported by the current projects table schema.";
  }

  if (normalized.includes("duplicate") || normalized.includes("unique")) {
    return "A project with that name or key already exists for your account.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked project creation. Confirm you are signed in and the project RLS policies are applied.";
  }

  if (normalized.includes("foreign key")) {
    return "Your profile is not ready yet. Sign out, sign back in, and try again.";
  }

  return "Unable to create project. Check the form and try again.";
}

export async function createProject(formData: FormData) {
  const parsed = projectFormSchema.safeParse({
    name: getString(formData, "name"),
    project_key: getString(formData, "project_key"),
    description: getString(formData, "description"),
    status: getString(formData, "status"),
    start_date: getString(formData, "start_date"),
    target_end_date: getString(formData, "target_end_date"),
  });

  if (!parsed.success) {
    redirectWithCreateError(
      parsed.error.issues[0]?.message ?? "Enter valid project details.",
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = randomUUID();
  const { error } = await supabase.from("projects").insert({
    id: projectId,
    owner_id: user.id,
    name: parsed.data.name,
    project_key: parsed.data.project_key,
    description: parsed.data.description,
    status: parsed.data.status,
    start_date: parsed.data.start_date,
    target_end_date: parsed.data.target_end_date,
  });

  if (error) {
    redirectWithCreateError(getProjectCreateErrorMessage(error.message));
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(`/projects/${projectId}`);
}
