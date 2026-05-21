import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { logout } from "@/app/(app)/dashboard/actions";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { DashboardCard } from "@/components/app/dashboard-card";
import { DashboardSection } from "@/components/app/dashboard-section";
import { KanbanPreview } from "@/components/app/kanban-preview";
import { Button } from "@/components/ui/button";
import {
  analyticsHighlights,
  assistantPrompts,
  getDashboardSummaryCards,
  recentProjects,
  riskRegisterItems,
  sprintPlanningItems,
} from "@/lib/dashboard";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Authenticated Minavolve dashboard layout.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email ?? "Authenticated user";
  const { count: projectCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });
  const { count: activeSprintCount } = await supabase
    .from("sprints")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");
  const { count: userStoryCount } = await supabase
    .from("user_stories")
    .select("id", { count: "exact", head: true });
  const summaryCards = getDashboardSummaryCards(
    projectCount ?? 0,
    activeSprintCount ?? 0,
    userStoryCount ?? 0,
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <AppSidebar />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <AppTopbar userEmail={userEmail} onLogout={logout} />

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
            <div className="space-y-6">
              <DashboardSection
                id="recent-projects"
                eyebrow="Portfolio"
                title="Recent projects"
                description="Project CRUD is now available. This dashboard section still keeps a lightweight planning preview until richer project activity lands."
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
                <div className="grid gap-3">
                  {recentProjects.map((project) => (
                    <article
                      key={project.code}
                      className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[0.65fr_1fr_auto]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-heading text-sm font-semibold text-white">
                          {project.code}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {project.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {project.status}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">
                        {project.focus}
                      </p>
                      <span className="h-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
                        {project.health}
                      </span>
                    </article>
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                id="sprint-planning"
                eyebrow="Planning"
                title="Sprint planning"
                description="A non-interactive planning snapshot for scope, capacity, and review readiness."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {sprintPlanningItems.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-slate-950">
                          {item.label}
                        </h3>
                        <span className="font-mono text-sm text-brand">
                          {item.progress}
                        </span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: item.progress }}
                        />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                id="kanban-preview"
                eyebrow="Board"
                title="Kanban preview"
                description="Project workspaces now include a drag-and-drop Kanban board that persists story status and order through Supabase. This dashboard preview remains static."
              >
                <KanbanPreview />
              </DashboardSection>
            </div>

            <div className="space-y-6">
              <DashboardSection
                id="risk-register"
                eyebrow="Risk"
                title="Risk register"
                description="Delivery risks are mocked until project and activity data are available."
              >
                <div className="space-y-3">
                  {riskRegisterItems.map((risk) => (
                    <article
                      key={risk.label}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          {risk.severity}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {risk.owner}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {risk.label}
                      </p>
                    </article>
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                id="delivery-analytics"
                eyebrow="Analytics"
                title="Delivery analytics"
                description="Sprint velocity charts are available in project workspaces. This dashboard section keeps static KPI tiles."
              >
                <div className="grid gap-3">
                  {analyticsHighlights.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-semibold text-slate-700">
                          {item.label}
                        </h3>
                        <p className="font-heading text-3xl font-semibold text-slate-950">
                          {item.value}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                id="ai-assistant"
                eyebrow="Assistant"
                title="AI assistant"
                description="Project workspaces include an AI user story generator and an AI acceptance criteria generator. Both call Groq from a protected server route and log successful generations."
                dark
              >
                <div className="space-y-3">
                  {assistantPrompts.map((prompt) => (
                    <article
                      key={prompt.label}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4"
                    >
                      <p className="font-semibold text-white">
                        {prompt.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {prompt.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </DashboardSection>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
