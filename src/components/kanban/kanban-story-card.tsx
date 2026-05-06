import Link from "next/link";
import { ArrowUpRight, CheckSquare, Flag, Gauge } from "lucide-react";

import {
  getKanbanStatusLabel,
  type KanbanStory,
} from "@/lib/kanban";
import { cn } from "@/lib/utils";

const priorityClasses: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-rose-100 text-rose-800",
};

type KanbanStoryCardProps = {
  story: KanbanStory;
};

export function KanbanStoryCard({ story }: KanbanStoryCardProps) {
  const acceptanceCriteriaCount = story.acceptance_criteria?.length ?? 0;

  return (
    <article className="rounded-[1.25rem] border border-white bg-white p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
              priorityClasses[story.priority] ?? "bg-slate-100 text-slate-700",
            )}
          >
            {story.priority}
          </span>
          <h3 className="mt-3 line-clamp-3 font-medium leading-6 text-slate-950">
            {story.title}
          </h3>
        </div>
        <Link
          href={`/projects/${story.project_id}/stories/${story.id}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-brand-soft hover:text-brand"
          aria-label={`View story: ${story.title}`}
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5">
          <Gauge className="size-3.5" />
          {story.story_points ?? 0} pts
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1.5 text-brand">
          <CheckSquare className="size-3.5" />
          {acceptanceCriteriaCount} criteria
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1.5">
          <Flag className="size-3.5" />
          {story.sprint_name ?? "No sprint"}
        </span>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {getKanbanStatusLabel(story.status)}
      </div>
    </article>
  );
}
