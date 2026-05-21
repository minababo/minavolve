import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bot, MessageSquarePlus } from "lucide-react";

import { getAcceptanceCriteriaGeneratorProject } from "@/app/(app)/projects/[projectId]/ai/acceptance-criteria/actions";
import { AppNav } from "@/components/app/app-nav";
import { AcceptanceCriteriaGeneratorForm } from "@/components/ai/acceptance-criteria-generator-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "AI acceptance criteria generator",
  description:
    "Generate testable acceptance criteria for an Agile user story.",
};

type AcceptanceCriteriaGeneratorPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function AcceptanceCriteriaGeneratorPage({
  params,
}: AcceptanceCriteriaGeneratorPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { projectId } = await params;
  const project = await getAcceptanceCriteriaGeneratorProject(projectId);

  return (
    <>
      <AppNav userEmail={user?.email ?? ""} />
      <main className="flex-1 px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto w-full max-w-6xl space-y-6">
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
                  <Bot className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {project.project_key} AI workflow
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    AI acceptance criteria generator
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Turn a user story title into 3 to 8 testable acceptance
                    criteria for {project.name}. The result is copy-ready for
                    the manual story form and logged to this project&apos;s AI
                    generation history.
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${project.id}/stories/new`}>
                  <MessageSquarePlus className="size-4" />
                  Manual story form
                </Link>
              </Button>
            </div>
          </header>

          <AcceptanceCriteriaGeneratorForm projectId={project.id} />
        </div>
      </main>
    </>
  );
}
