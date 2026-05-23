import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { redirect } from "next/navigation";

import { AppNav } from "@/components/app/app-nav";
import { ProjectForm } from "@/components/projects/project-form";
import { createClient } from "@/utils/supabase/server";

import { updateProject } from "./actions";

export const metadata: Metadata = {
  title: "Edit project",
  description: "Edit project details.",
};

type EditProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

type EditableProject = {
  id: string;
  name: string;
  project_key: string;
  description: string | null;
  status: string;
  start_date: string | null;
  target_end_date: string | null;
  owner_id: string;
};

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditProjectPage({
  params,
  searchParams,
}: EditProjectPageProps) {
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
      "id,name,project_key,description,status,start_date,target_end_date,owner_id",
    )
    .eq("id", projectId)
    .maybeSingle();

  if (error || !project) {
    redirect(`/projects`);
  }

  const typedProject = project as EditableProject;

  if (typedProject.owner_id !== user.id) {
    redirect(`/projects/${projectId}`);
  }

  const query = await searchParams;
  const editError = getSearchParam(query.error);

  return (
    <>
      <AppNav userEmail={user.email ?? ""} />
      <main className="flex-1 px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Link
            href={`/projects/${typedProject.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to {typedProject.name}
          </Link>

          <header className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <Pencil className="size-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                  Project editing
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Edit project
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {typedProject.name}
                  <span className="ml-2 font-mono tracking-[0.1em] text-slate-400">
                    · {typedProject.project_key}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <ProjectForm
            action={updateProject}
            editMode
            projectId={typedProject.id}
            defaultValues={{
              name: typedProject.name,
              description: typedProject.description,
              status: typedProject.status,
              start_date: typedProject.start_date,
              target_end_date: typedProject.target_end_date,
            }}
            error={editError}
          />
        </div>
      </main>
    </>
  );
}
