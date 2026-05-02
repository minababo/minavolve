import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  ProjectCard,
  type ProjectCardProject,
} from "@/components/projects/project-card";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Projects",
  description: "Authenticated Minavolve project listing.",
};

function getProjectListError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("project_key") ||
    normalized.includes("start_date") ||
    normalized.includes("target_end_date")
  ) {
    return "The projects table is missing Issue #10 columns. Apply the latest Supabase schema before project listing can use the new fields.";
  }

  return "Unable to load projects right now.";
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,name,project_key,description,status,start_date,target_end_date,created_at",
    )
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as ProjectCardProject[];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 lg:flex-row">
        <div className="lg:w-72 lg:shrink-0">
          <AppSidebar activeHref="/projects" />
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <FolderKanban className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    Project portfolio
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Projects
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Projects are loaded through Supabase RLS, so this list only
                    includes workspaces where you are a member or owner.
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
              >
                <Link href="/projects/new">
                  <Plus className="size-4" />
                  New project
                </Link>
              </Button>
            </div>
          </header>

          {error ? (
            <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 sm:p-6">
              <h2 className="font-heading text-2xl font-semibold">
                Projects could not load
              </h2>
              <p className="mt-2 text-sm leading-6">
                {getProjectListError(error.message)}
              </p>
            </section>
          ) : projects.length > 0 ? (
            <section
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              aria-label="Project list"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </section>
          ) : (
            <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/72 p-8 text-center shadow-[0_25px_80px_-60px_rgba(15,23,42,0.7)]">
              <div className="mx-auto inline-flex size-14 items-center justify-center rounded-3xl bg-brand-soft text-brand">
                <FolderKanban className="size-7" />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-semibold text-slate-950">
                No projects yet
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Create your first project to seed the authenticated workspace.
                Sprint planning, stories, risks, and AI support will attach to
                projects in later issues.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
              >
                <Link href="/projects/new">
                  <Plus className="size-4" />
                  Create first project
                </Link>
              </Button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
