"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { riskFormSchema, riskStatuses } from "@/lib/validators/risk";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithError(projectId: string, message: string): never {
  redirect(
    `/projects/${projectId}/risks/new?error=${encodeURIComponent(message)}`,
  );
}

function getRiskCreateError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("risks_likelihood_check")) {
    return "Likelihood must be low, medium, or high.";
  }

  if (normalized.includes("risks_impact_check")) {
    return "Impact must be low, medium, or high.";
  }

  if (normalized.includes("risks_status_check")) {
    return "Status must be open, mitigating, resolved, or accepted.";
  }

  if (normalized.includes("risks_title_length")) {
    return "Risk title must be between 2 and 180 characters.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked risk creation. Confirm you are a project member and RLS policies are applied.";
  }

  if (normalized.includes("foreign key")) {
    return "The selected project could not be linked to this risk.";
  }

  if (normalized.includes("column")) {
    return "The risks table schema does not match the expected columns. Contact your database administrator.";
  }

  return "Unable to create risk. Check the form and try again.";
}

export async function createRisk(formData: FormData) {
  const projectId = getString(formData, "projectId");

  if (!projectId) {
    redirect("/projects");
  }

  const parsed = riskFormSchema.safeParse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    likelihood: getString(formData, "likelihood"),
    impact: getString(formData, "impact"),
    status: getString(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithError(
      projectId,
      parsed.error.issues[0]?.message ?? "Enter valid risk details.",
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
    redirectWithError(
      projectId,
      "Project not found or you do not have access to create risks.",
    );
  }

  const { error } = await supabase.from("risks").insert({
    project_id: projectId,
    owner_id: user.id,
    created_by: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    likelihood: parsed.data.likelihood,
    impact: parsed.data.impact,
    status: parsed.data.status,
  });

  if (error) {
    redirectWithError(projectId, getRiskCreateError(error.message));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/risks`);

  redirect(`/projects/${projectId}/risks`);
}

export async function updateRiskStatus(formData: FormData) {
  const riskId = getString(formData, "riskId");
  const projectId = getString(formData, "projectId");
  const newStatus = getString(formData, "newStatus");

  if (!riskId || !projectId) {
    redirect("/projects");
  }

  if (!(riskStatuses as readonly string[]).includes(newStatus)) {
    redirect(
      `/projects/${projectId}/risks?error=${encodeURIComponent("Invalid status value.")}`,
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("risks")
    .update({ status: newStatus })
    .eq("id", riskId)
    .eq("project_id", projectId);

  if (error) {
    redirect(
      `/projects/${projectId}/risks?error=${encodeURIComponent("Unable to update risk status.")}`,
    );
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}/risks`);
  redirect(`/projects/${projectId}/risks`);
}
