"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";

import { logout } from "@/app/(app)/dashboard/actions";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type AppNavProps = {
  userEmail: string;
};

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
];

export function AppNav({ userEmail }: AppNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-slate-50 shadow-lg">
            <Sparkles className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-lg font-semibold text-slate-950">
              {siteConfig.name}
            </span>
            <span className="hidden text-sm text-slate-600 sm:block">
              {siteConfig.shortDescription}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden max-w-[200px] truncate text-sm text-slate-500 lg:block">
            {userEmail}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
