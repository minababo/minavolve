"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sprintFormSchema } from "@/lib/validators/sprint";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithSprintError(projectId: string, message: string): never {
  redirect(
    `/projects/${projectId}/sprints/new?error=${encodeURIComponent(message)}`,
  );
}

function getSprintCreateErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("start_date") ||
    normalized.includes("end_date") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The sprints table is missing the Issue #12 start_date or end_date columns. Apply the latest Supabase schema before creating sprints.";
  }

  if (
    normalized.includes("sprints_status_check") ||
    normalized.includes("violates check constraint")
  ) {
    return "The selected sprint status is not supported by the current sprints table schema.";
  }

  if (normalized.includes("duplicate") || normalized.includes("unique")) {
    return "A sprint with that name already exists in this project.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked sprint creation. Confirm you are a project member and the sprint RLS policies are applied.";
  }

  if (normalized.includes("foreign key")) {
    return "This project could not be linked to the sprint. Confirm the project exists and try again.";
  }

  return "Unable to create sprint. Check the form and try again.";
}

export async function createSprint(formData: FormData) {
  const projectId = getString(formData, "projectId");

  if (!projectId) {
    redirect("/projects");
  }

  const parsed = sprintFormSchema.safeParse({
    name: getString(formData, "name"),
    goal: getString(formData, "goal"),
    start_date: getString(formData, "start_date"),
    end_date: getString(formData, "end_date"),
    status: getString(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithSprintError(
      projectId,
      parsed.error.issues[0]?.message ?? "Enter valid sprint details.",
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
    .select("id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    redirectWithSprintError(
      projectId,
      "Project not found or you do not have access to create sprints.",
    );
  }

  const sprintId = randomUUID();
  const { error } = await supabase.from("sprints").insert({
    id: sprintId,
    project_id: projectId,
    name: parsed.data.name,
    goal: parsed.data.goal,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date,
    status: parsed.data.status,
  });

  if (error) {
    redirectWithSprintError(projectId, getSprintCreateErrorMessage(error.message));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}/sprints/${sprintId}`);
}
