import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNav } from "@/components/app/app-nav";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DashboardSection } from "@/components/app/dashboard-section";
import { Button } from "@/components/ui/button";
import { getDashboardSummaryCards } from "@/lib/dashboard";
import { cn } from "@/lib/utils";
import { riskScore } from "@/lib/validators/risk";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Authenticated Minavolve dashboard layout.",
};

type LatestProject = {
  id: string;
  name: string;
  project_key: string;
  status: string | null;
  created_at: string;
};

type ActiveRiskDashboard = {
  id: string;
  project_id: string;
  title: string;
  likelihood: string;
  impact: string;
  status: string;
  projects: { name: string; project_key: string } | null;
};

function getSeverityLabel(score: number): string {
  if (score === 9) return "Critical";
  if (score >= 6) return "High";
  if (score >= 3) return "Medium";
  return "Low";
}

function getSeverityBadgeClass(score: number): string {
  if (score === 9) return "bg-rose-100 text-rose-800";
  if (score >= 6) return "bg-orange-100 text-orange-800";
  if (score >= 3) return "bg-amber-100 text-amber-800";
  return "bg-emerald-100 text-emerald-800";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { count: projectCount },
    { count: activeSprintCount },
    { count: userStoryCount },
    { count: openRiskCount },
    { data: latestProjectsData },
    { data: activeRisksData },
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("sprints")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("user_stories").select("id", { count: "exact", head: true }),
    supabase
      .from("risks")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("projects")
      .select("id, name, project_key, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("risks")
      .select(
        "id, project_id, title, likelihood, impact, status, projects(name, project_key)",
      )
      .in("status", ["open", "mitigating"])
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const summaryCards = getDashboardSummaryCards(
    projectCount ?? 0,
    activeSprintCount ?? 0,
    userStoryCount ?? 0,
    openRiskCount ?? 0,
  );

  const projects = (latestProjectsData ?? []) as LatestProject[];
  const activeRisks =
    (activeRisksData ?? []) as unknown as ActiveRiskDashboard[];

  return (
    <>
      <AppNav userEmail={user.email ?? ""} />
      <main className="flex-1 px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <section
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            aria-label="Dashboard summary"
          >
            {summaryCards.map((card) => (
              <DashboardCard
                key={card.label}
                label={card.label}
                value={card.value}
                detail={card.detail}
                trend={card.trend}
                tone={card.tone}
                Icon={card.Icon}
              />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
            {/* Section A: Recent projects */}
            <DashboardSection
              id="recent-projects"
              eyebrow="Portfolio"
              title="Recent projects"
              description="Your most recently created projects. Full project management is available in each workspace."
              action={
                <Button
                  asChild
                  size="lg"
                  className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                >
                  <Link href="/projects/new">
                    <Plus className="size-4" />
                    New project
                  </Link>
                </Button>
              }
            >
              {projects.length > 0 ? (
                <div className="grid gap-3">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="group grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-slate-300 hover:bg-white md:grid-cols-[auto_1fr_auto]"
                    >
                      <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-heading text-sm font-semibold text-white">
                        {project.project_key}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">
                          {project.name}
                        </p>
                        <p className="mt-0.5 text-sm capitalize text-slate-500">
                          {project.status ?? "active"}
                        </p>
                      </div>
                      <span className="hidden self-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-slate-300 md:inline-block">
                        Open →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    No projects yet.{" "}
                    <Link
                      href="/projects/new"
                      className="font-medium text-brand underline-offset-2 hover:underline"
                    >
                      Create your first project
                    </Link>{" "}
                    to get started.
                  </p>
                </div>
              )}
            </DashboardSection>

            {/* Section B: Active risks */}
            <DashboardSection
              id="active-risks"
              eyebrow="Risk"
              title="Active risks"
              description="Open and mitigating delivery risks across your projects."
            >
              {activeRisks.length > 0 ? (
                <div className="space-y-2">
                  {activeRisks.map((risk) => {
                    const score = riskScore(risk.likelihood, risk.impact);
                    return (
                      <Link
                        key={risk.id}
                        href={`/projects/${risk.project_id}/risks`}
                        className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-3 transition-colors hover:border-slate-300 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {risk.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {risk.projects?.name ?? "Unknown project"}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              getSeverityBadgeClass(score),
                            )}
                          >
                            {getSeverityLabel(score)}
                          </span>
                          <span className="text-xs capitalize text-slate-400">
                            {risk.status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="pt-1">
                    <Link
                      href="/projects"
                      className="text-xs font-medium text-brand underline-offset-2 hover:underline"
                    >
                      View all risks by project →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-[1.25rem] border border-dashed border-emerald-200 bg-emerald-50/50 p-5 text-center">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-800">
                    No open or mitigating risks — all clear.
                  </p>
                </div>
              )}
            </DashboardSection>
          </div>
        </div>
      </main>
    </>
  );
}
