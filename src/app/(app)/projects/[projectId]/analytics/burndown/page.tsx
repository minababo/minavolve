import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { BurndownChart } from "@/components/charts/burndown-chart";
import { SprintSelector } from "@/components/charts/sprint-selector";
import { buildBurndownData } from "@/lib/charts";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Sprint burndown",
  description: "Sprint burndown chart for a Minavolve project.",
};

type BurndownPageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ sprintId?: string }>;
};

export default async function BurndownPage({
  params,
  searchParams,
}: BurndownPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;
  const { sprintId: querySprintId } = await searchParams;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,name,project_key")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    notFound();
  }

  const { data: sprints } = await supabase
    .from("sprints")
    .select("id,name,start_date,end_date,status")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const sprintList = sprints ?? [];
  const selectedSprint =
    sprintList.find((s) => s.id === querySprintId) ?? sprintList[0] ?? null;

  let stories: Array<{ story_points: number | null; status: string }> = [];
  if (selectedSprint) {
    const { data } = await supabase
      .from("user_stories")
      .select("story_points,status")
      .eq("project_id", projectId)
      .eq("sprint_id", selectedSprint.id);
    stories = data ?? [];
  }

  const burndownData = selectedSprint
    ? buildBurndownData(selectedSprint, stories)
    : [];

  const totalPoints = stories.reduce(
    (sum, s) => sum + (s.story_points ?? 0),
    0,
  );
  const donePoints = stories
    .filter((s) => s.status === "done")
    .reduce((sum, s) => sum + (s.story_points ?? 0), 0);
  const remainingPoints = totalPoints - donePoints;
  const completionPct =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <AppSidebar activeHref="/projects" />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to project
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <TrendingDown className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {project.project_key} analytics
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Sprint burndown
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Remaining story points over time for {project.name}. The
                    ideal line assumes steady daily progress from sprint start
                    to end.
                  </p>
                </div>
              </div>

              {sprintList.length > 0 && (
                <SprintSelector
                  sprints={sprintList}
                  selectedSprintId={selectedSprint?.id ?? null}
                  projectId={project.id}
                />
              )}
            </div>
          </header>

          {selectedSprint && stories.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total points", value: String(totalPoints) },
                { label: "Remaining", value: String(remainingPoints) },
                { label: "Completed", value: `${completionPct}%` },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)]"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                    {item.value}
                  </p>
                </article>
              ))}
            </section>
          )}

          <section className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-slate-950">
                  Remaining points by day
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {!selectedSprint
                    ? "Create sprints to start tracking burndown."
                    : !selectedSprint.start_date || !selectedSprint.end_date
                      ? "Add a start date and end date to this sprint to see the burndown chart."
                      : burndownData.length === 0
                        ? "Assign story points to stories in this sprint to track burndown."
                        : `${selectedSprint.name} · simplified burndown`}
                </p>
              </div>
              <Link
                href={`/projects/${project.id}/analytics/velocity`}
                className="shrink-0 text-sm font-medium text-brand transition-colors hover:text-brand/80"
              >
                View velocity →
              </Link>
            </div>

            <BurndownChart data={burndownData} />
          </section>
        </div>
      </div>
    </main>
  );
}
