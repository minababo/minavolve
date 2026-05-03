import Link from "next/link";
import { ArrowUpRight, CalendarDays, Target } from "lucide-react";

import { cn } from "@/lib/utils";

export type SprintCardSprint = {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

const statusClasses: Record<string, string> = {
  planned: "bg-slate-100 text-slate-700",
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-rose-100 text-rose-700",
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function SprintCard({ sprint }: { sprint: SprintCardSprint }) {
  return (
    <Link
      href={`/projects/${sprint.project_id}/sprints/${sprint.id}`}
      className="group block rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
              statusClasses[sprint.status] ?? "bg-slate-100 text-slate-700",
            )}
          >
            {sprint.status}
          </span>
          <h3 className="mt-4 font-heading text-xl font-semibold text-slate-950">
            {sprint.name}
          </h3>
        </div>

        <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-brand" />
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {sprint.goal ??
          "No sprint goal yet. User stories and planning details will be added in later issues."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
          <CalendarDays className="size-3.5" />
          {formatDate(sprint.start_date)} - {formatDate(sprint.end_date)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-brand">
          <Target className="size-3.5" />
          Sprint workspace
        </span>
      </div>
    </Link>
  );
}
