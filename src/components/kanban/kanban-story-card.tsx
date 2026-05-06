"use client";

import type { CSSProperties } from "react";
import type {
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CheckSquare,
  Flag,
  Gauge,
  Loader2,
} from "lucide-react";

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
  disabled?: boolean;
  isPending?: boolean;
};

type KanbanStoryCardContentProps = {
  story: KanbanStory;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: CSSProperties;
  listeners?: DraggableSyntheticListeners;
  disabled?: boolean;
  isDragging?: boolean;
  isPending?: boolean;
};

function KanbanStoryCardContent({
  story,
  setNodeRef,
  style,
  listeners,
  disabled = false,
  isDragging = false,
  isPending = false,
}: KanbanStoryCardContentProps) {
  const router = useRouter();
  const acceptanceCriteriaCount = story.acceptance_criteria?.length ?? 0;
  const href = `/projects/${story.project_id}/stories/${story.id}`;
  const cardClasses = cn(
    "block rounded-[1.25rem] border border-white bg-white p-4 text-left shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)] outline-none transition-[border-color,box-shadow,background-color,opacity] duration-100 focus-visible:ring-2 focus-visible:ring-brand/40",
    disabled || isPending
      ? "cursor-not-allowed"
      : "cursor-grab hover:border-brand/20 hover:shadow-[0_24px_58px_-36px_rgba(15,23,42,0.82)] active:cursor-grabbing",
    isDragging && "opacity-70 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.9)]",
    isPending && "ring-2 ring-blue-200",
  );
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isPending ? (
              <span className="inline-flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Loader2 className="size-4 animate-spin" />
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                priorityClasses[story.priority] ?? "bg-slate-100 text-slate-700",
              )}
            >
              {story.priority}
            </span>
          </div>
          <h3 className="mt-3 line-clamp-3 font-medium leading-6 text-slate-950">
            {story.title}
          </h3>
        </div>
        <span
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-soft group-hover:text-brand"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" />
        </span>
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
    </>
  );

  const { onKeyDown: listenerKeyDown, ...dragListeners } = listeners ?? {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="link"
      tabIndex={0}
      aria-label={`Open story: ${story.title}`}
      aria-describedby={`kanban-board-${story.project_id}`}
      aria-disabled={disabled || isPending}
      aria-roledescription="sortable story card"
      className={cn("group", cardClasses)}
      draggable={false}
      {...dragListeners}
      onClick={(event) => {
        if (disabled || isPending || isDragging) {
          event.preventDefault();
          return;
        }

        router.push(href);
      }}
      onDragStart={(event) => {
        event.preventDefault();
      }}
      onKeyDown={(event) => {
        listenerKeyDown?.(event);

        if (
          event.defaultPrevented ||
          disabled ||
          isPending ||
          event.key !== "Enter"
        ) {
          return;
        }

        event.preventDefault();
        router.push(href);
      }}
    >
      {content}
    </div>
  );
}

export function KanbanStoryCard({
  story,
  disabled = false,
  isPending = false,
}: KanbanStoryCardProps) {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: story.id,
    transition: {
      duration: 90,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
    data: {
      type: "story",
      story,
    },
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    willChange: isDragging ? "transform" : undefined,
  };

  return (
    <KanbanStoryCardContent
      story={story}
      setNodeRef={setNodeRef}
      style={style}
      listeners={listeners}
      disabled={disabled}
      isDragging={isDragging}
      isPending={isPending}
    />
  );
}
