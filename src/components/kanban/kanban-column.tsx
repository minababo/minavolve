"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  getKanbanColumnId,
  type KanbanColumnModel,
} from "@/lib/kanban";
import { cn } from "@/lib/utils";

import { KanbanStoryCard } from "./kanban-story-card";

type KanbanColumnProps = {
  column: KanbanColumnModel;
  disabled?: boolean;
  isDropTarget?: boolean;
  pendingStoryId?: string | null;
  isFilteredEmpty?: boolean;
};

export function KanbanColumn({
  column,
  disabled = false,
  isDropTarget = false,
  pendingStoryId = null,
  isFilteredEmpty = false,
}: KanbanColumnProps) {
  const columnId = getKanbanColumnId(column.status);
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
    data: {
      type: "column",
      status: column.status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-3 transition-all duration-150",
        (isOver || isDropTarget) &&
          "border-brand/50 bg-brand-soft/70 shadow-[0_18px_50px_-38px_rgba(14,165,233,0.9)] ring-2 ring-brand/15",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <div className="inline-flex size-8 items-center justify-center rounded-xl bg-white text-slate-600">
              <column.Icon className="size-4" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-slate-950">
              {column.label}
            </h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {column.description}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            column.accentClass,
          )}
        >
          {column.stories.length}
        </span>
      </div>

      <SortableContext
        items={column.stories.map((story) => story.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-4 min-h-32 space-y-3">
          {column.stories.length > 0 ? (
            column.stories.map((story) => (
              <KanbanStoryCard
                key={story.id}
                story={story}
                disabled={disabled}
                isPending={pendingStoryId === story.id}
              />
            ))
          ) : isFilteredEmpty ? (
            <p className="px-2 py-8 text-center text-sm leading-6 text-slate-400">
              No stories match the current filters.
            </p>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-white/72 px-4 py-8 text-center text-sm leading-6 text-slate-500">
              {column.emptyState}
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
