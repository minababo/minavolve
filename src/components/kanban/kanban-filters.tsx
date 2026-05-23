"use client";

import { ChevronDown, X } from "lucide-react";

import { PRIORITY_ORDER } from "@/lib/kanban";

type KanbanSprint = { id: string; name: string };

type KanbanFiltersProps = {
  sprints: KanbanSprint[];
  activePriorityFilter: string;
  activeSprintFilter: string;
  onPriorityChange: (value: string) => void;
  onSprintChange: (value: string) => void;
  totalVisible: number;
  totalCards: number;
};

const priorityLabels: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const selectClass =
  "h-8 w-full appearance-none rounded-xl border border-slate-200 bg-white py-0 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-brand/40 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer";

export function KanbanFilters({
  sprints,
  activePriorityFilter,
  activeSprintFilter,
  onPriorityChange,
  onSprintChange,
  totalVisible,
  totalCards,
}: KanbanFiltersProps) {
  const isFiltered =
    activePriorityFilter !== "all" || activeSprintFilter !== "all";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <select
          className={selectClass}
          value={activePriorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={activeSprintFilter}
          onChange={(e) => onSprintChange(e.target.value)}
          aria-label="Filter by sprint"
        >
          <option value="all">All sprints</option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={() => {
            onPriorityChange("all");
            onSprintChange("all");
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <X className="size-3.5" />
          Clear filters
        </button>
      )}

      {totalVisible < totalCards && (
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          Showing {totalVisible} of {totalCards} stories
        </span>
      )}
    </div>
  );
}
