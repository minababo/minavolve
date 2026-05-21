import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { VelocityChart } from "@/components/charts/velocity-chart";
import { Button } from "@/components/ui/button";
import { buildVelocityData } from "@/lib/charts";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Sprint velocity",
  description: "Sprint velocity chart for a Minavolve project.",
};

type VelocityPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function VelocityPage({ params }: VelocityPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId } = await params;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,name,project_key")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    notFound();
  }

  const [{ data: sprints }, { data: doneStories }] = await Promise.all([
    supabase
      .from("sprints")
      .select("id,name")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true }),
    supabase
      .from("user_stories")
      .select("sprint_id,story_points")
      .eq("project_id", projectId)
      .eq("status", "done"),
  ]);

  const velocityData = buildVelocityData(sprints ?? [], doneStories ?? []);

  const totalPoints = velocityData.reduce(
    (sum, d) => sum + d.completedPoints,
    0,
  );
  const avgVelocity =
    velocityData.length > 0
      ? (totalPoints / velocityData.length).toFixed(1)
      : "—";

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
                  <BarChart3 className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {project.project_key} analytics
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Sprint velocity
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Total story points completed per sprint for {project.name}.
                    Only stories with status Done contribute to the velocity
                    total.
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${project.id}/sprints/new`}>
                  <Plus className="size-4" />
                  New sprint
                </Link>
              </Button>
            </div>
          </header>

          {velocityData.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Sprints tracked",
                  value: String(velocityData.length),
                },
                {
                  label: "Total completed pts",
                  value: String(totalPoints),
                },
                {
                  label: "Average velocity",
                  value: avgVelocity,
                },
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
            <div className="mb-6">
              <h2 className="font-heading text-xl font-semibold text-slate-950">
                Completed story points per sprint
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {velocityData.length === 0
                  ? "Create sprints and move stories to Done to start tracking velocity."
                  : `${velocityData.length} sprint${velocityData.length === 1 ? "" : "s"} tracked`}
              </p>
            </div>

            <VelocityChart data={velocityData} />
          </section>
        </div>
      </div>
    </main>
  );
}
