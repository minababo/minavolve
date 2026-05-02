import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { ProjectForm } from "@/components/projects/project-form";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "New project",
  description: "Create a Minavolve project.",
};

type NewProjectPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewProjectPage({
  searchParams,
}: NewProjectPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const error = getSearchParam(params.error);

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
            <div className="flex items-start gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <FolderPlus className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  Create workspace
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  New project
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Create the project record in Supabase. The database trigger
                  should add you to project_members as the owner.
                </p>
              </div>
            </div>
          </header>

          <ProjectForm error={error} />
        </div>
      </div>
    </main>
  );
}
