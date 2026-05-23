import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  MessageSquareText,
  ShieldAlert,
  TimerReset,
} from "lucide-react";

export type DashboardSummaryCard = {
  label: string;
  value: string;
  numericValue: number;
  detail: string;
  trend: string;
  tone: "blue" | "green" | "amber" | "rose";
  Icon: LucideIcon;
};

export type AssistantPrompt = {
  label: string;
  detail: string;
};

export const dashboardSummaryCards: DashboardSummaryCard[] = [
  {
    label: "Projects",
    value: "0",
    numericValue: 0,
    detail: "Supabase projects where the current user is a member.",
    trend: "Create a project to seed the workspace",
    tone: "blue",
    Icon: FolderKanban,
  },
  {
    label: "Active sprints",
    value: "0",
    numericValue: 0,
    detail: "Supabase sprints currently marked active.",
    trend: "Create an active sprint to start delivery",
    tone: "green",
    Icon: TimerReset,
  },
  {
    label: "User stories",
    value: "0",
    numericValue: 0,
    detail: "Supabase user stories visible to the current user.",
    trend: "Create stories from a project workspace",
    tone: "amber",
    Icon: MessageSquareText,
  },
  {
    label: "Open risks",
    value: "0",
    numericValue: 0,
    detail: "Open delivery risks across all your projects through RLS.",
    trend: "No open risks right now",
    tone: "rose",
    Icon: ShieldAlert,
  },
];

export function getDashboardSummaryCards(
  projectCount: number,
  activeSprintCount = 0,
  userStoryCount = 0,
  openRiskCount = 0,
) {
  return dashboardSummaryCards.map((card) => {
    if (card.label === "Projects") {
      return {
        ...card,
        value: String(projectCount),
        numericValue: projectCount,
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
        numericValue: activeSprintCount,
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
        numericValue: userStoryCount,
        trend:
          userStoryCount === 1
            ? "1 story available through RLS"
            : `${userStoryCount} stories available through RLS`,
      };
    }

    if (card.label === "Open risks") {
      return {
        ...card,
        value: String(openRiskCount),
        numericValue: openRiskCount,
        trend:
          openRiskCount === 0
            ? "No open risks right now"
            : openRiskCount === 1
              ? "1 open risk to review"
              : `${openRiskCount} open risks to review`,
      };
    }

    return card;
  });
}

export const assistantPrompts: AssistantPrompt[] = [
  {
    label: "Generate user story",
    detail: "Project workspaces can draft structured stories from feature ideas.",
  },
  {
    label: "Generate acceptance criteria",
    detail: "Project workspaces can generate 3 to 8 testable criteria from a story title.",
  },
  {
    label: "Copy into backlog",
    detail: "Generated titles, descriptions, points, and criteria are copy-ready.",
  },
  {
    label: "Audit generation history",
    detail: "Successful AI generations are logged to Supabase per project.",
  },
];
