import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckSquare,
  ClipboardList,
  Columns3,
  Flag,
  Gauge,
  MessageSquareText,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Story workspace",
  description: "Minavolve user story workspace placeholder.",
};

type StoryDetailPageProps = {
  params: Promise<{
    projectId: string;
    storyId: string;
  }>;
};

type StoryProject = {
  id: string;
  name: string;
  project_key: string;
};

type StoryDetail = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  acceptance_criteria: string[] | null;
  story_points: number;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type StorySprint = {
  id: string;
  name: string;
} | null;

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId, storyId } = await params;
  const [{ data: project, error: projectError }, { data: story, error }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id,name,project_key")
        .eq("id", projectId)
        .maybeSingle(),
      supabase
        .from("user_stories")
        .select(
          "id,project_id,sprint_id,title,description,acceptance_criteria,story_points,priority,status,created_at,updated_at",
        )
        .eq("project_id", projectId)
        .eq("id", storyId)
        .maybeSingle(),
    ]);

  if (projectError || error || !project || !story) {
    notFound();
  }

  const typedProject = project as StoryProject;
  const typedStory = story as StoryDetail;
  let sprint: StorySprint = null;

  if (typedStory.sprint_id) {
    const { data } = await supabase
      .from("sprints")
      .select("id,name")
      .eq("project_id", projectId)
      .eq("id", typedStory.sprint_id)
      .maybeSingle();

    sprint = data as StorySprint;
  }

  const criteria = typedStory.acceptance_criteria ?? [];

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
            Back to {typedProject.name}
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                  <MessageSquareText className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {typedProject.project_key} story workspace
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {typedStory.title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {typedStory.description ??
                      "No story description yet. Use the Kanban board to move this story through the workflow."}
                  </p>
                </div>
              </div>

              <span className="h-fit rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold capitalize text-brand">
                {typedStory.status.replaceAll("_", " ")}
              </span>
            </div>
          </header>

          <Link
            href={`/projects/${typedProject.id}/kanban`}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Columns3 className="size-4" />
            Open Kanban board
          </Link>

          <section className="grid gap-5 md:grid-cols-4">
            {[
              {
                label: "Story points",
                value: String(typedStory.story_points),
                Icon: Gauge,
              },
              {
                label: "Priority",
                value: typedStory.priority,
                Icon: Flag,
              },
              {
                label: "Sprint",
                value: sprint?.name ?? "No sprint",
                Icon: ClipboardList,
              },
              {
                label: "Criteria",
                value: String(criteria.length),
                Icon: CheckSquare,
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
                <p className="mt-2 font-heading text-2xl font-semibold capitalize text-slate-950">
                  {item.value}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)]">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">
              Acceptance criteria
            </h2>
            {criteria.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {criteria.map((criterion, index) => (
                  <li
                    key={`${criterion}-${index}`}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    <CheckSquare className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No acceptance criteria were added for this story.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
