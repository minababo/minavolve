import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FolderKanban,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
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
            <article className="rounded-[2rem] border border-dashed border-slate-300 bg-white/72 p-6 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.7)]">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <ClipboardList className="size-6" />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-semibold text-slate-950">
                Sprint workspace coming next
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This page confirms project routing and membership-protected
                access. Sprint CRUD, user stories, Kanban data, risks, charts,
                and AI workflows remain intentionally out of scope.
              </p>
              <Button
                disabled
                size="lg"
                className="mt-6 h-11 rounded-2xl bg-slate-300 px-5 text-slate-600"
              >
                <Plus className="size-4" />
                Add sprint later
              </Button>
            </article>

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
        </div>
      </div>
    </main>
  );
}
