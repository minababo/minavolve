"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  parseAcceptanceCriteria,
  storyFormSchema,
} from "@/lib/validators/story";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function redirectWithStoryError(projectId: string, message: string): never {
  redirect(
    `/projects/${projectId}/stories/new?error=${encodeURIComponent(message)}`,
  );
}

function getStoryCreateErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("acceptance_criteria") ||
    normalized.includes("story_points") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The user_stories table is missing Issue #14 story columns. Apply the latest Supabase schema before creating stories.";
  }

  if (
    normalized.includes("user_stories_status_check") ||
    normalized.includes("user_stories_priority_check") ||
    normalized.includes("violates check constraint")
  ) {
    return "The selected story status or priority is not supported by the current database schema.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked story creation. Confirm you are a project member and the story RLS policies are applied.";
  }

  if (normalized.includes("foreign key")) {
    return "The selected project or sprint could not be linked to this story.";
  }

  return "Unable to create story. Check the form and try again.";
}

export async function createStory(formData: FormData) {
  const projectId = getString(formData, "projectId");

  if (!projectId) {
    redirect("/projects");
  }

  const parsed = storyFormSchema.safeParse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    acceptance_criteria: parseAcceptanceCriteria(
      formData.get("acceptance_criteria"),
    ),
    story_points: getString(formData, "story_points"),
    priority: getString(formData, "priority"),
    status: getString(formData, "status"),
    sprint_id: getString(formData, "sprint_id"),
  });

  if (!parsed.success) {
    redirectWithStoryError(
      projectId,
      parsed.error.issues[0]?.message ?? "Enter valid story details.",
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
    redirectWithStoryError(
      projectId,
      "Project not found or you do not have access to create stories.",
    );
  }

  if (parsed.data.sprint_id) {
    const { data: sprint, error: sprintError } = await supabase
      .from("sprints")
      .select("id")
      .eq("id", parsed.data.sprint_id)
      .eq("project_id", projectId)
      .maybeSingle();

    if (sprintError || !sprint) {
      redirectWithStoryError(
        projectId,
        "Selected sprint does not belong to this project.",
      );
    }
  }

  const storyId = randomUUID();
  const { error } = await supabase.from("user_stories").insert({
    id: storyId,
    project_id: projectId,
    sprint_id: parsed.data.sprint_id,
    title: parsed.data.title,
    description: parsed.data.description,
    acceptance_criteria: parsed.data.acceptance_criteria,
    story_points: parsed.data.story_points,
    priority: parsed.data.priority,
    status: parsed.data.status,
    sort_order: 0,
  });

  if (error) {
    redirectWithStoryError(projectId, getStoryCreateErrorMessage(error.message));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);

  if (parsed.data.sprint_id) {
    revalidatePath(`/projects/${projectId}/sprints/${parsed.data.sprint_id}`);
  }

  redirect(`/projects/${projectId}/stories/${storyId}`);
}

export async function updateStory(formData: FormData) {
  const storyId = getString(formData, "storyId");
  const projectId = getString(formData, "projectId");

  if (!storyId || !projectId) {
    redirect("/projects");
  }

  const parsed = storyFormSchema.safeParse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    acceptance_criteria: parseAcceptanceCriteria(
      formData.get("acceptance_criteria"),
    ),
    story_points: getString(formData, "story_points"),
    priority: getString(formData, "priority"),
    status: getString(formData, "status"),
    sprint_id: getString(formData, "sprint_id"),
  });

  if (!parsed.success) {
    redirect(
      `/projects/${projectId}/stories/${storyId}?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Enter valid story details.",
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

  const { data: story, error: storyCheckError } = await supabase
    .from("user_stories")
    .select("id")
    .eq("id", storyId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (storyCheckError || !story) {
    redirect(
      `/projects/${projectId}/stories/${storyId}?error=${encodeURIComponent(
        "Story not found or access denied.",
      )}`,
    );
  }

  if (parsed.data.sprint_id) {
    const { data: sprint, error: sprintError } = await supabase
      .from("sprints")
      .select("id")
      .eq("id", parsed.data.sprint_id)
      .eq("project_id", projectId)
      .maybeSingle();

    if (sprintError || !sprint) {
      redirect(
        `/projects/${projectId}/stories/${storyId}?error=${encodeURIComponent(
          "Selected sprint does not belong to this project.",
        )}`,
      );
    }
  }

  const { error } = await supabase
    .from("user_stories")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      acceptance_criteria: parsed.data.acceptance_criteria,
      story_points: parsed.data.story_points,
      priority: parsed.data.priority,
      status: parsed.data.status,
      sprint_id: parsed.data.sprint_id,
    })
    .eq("id", storyId);

  if (error) {
    redirect(
      `/projects/${projectId}/stories/${storyId}?error=${encodeURIComponent(
        getStoryCreateErrorMessage(error.message),
      )}`,
    );
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/stories/${storyId}`);

  if (parsed.data.sprint_id) {
    revalidatePath(`/projects/${projectId}/sprints/${parsed.data.sprint_id}`);
  }

  redirect(
    `/projects/${projectId}/stories/${storyId}?success=${encodeURIComponent("Story saved.")}`,
  );
}
