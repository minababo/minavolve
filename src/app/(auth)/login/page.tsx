import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
} from "lucide-react";
import { redirect } from "next/navigation";

import { login } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Minavolve with Supabase Auth.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]" />

      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <Lock className="size-6" />
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            {siteConfig.name}
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold">
            Sign in to your sprint workspace.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Email and password authentication is handled by Supabase Auth.
            Project data stays protected behind authenticated routes and RLS
            policies.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              "Sessions are refreshed by the Supabase SSR middleware.",
              "The dashboard verifies the user on the server before rendering.",
              "Registration creates the Supabase Auth user; the database trigger creates the profile.",
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
          <h2 className="font-heading text-3xl font-semibold text-slate-950">
            Welcome back
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Enter the email and password for your Minavolve account.
          </p>

          {params.error ? (
            <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{params.error}</p>
            </div>
          ) : null}

          {params.message ? (
            <div className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <p>{params.message}</p>
            </div>
          ) : null}

          <form action={login} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-800">
              Email
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="email"
                  type="email"
                  name="email"
                  placeholder="you@team.com"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
              </span>
            </label>

            <label className="block text-sm font-medium text-slate-800">
              Password
              <span className="relative mt-2 block">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="current-password"
                  type="password"
                  name="password"
                  placeholder="********"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full rounded-full">
              Sign in
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-950"
            >
              <ArrowLeft className="size-4" />
              Back to landing page
            </Link>
            <Link
              href="/register"
              className="font-medium text-brand transition-colors hover:text-slate-950"
            >
              Create an account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
