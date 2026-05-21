import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { FeatureCard } from "@/components/marketing/feature-card";
import { SiteHeader } from "@/components/marketing/site-header";
import { StatCard } from "@/components/marketing/stat-card";
import { Button } from "@/components/ui/button";
import {
  marketingFeatures,
  marketingStats,
  roadmapItems,
  siteConfig,
  sprintBoardPreview,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44rem] bg-[radial-gradient(circle_at_top_left,_rgba(4,120,136,0.22),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(255,255,255,0.98))]" />
        <div className="pointer-events-none absolute inset-x-0 top-64 -z-10 h-[32rem] bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.05),_transparent_55%)]" />

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="flex flex-col gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/75 px-4 py-2 text-sm font-medium text-brand shadow-sm backdrop-blur">
                <Sparkles className="size-4" />
                Agile sprint board with Groq AI integration
              </div>
              <h1 className="mt-6 max-w-xl font-heading text-5xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Run the sprint from one board and let AI handle the noisy
                parts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                {siteConfig.description} Authentication, project management,
                Kanban boards, risk registers, burndown analytics, and AI story
                generation are all live and connected to Supabase.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6 text-sm">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white/70 px-6 text-sm backdrop-blur"
                >
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  Next.js 16 App Router
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  TypeScript
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  Tailwind CSS 4
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                  Supabase + Groq
                </span>
              </div>
            </div>

            <div
              id="preview"
              className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur sm:p-6"
            >
              <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200/80 bg-slate-950 px-5 py-4 text-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Sprint Board Preview
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold">
                    Launch Week
                  </h2>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    12 tasks
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
                    On track
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {sprintBoardPreview.map((column) => (
                  <section
                    key={column.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-heading text-base font-semibold text-slate-900">
                        {column.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${column.badgeClass}`}
                      >
                        {column.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {column.cards.map((card) => (
                        <article
                          key={card.title}
                          className="rounded-[1.25rem] border border-white bg-white p-4 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.75)]"
                        >
                          <p className="font-medium text-slate-900">
                            {card.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {card.meta}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {marketingStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </section>

          <section
            id="features"
            className="grid gap-6 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_80px_-55px_rgba(15,23,42,0.65)] backdrop-blur lg:grid-cols-3"
          >
            {marketingFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </section>

          <section
            id="roadmap"
            className="grid gap-8 rounded-[2rem] bg-slate-950 px-6 py-8 text-slate-50 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
                What&apos;s built
              </p>
              <h2 className="mt-4 max-w-sm font-heading text-3xl font-semibold">
                Authentication, boards, risks, and AI generation are all live.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Every feature connects to Supabase with RLS-enforced data
                access and server-side auth. Browse any project workspace to
                see it working end to end.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Supabase Auth + RLS
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  PostgreSQL + real data
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  Groq AI integration
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {roadmapItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-brand/15 bg-white/80 px-6 py-8 shadow-[0_20px_80px_-55px_rgba(15,23,42,0.65)] backdrop-blur sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand">
                  Ready to use
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-950">
                  Authentication, boards, risks, and AI generation are all
                  connected.
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  Log in to access your project workspaces. From there you can
                  plan sprints, manage stories on the Kanban board, track
                  delivery risks, view burndown charts, and generate AI user
                  stories using Groq.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white"
                >
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
