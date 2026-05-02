import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

export type ProjectCardProject = {
  id: string;
  name: string;
  project_key: string;
  description: string | null;
  status: string;
  start_date: string | null;
  target_end_date: string | null;
  created_at: string;
};

const statusClasses: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  paused: "bg-amber-100 text-amber-900",
  completed: "bg-blue-100 text-blue-800",
  archived: "bg-slate-200 text-slate-700",
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

export function ProjectCard({ project }: { project: ProjectCardProject }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-heading text-sm font-semibold tracking-[0.14em] text-white">
            {project.project_key}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-xl font-semibold text-slate-950">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Created {formatDate(project.created_at.slice(0, 10))}
            </p>
          </div>
        </div>

        <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-brand" />
      </div>

      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {project.description ??
          "No description yet. Add sprint goals and project context in later issues."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
            statusClasses[project.status] ?? "bg-slate-100 text-slate-700",
          )}
        >
          {project.status}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          <CalendarDays className="size-3.5" />
          {formatDate(project.start_date)} - {formatDate(project.target_end_date)}
        </span>
      </div>
    </Link>
  );
}
