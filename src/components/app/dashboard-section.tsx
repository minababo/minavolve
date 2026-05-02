import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  dark?: boolean;
};

export function DashboardSection({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  dark = false,
}: DashboardSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-[2rem] border p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6",
        dark
          ? "border-slate-800 bg-slate-950 text-slate-50"
          : "border-white/80 bg-white/82 text-slate-950",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.24em]",
                dark ? "text-cyan-200" : "text-brand",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "mt-2 max-w-2xl text-sm leading-6",
                dark ? "text-slate-300" : "text-slate-600",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className={cn("mt-6", contentClassName)}>{children}</div>
    </section>
  );
}
