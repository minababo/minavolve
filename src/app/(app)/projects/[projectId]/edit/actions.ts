"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectEditSchema } from "@/lib/validators/project";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getProjectUpdateErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("start_date") ||
    normalized.includes("target_end_date")
  ) {
    return "Invalid date value. Check the start and end dates and try again.";
  }

  if (
    normalized.includes("projects_status_check") ||
    normalized.includes("violates check constraint")
  ) {
    return "The selected status is not supported by the current schema.";
  }

  if (normalized.includes("duplicate") || normalized.includes("unique")) {
    return "A project with that name already exists.";
  }

  if (normalized.includes("row-level security")) {
    return "Permission denied. Confirm you are signed in and are the project owner.";
  }

  return "Unable to update project. Check the form and try again.";
}

export async function updateProject(formData: FormData) {
  const projectId = getString(formData, "projectId");

  if (!projectId) {
    redirect("/projects");
  }

  const parsed = projectEditSchema.safeParse({
    name: getString(formData, "name"),
    description: getString(formData, "description"),
    status: getString(formData, "status"),
    start_date: getString(formData, "start_date"),
    target_end_date: getString(formData, "target_end_date"),
  });

  if (!parsed.success) {
    redirect(
      `/projects/${projectId}/edit?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Enter valid project details.",
      )}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("owner_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    redirect(`/projects/${projectId}/edit?error=${encodeURIComponent("Project not found.")}`);
  }

  if (project.owner_id !== user.id) {
    redirect(`/projects/${projectId}?error=not_owner`);
  }

  const { error } = await supabase
    .from("projects")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      status: parsed.data.status,
      start_date: parsed.data.start_date,
      target_end_date: parsed.data.target_end_date,
    })
    .eq("id", projectId);

  if (error) {
    redirect(
      `/projects/${projectId}/edit?error=${encodeURIComponent(
        getProjectUpdateErrorMessage(error.message),
      )}`,
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/edit`);
  redirect(
    `/projects/${projectId}?success=${encodeURIComponent("Project updated.")}`,
  );
}
