import type { LucideIcon } from "lucide-react";
import { Bot, Gauge, LayoutDashboard } from "lucide-react";

export type MarketingNavItem = {
  href: string;
  label: string;
};

export type MarketingFeature = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  Icon: LucideIcon;
};

export type MarketingStat = {
  value: string;
  label: string;
  detail: string;
};

export type BoardCard = {
  title: string;
  meta: string;
};

export type PreviewColumn = {
  title: string;
  status: string;
  badgeClass: string;
  cards: BoardCard[];
};

export type RoadmapItem = {
  label: string;
  detail: string;
};

export const siteConfig = {
  name: "Minavolve",
  tagline: "Agile Sprint Board with AI Assistant",
  shortDescription: "Agile sprint board with an AI sidekick for delivery teams.",
  description:
    "Minavolve gives product teams a focused sprint board for planning, standups, and follow-through, with a future AI assistant designed to turn backlog noise into actionable momentum.",
} as const;

export const marketingNav: MarketingNavItem[] = [
  { href: "/#features", label: "Features" },
  { href: "/#preview", label: "Preview" },
  { href: "/#roadmap", label: "Roadmap" },
];

export const marketingStats: MarketingStat[] = [
  {
    value: "4",
    label: "Foundation routes",
    detail:
      "Landing, login, register, and dashboard placeholders are scaffolded and load cleanly.",
  },
  {
    value: "3",
    label: "Product themes",
    detail:
      "Planning, execution visibility, and AI-guided rituals shape the initial narrative.",
  },
  {
    value: "1",
    label: "Shared source of truth",
    detail:
      "Copy, navigation, board preview data, and roadmap details live in one typed config.",
  },
];

export const marketingFeatures: MarketingFeature[] = [
  {
    eyebrow: "Plan faster",
    title: "Keep the sprint board readable from kickoff to review",
    description:
      "Minavolve is structured around a clean board surface so priorities, status, and delivery context remain visible at a glance.",
    points: [
      "Separate backlog shaping from committed sprint work.",
      "Make blockers and in-flight tasks readable without opening extra tools.",
    ],
    Icon: LayoutDashboard,
  },
  {
    eyebrow: "Stay aligned",
    title: "Reserve space for an AI teammate that supports rituals",
    description:
      "The assistant is designed to sit beside the sprint board, helping summarize standups, surface risks, and draft follow-up notes.",
    points: [
      "Keep standup and review support in the same workspace as delivery updates.",
      "Frame AI as a teammate for summarization and nudges, not a replacement for judgment.",
    ],
    Icon: Bot,
  },
  {
    eyebrow: "Ship cleaner",
    title: "Build on a foundation that can absorb real workflow later",
    description:
      "This issue intentionally focuses on presentation, route structure, and shared content so later issues can add integrations without a visual reset.",
    points: [
      "Supabase, auth, drag-and-drop, and API calls can layer onto an existing app shell.",
      "Reusable marketing and dashboard sections reduce rewrites as functionality grows.",
    ],
    Icon: Gauge,
  },
];

export const sprintBoardPreview: PreviewColumn[] = [
  {
    title: "Backlog",
    status: "6 queued",
    badgeClass: "bg-slate-200 text-slate-700",
    cards: [
      {
        title: "Refine onboarding epic",
        meta: "Product - capture open questions before commitment",
      },
      {
        title: "Break down analytics setup",
        meta: "Engineering - map follow-up tasks for tracking",
      },
    ],
  },
  {
    title: "In Progress",
    status: "3 active",
    badgeClass: "bg-cyan-100 text-cyan-900",
    cards: [
      {
        title: "Ship route foundation",
        meta: "Frontend - marketing, auth, and dashboard shells",
      },
      {
        title: "Draft auth UX copy",
        meta: "Product - set expectations before real login flows",
      },
    ],
  },
  {
    title: "Review",
    status: "2 ready",
    badgeClass: "bg-amber-100 text-amber-900",
    cards: [
      {
        title: "Approve sprint preview layout",
        meta: "Design - validate board clarity and CTA hierarchy",
      },
      {
        title: "Check README framing",
        meta: "Team - confirm recruiter-friendly project summary",
      },
    ],
  },
  {
    title: "Done",
    status: "5 closed",
    badgeClass: "bg-emerald-100 text-emerald-900",
    cards: [
      {
        title: "Create App Router scaffold",
        meta: "Platform - establish route groups and shared styling",
      },
      {
        title: "Define site-level content",
        meta: "Content - keep copy and preview data centralized",
      },
    ],
  },
];

export const roadmapItems: RoadmapItem[] = [
  {
    label: "Supabase Auth",
    detail:
      "Login, registration, and session management via Supabase, with server-side auth guards and RLS-enforced data access across every route.",
  },
  {
    label: "Project & sprint CRUD",
    detail:
      "Full create, read, and delete for projects, sprints, and user stories persisted in Supabase with row-level security.",
  },
  {
    label: "Drag-and-drop Kanban",
    detail:
      "Per-project Kanban boards with real drag-and-drop story movement, column state, and position persistence through Supabase.",
  },
  {
    label: "AI story generation",
    detail:
      "Groq-powered user story drafting and acceptance criteria generation from a protected server route, with per-project audit logging.",
  },
];
