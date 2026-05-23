import type { LucideIcon } from "lucide-react";

import { StatNumber } from "@/components/app/stat-number";
import { cn } from "@/lib/utils";

export type DashboardCardTone = "blue" | "green" | "amber" | "rose";

const toneClasses: Record<
  DashboardCardTone,
  {
    card: string;
    icon: string;
    trend: string;
  }
> = {
  blue: {
    card: "from-blue-50 to-white",
    icon: "bg-blue-100 text-blue-700",
    trend: "text-blue-700",
  },
  green: {
    card: "from-emerald-50 to-white",
    icon: "bg-emerald-100 text-emerald-700",
    trend: "text-emerald-700",
  },
  amber: {
    card: "from-amber-50 to-white",
    icon: "bg-amber-100 text-amber-800",
    trend: "text-amber-800",
  },
  rose: {
    card: "from-rose-50 to-white",
    icon: "bg-rose-100 text-rose-700",
    trend: "text-rose-700",
  },
};

type DashboardCardProps = {
  label: string;
  value: string;
  numericValue?: number;
  detail: string;
  trend: string;
  tone: DashboardCardTone;
  Icon: LucideIcon;
};

export function DashboardCard({
  label,
  value,
  numericValue,
  detail,
  trend,
  tone,
  Icon,
}: DashboardCardProps) {
  const classes = toneClasses[tone];

  return (
    <article
      className={cn(
        "group rounded-[1.75rem] border border-white/80 bg-gradient-to-br p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)] transition-transform duration-300 hover:-translate-y-1",
        classes.card,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 font-heading text-4xl font-semibold tracking-tight text-slate-950">
            {numericValue !== undefined ? (
              <StatNumber value={numericValue} />
            ) : (
              value
            )}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-2xl",
            classes.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{detail}</p>
      <p className={cn("mt-4 text-sm font-semibold", classes.trend)}>
        {trend}
      </p>
    </article>
  );
}
