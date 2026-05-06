import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import {
  StoryForm,
  type StorySprintOption,
} from "@/components/stories/story-form";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "New story",
  description: "Create a Minavolve user story.",
};

type NewStoryPageProps = {
  params: Promise<{
    projectId: string;
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

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewStoryPage({
  params,
  searchParams,
}: NewStoryPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;
  const [{ data: project, error: projectError }, { data: sprints, error }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id,name,project_key")
        .eq("id", projectId)
        .maybeSingle(),
      supabase
        .from("sprints")
        .select("id,name,status")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
    ]);

  if (projectError || !project) {
    notFound();
  }

  const typedProject = project as StoryProject;
  const sprintOptions = (sprints ?? []) as StorySprintOption[];
  const query = await searchParams;
  const actionError = getSearchParam(query.error);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <AppSidebar activeHref="/projects" />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <Link
            href={`/projects/${typedProject.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to project
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <MessageSquarePlus className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  {typedProject.project_key} story setup
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  New story
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Create a project-scoped user story for {typedProject.name}.
                  Assign it to a sprint now, or leave it in the backlog.
                </p>
              </div>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Sprints could not load for assignment. You can still create a
              backlog story without selecting a sprint.
            </div>
          ) : null}

          <StoryForm
            projectId={typedProject.id}
            sprints={sprintOptions}
            error={actionError}
          />
        </div>
      </div>
    </main>
  );
}
