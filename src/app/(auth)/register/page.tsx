import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { redirect } from "next/navigation";

import { register } from "@/app/(auth)/register/actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Minavolve account with Supabase Auth.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(8,145,178,0.16),_transparent_32%)]" />

      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.6)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" />
            Start with email and password
          </div>
          <h1 className="mt-5 font-heading text-4xl font-semibold text-slate-950">
            Create your Minavolve account.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Registration uses Supabase Auth. If email confirmation is enabled,
            you will need to confirm your inbox before signing in.
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

          <form action={register} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-800">
              Full name
              <span className="relative mt-2 block">
                <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="name"
                  type="text"
                  name="fullName"
                  placeholder="Alex Johnson"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
              </span>
            </label>

            <label className="block text-sm font-medium text-slate-800">
              Email
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  autoComplete="email"
                  type="email"
                  name="email"
                  placeholder="alex@minavolve.app"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                />
              </span>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-800">
                Password
                <span className="relative mt-2 block">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    minLength={8}
                    placeholder="8+ characters"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                  />
                </span>
              </label>

              <label className="block text-sm font-medium text-slate-800">
                Confirm password
                <span className="relative mt-2 block">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    autoComplete="new-password"
                    type="password"
                    name="confirmPassword"
                    minLength={8}
                    placeholder="Repeat password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm text-slate-900 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
                  />
                </span>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-full">
              Create account
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
              href="/login"
              className="font-medium text-brand transition-colors hover:text-slate-950"
            >
              Already have an account?
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <UserPlus className="size-6" />
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            {siteConfig.name}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold">
            Your profile is created by the database trigger.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Supabase Auth creates the account, then the Issue #2 trigger creates
            the matching `public.profiles` row automatically.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              "No project setup happens during registration yet.",
              "Email confirmation depends on the Supabase Auth project settings.",
              "After sign-in, the dashboard reads the verified user server-side.",
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
