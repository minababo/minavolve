import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CheckCircle2,
  ClipboardList,
  Eye,
  ListTodo,
} from "lucide-react";

export const PRIORITY_ORDER = [
  "urgent",
  "high",
  "medium",
  "low",
] as const;

export const kanbanStatuses = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
] as const;

export type KanbanStatus = (typeof kanbanStatuses)[number];

export type KanbanStory = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  title: string;
  acceptance_criteria: string[] | null;
  story_points: number | null;
  priority: string;
  status: KanbanStatus;
  sort_order: number | null;
  created_at: string;
  sprint_name: string | null;
};

export type KanbanColumnConfig = {
  status: KanbanStatus;
  label: string;
  description: string;
  emptyState: string;
  accentClass: string;
  Icon: LucideIcon;
};

export type KanbanColumnModel = KanbanColumnConfig & {
  stories: KanbanStory[];
};

const kanbanColumnIdPrefix = "kanban-column:";

export const kanbanColumnConfig: KanbanColumnConfig[] = [
  {
    status: "backlog",
    label: "Backlog",
    description: "Ideas and candidate stories before sprint commitment.",
    emptyState: "No backlog stories yet.",
    accentClass: "bg-slate-200 text-slate-700",
    Icon: Archive,
  },
  {
    status: "todo",
    label: "To Do",
    description: "Committed work ready for pickup.",
    emptyState: "No stories waiting in To Do.",
    accentClass: "bg-blue-100 text-blue-800",
    Icon: ListTodo,
  },
  {
    status: "in_progress",
    label: "In Progress",
    description: "Stories actively being worked.",
    emptyState: "Nothing is in progress.",
    accentClass: "bg-cyan-100 text-cyan-900",
    Icon: ClipboardList,
  },
  {
    status: "review",
    label: "Review",
    description: "Stories ready for validation.",
    emptyState: "No stories are in review.",
    accentClass: "bg-amber-100 text-amber-900",
    Icon: Eye,
  },
  {
    status: "done",
    label: "Done",
    description: "Completed stories for the project.",
    emptyState: "No completed stories yet.",
    accentClass: "bg-emerald-100 text-emerald-800",
    Icon: CheckCircle2,
  },
];

export function getKanbanStatusLabel(status: string) {
  return (
    kanbanColumnConfig.find((column) => column.status === status)?.label ??
    status.replaceAll("_", " ")
  );
}

export function isKanbanStatus(status: string): status is KanbanStatus {
  return kanbanStatuses.includes(status as KanbanStatus);
}

export function getKanbanColumnId(status: KanbanStatus) {
  return `${kanbanColumnIdPrefix}${status}`;
}

export function getKanbanStatusFromColumnId(id: string) {
  const rawStatus = id.startsWith(kanbanColumnIdPrefix)
    ? id.slice(kanbanColumnIdPrefix.length)
    : "";

  return isKanbanStatus(rawStatus) ? rawStatus : null;
}

export function compareKanbanStories(a: KanbanStory, b: KanbanStory) {
  const sortA = a.sort_order ?? 0;
  const sortB = b.sort_order ?? 0;

  if (sortA !== sortB) {
    return sortA - sortB;
  }

  return a.created_at.localeCompare(b.created_at);
}

export function buildKanbanColumns(stories: KanbanStory[]): KanbanColumnModel[] {
  return kanbanColumnConfig.map((column) => ({
    ...column,
    stories: stories
      .filter((story) => story.status === column.status)
      .sort(compareKanbanStories),
  }));
}

export function getStoryStatusSummary(stories: KanbanStory[]) {
  const countByStatus = new Map<KanbanStatus, number>(
    kanbanStatuses.map((status) => [status, 0]),
  );

  stories.forEach((story) => {
    countByStatus.set(story.status, (countByStatus.get(story.status) ?? 0) + 1);
  });

  return kanbanColumnConfig.map((column) => ({
    label: column.label,
    status: column.status,
    count: countByStatus.get(column.status) ?? 0,
  }));
}
