import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Columns3,
  Target,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Sprint workspace",
  description: "Minavolve sprint workspace placeholder.",
};

type SprintDetailPageProps = {
  params: Promise<{
    projectId: string;
    sprintId: string;
  }>;
};

type SprintProject = {
  id: string;
  name: string;
  project_key: string;
};

type SprintDetail = {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

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

export default async function SprintDetailPage({
  params,
}: SprintDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { projectId, sprintId } = await params;
  const [{ data: project, error: projectError }, { data: sprint, error }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id,name,project_key")
        .eq("id", projectId)
        .maybeSingle(),
      supabase
        .from("sprints")
        .select(
          "id,project_id,name,goal,status,start_date,end_date,created_at,updated_at",
        )
        .eq("project_id", projectId)
        .eq("id", sprintId)
        .maybeSingle(),
    ]);

  if (projectError || error || !project || !sprint) {
    notFound();
  }

  const typedProject = project as SprintProject;
  const typedSprint = sprint as SprintDetail;

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
                  <ClipboardList className="size-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {typedProject.project_key} sprint workspace
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {typedSprint.name}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {typedSprint.goal ??
                      "No sprint goal yet. User stories, Kanban cards, and delivery metrics will be connected in later issues."}
                  </p>
                </div>
              </div>

              <span className="h-fit rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold capitalize text-brand">
                {typedSprint.status}
              </span>
            </div>
          </header>

          <section className="grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Start date",
                value: formatDate(typedSprint.start_date),
                Icon: CalendarDays,
              },
              {
                label: "End date",
                value: formatDate(typedSprint.end_date),
                Icon: CalendarDays,
              },
              {
                label: "Board state",
                value: "Placeholder",
                Icon: Columns3,
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

          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/72 p-6 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.7)]">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Target className="size-6" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-semibold text-slate-950">
              Sprint execution comes next
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This placeholder confirms project-scoped sprint routing and RLS
              reads. User story CRUD, Kanban data, drag-and-drop, charts, risks,
              and AI actions remain out of scope for Issue #12.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
