import Link from "next/link";
import { ArrowUpRight, Boxes, ChevronRight } from "lucide-react";

import { dashboardFocusItems, dashboardNavItems } from "@/lib/dashboard";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
      <div className="flex h-full flex-col rounded-[2rem] border border-white/80 bg-slate-950 p-4 text-slate-50 shadow-[0_32px_90px_-55px_rgba(15,23,42,0.95)] sm:p-5">
        <Link href="/" className="flex items-center gap-3 rounded-3xl p-2">
          <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
            <Boxes className="size-5" />
          </div>
          <div>
            <p className="font-heading text-xl font-semibold">
              {siteConfig.name}
            </p>
            <p className="text-xs text-slate-400">Sprint operations</p>
          </div>
        </Link>

        <nav className="mt-7 space-y-1" aria-label="Dashboard navigation">
          {dashboardNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                item.active
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="flex items-center gap-3">
                <item.Icon className="size-4" />
                {item.label}
              </span>
              {item.active ? (
                <ChevronRight className="size-4 text-brand" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Issue #8 scope
          </p>
          <div className="mt-4 space-y-4">
            {dashboardFocusItems.map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                  <item.Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-white/20 hover:text-white lg:mt-auto"
        >
          Public landing page
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </aside>
  );
}
