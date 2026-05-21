import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus, ShieldAlert } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import {
  RiskCard,
  type RiskCardRisk,
} from "@/components/risks/risk-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Risk register",
  description: "Project risk register for a Minavolve project.",
};

type RisksPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function RisksPage({ params }: RisksPageProps) {
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

  const { data: risks } = await supabase
    .from("risks")
    .select(
      "id,project_id,title,description,likelihood,impact,status,created_at",
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const riskList = (risks ?? []) as RiskCardRisk[];

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
                  <ShieldAlert className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {project.project_key} risk register
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Risk register
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Delivery risks for {project.name}. Risk score is
                    probability × impact (max 25).
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="h-10 rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${project.id}/risks/new`}>
                  <Plus className="size-4" />
                  Add risk
                </Link>
              </Button>
            </div>
          </header>

          {riskList.length > 0 ? (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {riskList.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-12 text-center">
              <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ShieldAlert className="size-6" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-slate-950">
                No risks yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                Add delivery risks for this project. Risks are scored by
                probability × impact to help prioritise mitigation.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
              >
                <Link href={`/projects/${project.id}/risks/new`}>
                  <Plus className="size-4" />
                  Add first risk
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
