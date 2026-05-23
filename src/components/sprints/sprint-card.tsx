import Link from "next/link";
import { ArrowUpRight, CalendarDays, Target } from "lucide-react";

import { updateSprintStatus } from "@/app/(app)/projects/[projectId]/sprints/actions";
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

type SprintCardProps = {
  sprint: SprintCardSprint;
  projectId: string;
  totalStories?: number;
  doneStories?: number;
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

type StatusAction = {
  label: string;
  newStatus: string;
  buttonClass: string;
} | null;

function getStatusAction(status: string): StatusAction {
  if (status === "planned") {
    return {
      label: "Start sprint",
      newStatus: "active",
      buttonClass:
        "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    };
  }
  if (status === "active") {
    return {
      label: "Complete sprint",
      newStatus: "completed",
      buttonClass:
        "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
    };
  }
  if (status === "completed") {
    return {
      label: "Reopen",
      newStatus: "planned",
      buttonClass:
        "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    };
  }
  return null;
}

function getProgressBarClass(pct: number): string {
  if (pct === 100) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-400";
  if (pct > 0) return "bg-brand";
  return "bg-slate-300";
}

export function SprintCard({
  sprint,
  projectId,
  totalStories = 0,
  doneStories = 0,
}: SprintCardProps) {
  const pct =
    totalStories > 0 ? Math.round((doneStories / totalStories) * 100) : 0;
  const statusAction = getStatusAction(sprint.status);

  return (
    <div className="group rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand/30">
      <Link
        href={`/projects/${sprint.project_id}/sprints/${sprint.id}`}
        className="block"
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
      </Link>

      <div className="mt-4">
        {totalStories > 0 ? (
          <>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>
                {doneStories} / {totalStories} stories done
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  getProgressBarClass(pct),
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-xs font-medium text-slate-400">No stories yet</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
          <CalendarDays className="size-3.5" />
          {formatDate(sprint.start_date)} – {formatDate(sprint.end_date)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-brand">
          <Target className="size-3.5" />
          Sprint workspace
        </span>
      </div>

      {statusAction && (
        <form action={updateSprintStatus} className="mt-4">
          <input type="hidden" name="sprintId" value={sprint.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="newStatus" value={statusAction.newStatus} />
          <input
            type="hidden"
            name="redirectTo"
            value={`/projects/${projectId}`}
          />
          <button
            type="submit"
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              statusAction.buttonClass,
            )}
          >
            {statusAction.label}
          </button>
        </form>
      )}
    </div>
  );
}
