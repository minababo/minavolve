import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Columns3, MessageSquarePlus } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppNav } from "@/components/app/app-nav";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { Button } from "@/components/ui/button";
import {
  getStoryStatusSummary,
  isKanbanStatus,
  type KanbanStory,
} from "@/lib/kanban";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Kanban board",
  description: "Project-specific Minavolve Kanban board.",
};

type KanbanPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

type KanbanProject = {
  id: string;
  name: string;
  project_key: string;
  description: string | null;
};

type SprintLookup = {
  id: string;
  name: string;
};

type RawKanbanStory = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  acceptance_criteria: string[] | null;
  story_points: number | null;
  priority: string;
  status: string;
  sort_order: number | null;
  created_at: string;
};

function getKanbanLoadError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("status") ||
    normalized.includes("sort_order") ||
    normalized.includes("acceptance_criteria") ||
    normalized.includes("story_points") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The user_stories table is missing fields needed for the Kanban board. Confirm status, sort_order, acceptance_criteria, and story_points exist before retesting.";
  }

  return "Unable to load the Kanban board right now.";
}

export default async function ProjectKanbanPage({ params }: KanbanPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;
  const [
    { data: project, error: projectError },
    { data: sprints, error: sprintError },
    { data: stories, error: storyError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("id,name,project_key,description")
      .eq("id", projectId)
      .maybeSingle(),
    supabase
      .from("sprints")
      .select("id,name")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_stories")
      .select(
        "id,project_id,sprint_id,title,acceptance_criteria,story_points,priority,status,sort_order,created_at",
      )
      .eq("project_id", projectId)
      .in("status", ["backlog", "todo", "in_progress", "review", "done"])
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (projectError || !project) {
    notFound();
  }

  const typedProject = project as KanbanProject;
  const sprintNameById = new Map(
    ((sprints ?? []) as SprintLookup[]).map((sprint) => [
      sprint.id,
      sprint.name,
    ]),
  );

  const kanbanStories = storyError
    ? []
    : ((stories ?? []) as RawKanbanStory[]).flatMap<KanbanStory>((story) => {
        if (!isKanbanStatus(story.status)) {
          return [];
        }

        return [
          {
            ...story,
            status: story.status,
            sprint_name: story.sprint_id
              ? (sprintNameById.get(story.sprint_id) ?? "Sprint unavailable")
              : null,
          },
        ];
      });

  const summary = getStoryStatusSummary(kanbanStories);

  return (
    <>
      <AppNav userEmail={user.email ?? ""} />
      <main className="flex-1 px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-[1720px] space-y-6">
          <Link
            href={`/projects/${typedProject.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to project
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                  <Columns3 className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {typedProject.project_key} board
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Kanban board
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    An interactive board for {typedProject.name}. Drag story
                    cards between columns to update status while preserving
                    project-scoped Supabase RLS access.
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${typedProject.id}/stories/new`}>
                  <MessageSquarePlus className="size-4" />
                  New story
                </Link>
              </Button>
            </div>
          </header>

          <section className="grid gap-3 md:grid-cols-5" aria-label="Board status summary">
            {summary.map((item) => (
              <article
                key={item.status}
                className="rounded-[1.25rem] border border-white/80 bg-white/80 p-4 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.7)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                  {item.count}
                </p>
              </article>
            ))}
          </section>

          {storyError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
              {getKanbanLoadError(storyError.message)}
            </div>
          ) : null}

          {sprintError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Sprint names could not load, so story cards may show unavailable
              sprint labels.
            </div>
          ) : null}

          <section className="rounded-[2rem] border border-white/80 bg-white/88 p-4 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-5">
            <KanbanBoard
              projectId={typedProject.id}
              initialStories={kanbanStories}
            />
          </section>
        </div>
      </main>
    </>
  );
}
