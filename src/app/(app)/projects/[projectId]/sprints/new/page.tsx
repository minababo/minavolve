import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TimerReset } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { SprintForm } from "@/components/sprints/sprint-form";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "New sprint",
  description: "Create a Minavolve sprint.",
};

type NewSprintPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

type SprintProject = {
  id: string;
  name: string;
  project_key: string;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewSprintPage({
  params,
  searchParams,
}: NewSprintPageProps) {
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

  const typedProject = project as SprintProject;
  const query = await searchParams;
  const error = getSearchParam(query.error);

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
            Back to project
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <TimerReset className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  {typedProject.project_key} sprint setup
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  New sprint
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Create a sprint inside {typedProject.name}. Sprint work stays
                  scoped to this project through Supabase RLS.
                </p>
              </div>
            </div>
          </header>

          <SprintForm projectId={typedProject.id} error={error} />
        </div>
      </div>
    </main>
  );
}
