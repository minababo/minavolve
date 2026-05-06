import Link from "next/link";
import { ArrowUpRight, CheckSquare, Flag, Gauge } from "lucide-react";

import { cn } from "@/lib/utils";

export type StoryCardStory = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  acceptance_criteria: string[] | null;
  story_points: number;
  priority: string;
  status: string;
  created_at: string;
  sprint_name?: string | null;
};

const statusClasses: Record<string, string> = {
  backlog: "bg-slate-100 text-slate-700",
  todo: "bg-blue-100 text-blue-800",
  in_progress: "bg-cyan-100 text-cyan-900",
  review: "bg-amber-100 text-amber-900",
  done: "bg-emerald-100 text-emerald-800",
};

const priorityClasses: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-rose-100 text-rose-800",
};

export function StoryCard({ story }: { story: StoryCardStory }) {
  const criteriaCount = story.acceptance_criteria?.length ?? 0;

  return (
    <Link
      href={`/projects/${story.project_id}/stories/${story.id}`}
      className="group block rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                statusClasses[story.status] ?? "bg-slate-100 text-slate-700",
              )}
            >
              {story.status.replaceAll("_", " ")}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                priorityClasses[story.priority] ??
                  "bg-slate-100 text-slate-700",
              )}
            >
              {story.priority}
            </span>
          </div>
          <h3 className="mt-4 line-clamp-2 font-heading text-xl font-semibold text-slate-950">
            {story.title}
          </h3>
        </div>

        <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-brand" />
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {story.description ??
          "No description yet. Add details or acceptance criteria as the workflow matures."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
          <Gauge className="size-3.5" />
          {story.story_points} pts
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-brand">
          <CheckSquare className="size-3.5" />
          {criteriaCount} criteria
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
          <Flag className="size-3.5" />
          {story.sprint_name ?? "No sprint"}
        </span>
      </div>
    </Link>
  );
}
