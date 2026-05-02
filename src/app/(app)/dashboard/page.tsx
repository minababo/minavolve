import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { redirect } from "next/navigation";

import { logout } from "@/app/(app)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { roadmapItems, sprintBoardPreview } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected dashboard route for Minavolve.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.7)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-slate-50">
                <LayoutDashboard className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand">
                  Authenticated dashboard
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                  Sprint board shell
                </h1>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
                  You are signed in as{" "}
                  <span className="font-semibold text-slate-950">
                    {user.email}
                  </span>
                  . Project, sprint, and Kanban data will be added in later
                  issues.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                <ShieldCheck className="size-4" />
                Session verified
              </div>
              <form action={logout}>
                <Button
                  type="submit"
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-slate-300 bg-white px-6 sm:w-auto"
                >
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.7)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Current sprint
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-slate-950">
                  Launch Week
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-brand-soft px-3 py-1.5 text-brand">
                  Static preview
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-900">
                  CRUD later
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                        className="rounded-[1.25rem] border border-white bg-white p-4 shadow-[0_14px_40px_-32px_rgba(15,23,42,0.7)]"
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

          <div className="grid gap-6">
            <section className="rounded-[2rem] bg-slate-950 p-6 text-slate-50 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.95)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-2xl font-semibold">
                  Assistant panel
                </h2>
                <Bot className="size-5 text-cyan-300" />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The future AI surface remains a placeholder. Authentication is
                now in place; AI API calls are still intentionally out of scope.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Supabase session refresh is active",
                  "Dashboard access requires a verified user",
                  "Logout clears the Supabase Auth session",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.7)] backdrop-blur">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-brand" />
                <h2 className="font-heading text-2xl font-semibold text-slate-950">
                  Next implementation slices
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                {roadmapItems.map((item, index) => (
                  <article
                    key={item.label}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="inline-flex size-9 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                        {index === 0 ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <Clock3 className="size-4" />
                        )}
                      </div>
                      <h3 className="font-medium text-slate-900">
                        {item.label}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-950"
        >
          Back to public landing page
        </Link>
      </div>
    </main>
  );
}
