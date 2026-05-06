"use server";

import { revalidatePath } from "next/cache";

import { isKanbanStatus, type KanbanStatus } from "@/lib/kanban";
import { createClient } from "@/utils/supabase/server";

type MoveKanbanStoryInput = {
  projectId: string;
  storyId: string;
  status: KanbanStatus;
  orderedStoryIds: string[];
};

export type MoveKanbanStoryResult = {
  ok: boolean;
  message: string;
};

type ExistingStory = {
  id: string;
  status: string;
};

function getMoveErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("status") ||
    normalized.includes("sort_order") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The user_stories table is missing the Kanban status or sort_order fields. Confirm the Supabase schema before moving stories.";
  }

  if (normalized.includes("violates check constraint")) {
    return "The selected Kanban status is not supported by the database schema.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked the Kanban update. Confirm you are still a project member and the story RLS policies are applied.";
  }

  return "Unable to update the Kanban board. Refresh and try again.";
}

function getUniqueStoryIds(storyIds: string[]) {
  return Array.from(new Set(storyIds.filter(Boolean)));
}

export async function moveKanbanStory(
  input: MoveKanbanStoryInput,
): Promise<MoveKanbanStoryResult> {
  if (
    !input.projectId ||
    !input.storyId ||
    !isKanbanStatus(input.status) ||
    !input.orderedStoryIds.includes(input.storyId)
  ) {
    return {
      ok: false,
      message: "Invalid Kanban move. Refresh the board and try again.",
    };
  }

  const orderedStoryIds = getUniqueStoryIds(input.orderedStoryIds);

  if (
    orderedStoryIds.length !== input.orderedStoryIds.length ||
    orderedStoryIds.length > 250
  ) {
    return {
      ok: false,
      message: "Invalid Kanban order. Refresh the board and try again.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Your session has expired. Sign in again before moving stories.",
    };
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", input.projectId)
    .maybeSingle();

  if (projectError || !project) {
    return {
      ok: false,
      message: "Project not found or you do not have access to this board.",
    };
  }

  const { data: existingStories, error: storyLookupError } = await supabase
    .from("user_stories")
    .select("id,status")
    .eq("project_id", input.projectId)
    .in("id", orderedStoryIds);

  if (storyLookupError) {
    return {
      ok: false,
      message: getMoveErrorMessage(storyLookupError.message),
    };
  }

  const storyRows = (existingStories ?? []) as ExistingStory[];
  const storyIdsInProject = new Set(storyRows.map((story) => story.id));

  if (orderedStoryIds.some((storyId) => !storyIdsInProject.has(storyId))) {
    return {
      ok: false,
      message: "This board move includes a story outside the current project.",
    };
  }

  const nonMovedStoryChangedStatus = storyRows.some(
    (story) => story.id !== input.storyId && story.status !== input.status,
  );

  if (nonMovedStoryChangedStatus) {
    return {
      ok: false,
      message: "Only the dragged story can move between Kanban columns.",
    };
  }

  const updates = orderedStoryIds.map((storyId, index) =>
    supabase
      .from("user_stories")
      .update({
        status: input.status,
        sort_order: index * 1000,
      })
      .eq("id", storyId)
      .eq("project_id", input.projectId)
      .select("id")
      .maybeSingle(),
  );

  const results = await Promise.all(updates);
  const failedResult = results.find((result) => result.error || !result.data);

  if (failedResult?.error || failedResult) {
    return {
      ok: false,
      message: getMoveErrorMessage(
        failedResult.error?.message ?? "Kanban update failed.",
      ),
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath(`/projects/${input.projectId}/kanban`);
  revalidatePath(`/projects/${input.projectId}/stories/${input.storyId}`);

  return {
    ok: true,
    message: "Story moved.",
  };
}
