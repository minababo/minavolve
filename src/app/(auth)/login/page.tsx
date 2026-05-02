import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Login",
  description: "Placeholder login route for the Minavolve app foundation.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]" />

      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <Lock className="size-6" />
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            Authentication placeholder
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold">
            Login route is ready for real auth wiring.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            This page gives the future sign-in experience a visual home without
            introducing sessions, providers, or database dependencies in this
            issue.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              "Supabase auth integration will land in a later issue.",
              "Credential handling and validation are intentionally absent here.",
              "The route already exists, so future auth logic has a clean entry point.",
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

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.6)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" />
            {siteConfig.name}
          </div>
          <h2 className="mt-5 font-heading text-3xl font-semibold text-slate-950">
            Sign in placeholder
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Use this route for the future email/password or provider-based login
            flow. Inputs are intentionally disabled until auth is implemented.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-800">
              Email
              <input
                disabled
                type="email"
                placeholder="you@team.com"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-800">
              Password
              <input
                disabled
                type="password"
                placeholder="********"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button disabled size="lg" className="rounded-full px-6">
              Auth coming soon
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white"
            >
              <Link href="/register">Open register</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-950"
            >
              <ArrowLeft className="size-4" />
              Back to landing page
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-950"
            >
              Jump to dashboard placeholder
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
