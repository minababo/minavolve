import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CircleDot,
  ClipboardList,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

export type DashboardSummaryCard = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: "blue" | "green" | "amber" | "rose";
  Icon: LucideIcon;
};

export type RecentProject = {
  name: string;
  code: string;
  status: string;
  health: string;
  focus: string;
};

export type SprintPlanningItem = {
  label: string;
  detail: string;
  progress: string;
};

export type KanbanCard = {
  title: string;
  meta: string;
  tag: string;
};

export type KanbanColumn = {
  title: string;
  count: string;
  accentClass: string;
  cards: KanbanCard[];
};

export type RiskItem = {
  label: string;
  severity: string;
  owner: string;
};

export type AnalyticsHighlight = {
  label: string;
  value: string;
  detail: string;
};

export type AssistantPrompt = {
  label: string;
  detail: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    Icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    Icon: FolderKanban,
  },
  {
    label: "Sprint planning",
    href: "/dashboard#sprint-planning",
    Icon: ClipboardList,
  },
  {
    label: "Kanban preview",
    href: "/dashboard#kanban-preview",
    Icon: ListChecks,
  },
  {
    label: "Risk register",
    href: "/dashboard#risk-register",
    Icon: ShieldAlert,
  },
  {
    label: "Analytics",
    href: "/dashboard#delivery-analytics",
    Icon: BarChart3,
  },
  {
    label: "AI assistant",
    href: "/dashboard#ai-assistant",
    Icon: Bot,
  },
];

export const dashboardSummaryCards: DashboardSummaryCard[] = [
  {
    label: "Projects",
    value: "0",
    detail: "Supabase projects where the current user is a member.",
    trend: "Create a project to seed the workspace",
    tone: "blue",
    Icon: FolderKanban,
  },
  {
    label: "Active sprints",
    value: "0",
    detail: "Supabase sprints currently marked active.",
    trend: "Create an active sprint to start delivery",
    tone: "green",
    Icon: TimerReset,
  },
  {
    label: "User stories",
    value: "0",
    detail: "Supabase user stories visible to the current user.",
    trend: "Create stories from a project workspace",
    tone: "amber",
    Icon: MessageSquareText,
  },
  {
    label: "Open risks",
    value: "5",
    detail: "Mock delivery risks waiting for real project data.",
    trend: "2 need owner review",
    tone: "rose",
    Icon: ShieldAlert,
  },
];

export function getDashboardSummaryCards(
  projectCount: number,
  activeSprintCount = 0,
  userStoryCount = 0,
) {
  return dashboardSummaryCards.map((card) => {
    if (card.label === "Projects") {
      return {
        ...card,
        value: String(projectCount),
        trend:
          projectCount === 1
            ? "1 project available through RLS"
            : `${projectCount} projects available through RLS`,
      };
    }

    if (card.label === "Active sprints") {
      return {
        ...card,
        value: String(activeSprintCount),
        trend:
          activeSprintCount === 1
            ? "1 active sprint available through RLS"
            : `${activeSprintCount} active sprints available through RLS`,
      };
    }

    if (card.label === "User stories") {
      return {
        ...card,
        value: String(userStoryCount),
        trend:
          userStoryCount === 1
            ? "1 story available through RLS"
            : `${userStoryCount} stories available through RLS`,
      };
    }

    return card;
  });
}

export const recentProjects: RecentProject[] = [
  {
    name: "Atlas onboarding",
    code: "ATL",
    status: "Discovery",
    health: "On track",
    focus: "Clarify first-run activation and team invite flow.",
  },
  {
    name: "Northstar sprint rituals",
    code: "NST",
    status: "In sprint",
    health: "Watch",
    focus: "Keep ceremony notes and blockers visible in one view.",
  },
  {
    name: "Orbit analytics",
    code: "ORB",
    status: "Planning",
    health: "Healthy",
    focus: "Define dashboard events before instrumentation begins.",
  },
];

export const sprintPlanningItems: SprintPlanningItem[] = [
  {
    label: "Scope refinement",
    detail: "Convert top backlog themes into testable stories.",
    progress: "70%",
  },
  {
    label: "Capacity check",
    detail: "Balance committed work against team availability.",
    progress: "45%",
  },
  {
    label: "Review readiness",
    detail: "Collect acceptance notes for demo candidates.",
    progress: "30%",
  },
];

export const kanbanColumns: KanbanColumn[] = [
  {
    title: "Backlog",
    count: "8",
    accentClass: "bg-slate-200 text-slate-700",
    cards: [
      {
        title: "Define project empty state",
        meta: "UX copy - product",
        tag: "Ready",
      },
      {
        title: "Map profile defaults",
        meta: "Auth handoff - backend",
        tag: "Needs review",
      },
    ],
  },
  {
    title: "To Do",
    count: "5",
    accentClass: "bg-blue-100 text-blue-800",
    cards: [
      {
        title: "Create sprint planning route",
        meta: "App shell - frontend",
        tag: "Next",
      },
      {
        title: "Draft risk severity labels",
        meta: "Domain model - product",
        tag: "Queued",
      },
    ],
  },
  {
    title: "In Progress",
    count: "3",
    accentClass: "bg-cyan-100 text-cyan-900",
    cards: [
      {
        title: "Dashboard layout foundation",
        meta: "Issue #8 - frontend",
        tag: "Active",
      },
      {
        title: "Auth smoke test notes",
        meta: "Supabase - QA",
        tag: "Blocked",
      },
    ],
  },
  {
    title: "Review",
    count: "2",
    accentClass: "bg-amber-100 text-amber-900",
    cards: [
      {
        title: "README auth setup",
        meta: "Docs - reviewer",
        tag: "PR",
      },
      {
        title: "Dashboard copy pass",
        meta: "Design - product",
        tag: "QA",
      },
    ],
  },
  {
    title: "Done",
    count: "6",
    accentClass: "bg-emerald-100 text-emerald-900",
    cards: [
      {
        title: "Supabase SSR clients",
        meta: "Auth - platform",
        tag: "Shipped",
      },
      {
        title: "Protected dashboard route",
        meta: "Security - app",
        tag: "Shipped",
      },
    ],
  },
];

export const riskRegisterItems: RiskItem[] = [
  {
    label: "Email confirmation setting may differ across environments.",
    severity: "Medium",
    owner: "Auth",
  },
  {
    label: "Kanban ordering depends on RLS-backed story movement.",
    severity: "High",
    owner: "Board",
  },
  {
    label: "AI assistant requires provider limits and audit logging.",
    severity: "Medium",
    owner: "AI",
  },
];

export const analyticsHighlights: AnalyticsHighlight[] = [
  {
    label: "Cycle time",
    value: "3.8d",
    detail: "Static benchmark until activity events are connected.",
  },
  {
    label: "Sprint confidence",
    value: "82%",
    detail: "Placeholder signal for future delivery forecasting.",
  },
  {
    label: "Review load",
    value: "7",
    detail: "Mock stories awaiting acceptance feedback.",
  },
];

export const assistantPrompts: AssistantPrompt[] = [
  {
    label: "Generate user story",
    detail: "Project workspaces can draft structured stories from feature ideas.",
  },
  {
    label: "Copy into backlog",
    detail: "Generated titles, descriptions, points, and criteria are copy-ready.",
  },
  {
    label: "Audit generation history",
    detail: "Successful AI story drafts are logged to Supabase per project.",
  },
];

export const dashboardFocusItems = [
  {
    label: "Authenticated shell",
    detail: "Server-side Supabase user check remains the route gate.",
    Icon: CircleDot,
  },
  {
    label: "Project CRUD foundation",
    detail: "Projects, sprints, stories, and drag-and-drop Kanban boards use Supabase RLS.",
    Icon: Gauge,
  },
  {
    label: "AI-ready surface",
    detail: "Project workspaces can generate AI user story drafts through a protected server route.",
    Icon: Sparkles,
  },
];
