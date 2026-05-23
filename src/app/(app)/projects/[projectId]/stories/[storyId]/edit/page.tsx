import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNav } from "@/components/app/app-nav";
import {
  StoryForm,
  type StorySprintOption,
} from "@/components/stories/story-form";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Edit story",
  description: "Edit user story details.",
};

type EditStoryPageProps = {
  params: Promise<{
    projectId: string;
    storyId: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

type StoryProject = {
  id: string;
  name: string;
  project_key: string;
};

type EditableStory = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  acceptance_criteria: string[] | null;
  story_points: number;
  priority: string;
  status: string;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditStoryPage({
  params,
  searchParams,
}: EditStoryPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId, storyId } = await params;
  const [
    { data: project, error: projectError },
    { data: story, error },
    { data: sprints },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("id,name,project_key")
      .eq("id", projectId)
      .maybeSingle(),
    supabase
      .from("user_stories")
      .select(
        "id,project_id,sprint_id,title,description,acceptance_criteria,story_points,priority,status",
      )
      .eq("project_id", projectId)
      .eq("id", storyId)
      .maybeSingle(),
    supabase
      .from("sprints")
      .select("id,name,status")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  if (projectError || error || !project || !story) {
    redirect(`/projects`);
  }

  const typedProject = project as StoryProject;
  const typedStory = story as EditableStory;
  const sprintOptions = (sprints ?? []) as StorySprintOption[];

  const query = await searchParams;
  const editError = getSearchParam(query.error);

  return (
    <>
      <AppNav userEmail={user.email ?? ""} />
      <main className="flex-1 px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Link
            href={`/projects/${typedProject.id}/stories/${typedStory.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to story
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-14 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <Pencil className="size-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  {typedProject.project_key} story editing
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Edit story
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {typedStory.title}
                </p>
              </div>
            </div>
          </header>

          <StoryForm
            projectId={typedProject.id}
            sprints={sprintOptions}
            error={editError}
            editMode
            storyId={typedStory.id}
            defaultValues={{
              title: typedStory.title,
              description: typedStory.description,
              acceptance_criteria: typedStory.acceptance_criteria,
              story_points: typedStory.story_points,
              priority: typedStory.priority,
              status: typedStory.status,
              sprint_id: typedStory.sprint_id,
            }}
          />
        </div>
      </main>
    </>
  );
}
