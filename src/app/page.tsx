import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Sparkles,
  WandSparkles,
} from "lucide-react";

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
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/75 px-4 py-2 text-sm font-medium text-brand shadow-sm backdrop-blur">
                <Sparkles className="size-4" />
                Agile sprint board foundation, ready for AI later
              </div>
              <h1 className="mt-6 max-w-xl font-heading text-5xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Run the sprint from one board and let AI handle the noisy
                parts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                {siteConfig.description} This first issue focuses on a polished
                product surface, route structure, and a dashboard shell that
                later issues can connect to Supabase, drag-and-drop, and AI
                workflows.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6 text-sm">
                  <Link href="/dashboard">
                    Open dashboard placeholder
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white/70 px-6 text-sm backdrop-blur"
                >
                  <Link href="/register">Preview auth routes</Link>
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
                  Supabase-ready structure
                </span>
              </div>
            </div>

            <div
              id="preview"
              className="relative rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)] backdrop-blur sm:p-6"
            >
              <div className="absolute -left-8 top-8 hidden rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg lg:block">
                <p className="font-medium">Sprint 08 Focus</p>
                <p className="mt-1 text-amber-700">
                  Finish board shell, auth copy, and dashboard scaffolding.
                </p>
              </div>
              <div className="absolute -right-6 bottom-12 hidden max-w-[15rem] rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 shadow-lg xl:block">
                <p className="font-medium">AI prompt queue</p>
                <p className="mt-1 text-cyan-800">
                  &quot;Summarize blockers before standup&quot; sits ready for
                  the next issue.
                </p>
              </div>

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

              <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
                <div className="grid gap-4 md:grid-cols-2">
                  {sprintBoardPreview.map((column) => (
                    <section
                      key={column.title}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-heading text-lg font-semibold text-slate-900">
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

                <aside className="rounded-[1.75rem] bg-slate-950 p-5 text-slate-50 shadow-[0_25px_50px_-35px_rgba(15,23,42,0.95)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
                      <Bot className="size-6" />
                    </div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
                      AI assistant
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-semibold">
                    Ritual support without context switching
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The assistant panel is positioned to summarize sprint
                    health, collect blockers, and suggest next actions directly
                    beside the board.
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      "Generate a standup summary from in-progress work.",
                      "Flag tasks that have stalled across consecutive updates.",
                      "Draft a sprint review recap from completed cards.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <WandSparkles className="mt-0.5 size-4 text-cyan-300" />
                        <p className="text-sm leading-6 text-slate-200">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Next prompt
                    </p>
                    <p className="mt-2 font-mono text-sm text-cyan-200">
                      /standup summarize today&apos;s blockers and owner updates
                    </p>
                  </div>
                </aside>
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
                Foundation roadmap
              </p>
              <h2 className="mt-4 max-w-sm font-heading text-3xl font-semibold">
                This issue sets the surface area. The workflow comes next.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                The current build intentionally stops short of auth, Supabase,
                drag-and-drop, and API integrations. Those pieces are easier to
                layer in now that the routes, shared copy, and visual system are
                in place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  No real authentication yet
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  No database calls yet
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  No AI API routes yet
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
                      {item.label === "Realtime auth" ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Clock3 className="size-5" />
                      )}
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
                  Ready for the next issue
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-950">
                  Explore the route structure now, then wire up the real
                  product behavior.
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  The landing page, auth placeholders, and dashboard shell are
                  intentionally polished so future implementation can focus on
                  data, permissions, and automation instead of rebuilding the
                  presentation layer.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/login">Visit login</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white"
                >
                  <Link href="/dashboard">Visit dashboard</Link>
                </Button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
