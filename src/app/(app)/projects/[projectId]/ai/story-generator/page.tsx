import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";

import { getStoryGeneratorProject } from "@/app/(app)/projects/[projectId]/ai/story-generator/actions";
import { AppSidebar } from "@/components/app/app-sidebar";
import { UserStoryGeneratorForm } from "@/components/ai/user-story-generator-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI user story generator",
  description: "Generate structured Agile user stories for a Minavolve project.",
};

type StoryGeneratorPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function StoryGeneratorPage({
  params,
}: StoryGeneratorPageProps) {
  const { projectId } = await params;
  const project = await getStoryGeneratorProject(projectId);

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
                  <Bot className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {project.project_key} AI workflow
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    AI user story generator
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Turn a feature idea into a structured Agile user story for{" "}
                    {project.name}. The result is copy-ready for manual story
                    creation and logged to this project&apos;s AI generation
                    history.
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${project.id}/stories/new`}>
                  <Sparkles className="size-4" />
                  Manual story form
                </Link>
              </Button>
            </div>
          </header>

          <UserStoryGeneratorForm projectId={project.id} />
        </div>
      </div>
    </main>
  );
}
