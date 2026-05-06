import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FolderKanban,
  MessageSquarePlus,
  MessageSquareText,
  Plus,
  ShieldAlert,
  TimerReset,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import {
  SprintCard,
  type SprintCardSprint,
} from "@/components/sprints/sprint-card";
import {
  StoryCard,
  type StoryCardStory,
} from "@/components/stories/story-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Project workspace",
  description: "Minavolve project workspace placeholder.",
};

type ProjectWorkspacePageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

type ProjectWorkspace = {
  id: string;
  name: string;
  project_key: string;
  description: string | null;
  status: string;
  start_date: string | null;
  target_end_date: string | null;
  created_at: string;
  updated_at: string;
};

function getSprintListError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("start_date") ||
    normalized.includes("end_date") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The sprints table is missing the Issue #12 start_date or end_date columns. Apply the latest Supabase schema before listing sprints.";
  }

  return "Unable to load sprints for this project right now.";
}

function getStoryListError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("acceptance_criteria") ||
    normalized.includes("story_points") ||
    normalized.includes("schema cache") ||
    normalized.includes("column")
  ) {
    return "The user_stories table is missing Issue #14 story columns. Apply the latest Supabase schema before listing stories.";
  }

  return "Unable to load stories for this project right now.";
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id,name,project_key,description,status,start_date,target_end_date,created_at,updated_at",
    )
    .eq("id", projectId)
    .maybeSingle();

  if (error || !project) {
    notFound();
  }

  const typedProject = project as ProjectWorkspace;
  const { data: sprints, error: sprintsError } = await supabase
    .from("sprints")
    .select("id,project_id,name,goal,status,start_date,end_date,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  const sprintRows = (sprints ?? []) as SprintCardSprint[];
  const sprintNameById = new Map(
    sprintRows.map((sprint) => [sprint.id, sprint.name]),
  );
  const { data: stories, error: storiesError } = await supabase
    .from("user_stories")
    .select(
      "id,project_id,sprint_id,title,description,acceptance_criteria,story_points,priority,status,created_at",
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  const storyRows = ((stories ?? []) as StoryCardStory[]).map((story) => ({
    ...story,
    sprint_name: story.sprint_id
      ? (sprintNameById.get(story.sprint_id) ?? "Sprint unavailable")
      : null,
  }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <AppSidebar activeHref="/projects" />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-slate-950 font-heading text-sm font-semibold tracking-[0.14em] text-white">
                  {typedProject.project_key}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    Project workspace
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {typedProject.name}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {typedProject.description ??
                      "No project description yet. Project editing, sprint setup, and board data will be implemented in later issues."}
                  </p>
                </div>
              </div>

              <span className="h-fit rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold capitalize text-brand">
                {typedProject.status}
              </span>
            </div>
          </header>

          <section className="grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Start date",
                value: formatDate(typedProject.start_date),
                Icon: CalendarDays,
              },
              {
                label: "Target end",
                value: formatDate(typedProject.target_end_date),
                Icon: CalendarDays,
              },
              {
                label: "Workspace status",
                value: "Placeholder",
                Icon: FolderKanban,
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)]"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <item.Icon className="size-5" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  {item.value}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    Sprint planning
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                    Project sprints
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Sprints are scoped to this project and read through
                    Supabase RLS.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                >
                  <Link href={`/projects/${typedProject.id}/sprints/new`}>
                    <Plus className="size-4" />
                    New sprint
                  </Link>
                </Button>
              </div>

              {sprintsError ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
                  {getSprintListError(sprintsError.message)}
                </div>
              ) : sprintRows.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {sprintRows.map((sprint) => (
                    <SprintCard key={sprint.id} sprint={sprint} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center">
                  <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <TimerReset className="size-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-2xl font-semibold text-slate-950">
                    No sprints yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Create the first sprint for this project. User stories,
                    Kanban data, risks, charts, and AI support will connect to
                    sprints in later issues.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="mt-6 h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                  >
                    <Link href={`/projects/${typedProject.id}/sprints/new`}>
                      <ClipboardList className="size-4" />
                      Create first sprint
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            <article className="rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_25px_80px_-55px_rgba(15,23,42,0.9)]">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                <ShieldAlert className="size-6" />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-semibold">
                Access model
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Project data is read through Supabase RLS. If you can view this
                workspace, the current user is allowed to read this project.
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">
                Project members are expected to be created by the database
                trigger when a project is inserted.
              </div>
            </article>
          </section>

          <section className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  Backlog
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">
                  User stories
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Stories are scoped to this project and can optionally be
                  assigned to one of the project sprints.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${typedProject.id}/stories/new`}>
                  <MessageSquarePlus className="size-4" />
                  New story
                </Link>
              </Button>
            </div>

            {storiesError ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
                {getStoryListError(storiesError.message)}
              </div>
            ) : storyRows.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {storyRows.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center">
                <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <MessageSquareText className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-slate-950">
                  No stories yet
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Create the first user story for this project. Kanban movement,
                  drag-and-drop, risks, charts, and AI support will connect to
                  stories in later issues.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                >
                  <Link href={`/projects/${typedProject.id}/stories/new`}>
                    <MessageSquarePlus className="size-4" />
                    Create first story
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
