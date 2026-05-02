import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register",
  description: "Placeholder registration route for the Minavolve app foundation.",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(8,145,178,0.16),_transparent_32%)]" />

      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.6)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" />
            Build the workspace later
          </div>
          <h1 className="mt-5 font-heading text-4xl font-semibold text-slate-950">
            Registration route is scaffolded and ready for onboarding logic.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            This screen reserves the future account creation flow while keeping
            the current issue focused on routing, copy, and visual foundation.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-800">
              Full name
              <input
                disabled
                type="text"
                placeholder="Alex Johnson"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-800">
              Team email
              <input
                disabled
                type="email"
                placeholder="alex@minavolve.app"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-medium text-slate-800">
            Workspace name
            <input
              disabled
              type="text"
              placeholder="Launch Week Sprint Board"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-100"
            />
          </label>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button disabled size="lg" className="rounded-full px-6">
              Account creation later
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white"
            >
              <Link href="/login">Open login</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-600">
            Planned next steps: Supabase auth, onboarding flows, team creation,
            and protected dashboard access.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to landing page
          </Link>
        </section>

        <section className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <UserPlus className="size-6" />
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            {siteConfig.name}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold">
            A deliberate route shell beats a rushed auth form.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Keeping registration as a placeholder avoids fake behavior while the
            real account model, permissions, and session strategy are still
            being defined.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              "Route grouping keeps auth pages organized without changing the URL.",
              "Shared branding and copy already match the dashboard shell.",
              "Future onboarding can plug into this screen without a design reset.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
