# Minavolve — Agile Sprint Board with AI Assistant

> A full-stack Agile project management tool with AI-powered story generation, drag-and-drop Kanban, sprint analytics, and a project risk register.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-minavolve.vercel.app-brightgreen?style=flat&logo=vercel)](https://minavolve.vercel.app) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org) [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com) [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)

---

## Live Demo

[https://minavolve.vercel.app](https://minavolve.vercel.app)

> Use the Register page to create a free account. No payment or invite required.

---

## Screenshots

> Screenshots will be added after Vercel deployment is confirmed.

---

## Features

**Authentication & Security**

- Email/password registration and login via Supabase Auth
- Server-side session handling with @supabase/ssr
- Row Level Security (RLS) on all database tables
- Protected routes via Next.js middleware

**Project & Sprint Management**

- Create and edit projects with status tracking
- Sprint creation with start/end dates, goals, and status lifecycle (Planned → Active → Completed)
- Sprint progress bars showing done/total story counts
- Sprint velocity chart and burndown chart (Recharts)

**User Stories & Kanban**

- Create and edit user stories with story points, priority, and sprint assignment
- Drag-and-drop Kanban board across five workflow columns (Backlog / To Do / In Progress / Review / Done)
- Filter Kanban board by priority and sprint
- Story status persists to Supabase after every drop

**AI Assistant (Groq)**

- AI user story generator: converts a feature idea into a structured Agile user story with acceptance criteria
- AI acceptance criteria generator: produces 3–8 testable criteria from a story title
- All generations logged to Supabase per project

**Risk Register**

- Log delivery risks with probability, impact, mitigation notes, and status
- Risk score (probability × impact) with colour-coded severity badges
- Status lifecycle: Open → Mitigating → Resolved → Accepted

**Dashboard**

- Live summary tiles: project count, active sprints, stories, open risks — all from Supabase via RLS
- Recent projects list with workspace links
- Animated count-up on dashboard stat numbers

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16 (App Router) + TypeScript |
| Styling       | Tailwind CSS + shadcn/ui             |
| Database      | Supabase PostgreSQL                  |
| Auth          | Supabase Auth + @supabase/ssr        |
| AI            | Groq API (llama-3.3-70b-versatile)   |
| Charts        | Recharts                             |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable    |
| Validation    | Zod                                  |
| Deployment    | Vercel                               |

---

## Local Setup

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Steps

```bash
git clone https://github.com/minababo/minavolve.git
cd minavolve
npm install
cp .env.example .env.local
# Fill in your values in .env.local
npm run dev
```

### Environment Variables

| Variable                        | Description                                                |
| ------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`           | Your app URL (`http://localhost:3000` locally)             |
| `NEXT_PUBLIC_SUPABASE_URL`      | From Supabase project settings                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings                             |
| `GROQ_API_KEY`                  | From console.groq.com — server-only, never expose publicly |
| `GROQ_MODEL`                    | AI model name (default: `llama-3.3-70b-versatile`)         |

### Database Setup

Apply all migration files in order from `supabase/migrations/` using the Supabase SQL Editor. Files are numbered and must be applied in sequence.

---

## Deployment (Vercel)

1. Connect your GitHub repo to Vercel
2. Add all five environment variables in **Vercel → Settings → Environment Variables**
3. Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
4. In **Supabase → Authentication → URL Configuration**, add your Vercel URL to Redirect URLs:
   ```
   https://minavolve.vercel.app/**
   ```
5. Deploy — Vercel will detect Next.js automatically

---

## Project Structure

```
src/app/(app)/         — authenticated app routes
src/app/(auth)/        — login and register pages
src/app/api/ai/        — server-side AI API routes
src/components/        — reusable UI components
src/lib/               — validators, helpers, chart data
supabase/migrations/   — ordered SQL migration files
```

---

## Known Limitations

- Sprint and risk deletion (create and status-update only)
- Real-time collaborative updates (single-user per session)
- Email notifications
- Team member invite flow (owner-only model for now)

---

## About

Built by Minada Amarasinghe to demonstrate full-stack Next.js development, Agile tooling, AI API integration, and cloud deployment.

GitHub: [https://github.com/minababo](https://github.com/minababo)
