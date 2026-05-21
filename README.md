# Minavolve

Minavolve is an Agile sprint board product concept with an AI-assisted backlog workflow. This repository currently ships a polished landing page, Supabase email/password authentication, an authenticated dashboard layout, initial Supabase-backed project/sprint/user story creation and listing, a drag-and-drop Kanban board that persists story status and order, an AI user story generator, an AI acceptance criteria generator, a sprint velocity chart, a sprint burndown chart, and a project risk register for project workspaces.

## What this issue includes

- A marketing landing page for the Minavolve concept
- App Router route structure for `/`, `/login`, `/register`, and `/dashboard`
- Shared product copy in `src/lib/site.ts`
- Reusable marketing components for the landing page
- Supabase email/password login, registration, logout, and protected dashboard access
- Unified sticky top navigation bar across all authenticated pages replacing the former sidebar and topbar layout
- Authenticated dashboard with live Supabase-backed summary cards for projects, active sprints, stories, and open risks
- Authenticated project listing, project creation, and a basic project workspace placeholder backed by Supabase RLS
- Project-scoped sprint listing, sprint creation, and a basic sprint workspace placeholder backed by Supabase RLS
- Project-scoped user story listing, story creation, optional sprint assignment, and a basic story workspace placeholder backed by Supabase RLS
- Project-scoped drag-and-drop Kanban board grouped by user story status
- Project-scoped AI user story generator backed by a protected server API route
- Project-scoped AI acceptance criteria generator backed by a protected server API route
- Project-scoped sprint velocity chart showing completed story points per sprint
- Project-scoped sprint burndown chart with ideal and actual lines, sprint selector, and summary tiles
- Project-scoped risk register with risk creation, colour-coded severity scoring, and inline status update
- Starter environment variable documentation in `.env.example`
- Initial Supabase schema migration for projects, sprints, stories, risks, AI generations, activity, memberships, and profiles

## What is intentionally not implemented yet

- No project editing or deletion
- No sprint editing or deletion
- No user story editing or deletion
- No story editing, deletion, or assignee workflows from the Kanban board
- No story auto-insert from AI output
- No risk editing, deletion, or AI workflows

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `lucide-react` icons

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   - `http://localhost:3000/`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/projects`
   - `http://localhost:3000/projects/new`
   - `http://localhost:3000/projects/[projectId]/sprints/new`
   - `http://localhost:3000/projects/[projectId]/stories/new`
   - `http://localhost:3000/projects/[projectId]/kanban`
   - `http://localhost:3000/projects/[projectId]/ai/story-generator`

## Linting

Run the project linter with:

```bash
npm run lint
```

## Route guide

- `/`: product landing page for Minavolve
- `/login`: Supabase email/password sign-in screen
- `/register`: Supabase email/password account creation screen
- `/dashboard`: protected authenticated dashboard shell with static layout data
- `/projects`: protected Supabase-backed project list
- `/projects/new`: protected project creation form
- `/projects/[projectId]`: protected project workspace with project-scoped sprint list
- `/projects/[projectId]/sprints/new`: protected sprint creation form
- `/projects/[projectId]/sprints/[sprintId]`: protected sprint workspace placeholder
- `/projects/[projectId]/stories/new`: protected user story creation form
- `/projects/[projectId]/stories/[storyId]`: protected user story workspace placeholder
- `/projects/[projectId]/kanban`: protected project-specific Kanban board grouped by story status
- `/projects/[projectId]/ai/story-generator`: protected AI user story generator
- `/projects/[projectId]/ai/acceptance-criteria`: protected AI acceptance criteria generator
- `/projects/[projectId]/analytics/velocity`: protected sprint velocity chart
- `/projects/[projectId]/analytics/burndown`: protected sprint burndown chart
- `/projects/[projectId]/risks`: protected project risk register
- `/projects/[projectId]/risks/new`: protected risk creation form

## Dashboard status

The dashboard is protected by a server-side Supabase user check and shows the authenticated user's email in the top navigation bar. Logout is wired through the dashboard server action.

Dashboard content:

- Summary cards for projects, active sprints, user stories, and open risks — all counts are read live from Supabase RLS.
- Recent projects section showing the five most recently created projects with quick links to the project workspace, Kanban board, and risk register.
- A static Kanban preview with Backlog, To Do, In Progress, Review, and Done columns. Full drag-and-drop is available in individual project workspaces.
- Quick action cards linking to the AI story generator and AI acceptance criteria generator.

## Project setup status

Issue #10 adds initial project CRUD foundation:

- `/projects` reads projects through Supabase RLS, so authenticated users only see projects where they are a member or owner.
- `/projects/new` validates project input with Zod and creates rows in `public.projects`.
- Project creation sets `owner_id` to the authenticated Supabase user id.
- The database trigger is expected to add the creator to `public.project_members` as `owner`.
- Successful project creation redirects to `/projects/[projectId]`.

Project form fields are `name`, `project_key`, `description`, `status`, `start_date`, and `target_end_date`. The current implementation assumes the Supabase cloud schema includes these Issue #10 columns.

If project creation returns a missing `project_key`, `start_date`, or `target_end_date` message, update the Supabase cloud `public.projects` table before retesting project creation.

## Sprint setup status

Issue #12 adds initial sprint CRUD foundation:

- Project workspaces read sprints from `public.sprints` where `project_id` matches the current project route.
- `/projects/[projectId]/sprints/new` validates sprint input with Zod and creates rows in `public.sprints`.
- Sprint creation sets `project_id` from the route parameter and relies on Supabase RLS to confirm the authenticated user can access that project.
- Successful sprint creation redirects to `/projects/[projectId]/sprints/[sprintId]`.
- The dashboard active sprint count is read from Supabase when available.

Sprint form fields are `name`, `goal`, `start_date`, `end_date`, and `status`. The current implementation assumes the Supabase cloud schema includes these Issue #12 columns.

If sprint creation or listing returns a missing `start_date` or `end_date` message, update the Supabase cloud `public.sprints` table before retesting sprint workflows.

## User story setup status

Issue #14 adds initial user story CRUD foundation:

- Project workspaces read stories from `public.user_stories` where `project_id` matches the current project route.
- `/projects/[projectId]/stories/new` validates story input with Zod and creates rows in `public.user_stories`.
- Story creation sets `project_id` from the route parameter and can optionally set `sprint_id` to a sprint that belongs to the current project.
- Acceptance criteria are stored as a text array by splitting the multiline textarea into trimmed non-empty lines.
- Successful story creation redirects to `/projects/[projectId]/stories/[storyId]`.
- Sprint detail pages show stories linked to that sprint when the schema supports the Issue #14 fields.
- The dashboard user story count is read from Supabase when available.

Story form fields are `title`, `description`, `acceptance_criteria`, `story_points`, `priority`, `status`, and optional `sprint_id`. The current implementation assumes the Supabase cloud schema includes these Issue #14 columns.

If story creation or listing returns a missing `acceptance_criteria` or `story_points` message, update the Supabase cloud `public.user_stories` table before retesting story workflows.

## Kanban board status

Issue #18 adds drag-and-drop movement to the project-specific Kanban board:

- `/projects/[projectId]/kanban` reads user stories from `public.user_stories` for the current project.
- Stories are grouped into Backlog, To Do, In Progress, Review, and Done columns based on `status`.
- Cards show title, priority, story points, status, sprint name when linked, and acceptance criteria count.
- Dragging a card between columns updates `public.user_stories.status`.
- The board persists target-column ordering through `public.user_stories.sort_order`.
- The move server action verifies the authenticated user, project access, story ownership by `project_id`, and valid Kanban status values before updating Supabase.
- Project workspaces link to the Kanban board, and story detail pages link back to the board.
- Empty columns show clear empty states.

The board intentionally does not implement story editing, deletion, charts, or risk workflows.

The implementation assumes `public.user_stories.status` and `public.user_stories.sort_order` already exist, as defined in the initial schema, and also uses the Issue #14 story fields such as `acceptance_criteria` and `story_points` for card metadata.

## AI user story generator status

Issue #20 adds a project-scoped AI story generator:

- `/projects/[projectId]/ai/story-generator` is protected by the existing Supabase server-side user check.
- The generator accepts a required feature idea plus optional target user/persona and business goal context.
- Input is validated with Zod before the provider call.
- Client components call Minavolve's protected `/api/ai/user-story` route; `GROQ_API_KEY` is read only on the server.
- The API route calls Groq Chat Completions with `response_format: json_object` for title, user story, description, suggested priority, suggested story points, and acceptance criteria.
- Successful generations are logged to `public.ai_generations` for the selected project when the cloud schema supports `generation_type = 'user_story'`.
- Generated output is copy-ready and links back to the manual story creation form.

The generator intentionally does not insert user stories automatically, edit existing stories, or add broader assistant workflows.

Apply migration `20260503000500_add_user_story_generation_type.sql` in the Supabase cloud SQL editor to enable generation logging.

## AI acceptance criteria generator status

Issue #22 adds a project-scoped AI acceptance criteria generator:

- `/projects/[projectId]/ai/acceptance-criteria` is protected by the existing Supabase server-side user check.
- The generator accepts a required user story title (minimum 10 characters) plus optional story description or context.
- Input is validated with Zod before the provider call.
- Client components call Minavolve's protected `/api/ai/acceptance-criteria` route; `GROQ_API_KEY` is read only on the server.
- The API route calls Groq Chat Completions with `response_format: json_object` and returns 3 to 8 testable acceptance criteria.
- Successful generations are logged to `public.ai_generations` with `generation_type = 'acceptance_criteria'`.
- Each criterion can be copied individually, or the full list can be copied in one click.
- The AC generator is linked from the project workspace header, the user stories backlog section, and individual story detail pages.

The generator intentionally does not insert criteria automatically into existing stories or add broader assistant workflows.

Apply migration `20260503000600_add_acceptance_criteria_generation_type.sql` in the Supabase cloud SQL editor to enable generation logging.

## Sprint velocity chart status

Issue #24 adds a project-scoped sprint velocity chart:

- `/projects/[projectId]/analytics/velocity` is protected by the existing Supabase server-side user check.
- The page fetches all sprints for the project and all user stories with `status = 'done'`.
- Data is aggregated server-side using `buildVelocityData` in `src/lib/charts.ts` — no client-side data fetching.
- The `VelocityChart` component is a `"use client"` Recharts `BarChart` that receives pre-aggregated data.
- Each bar represents one sprint; the Y-axis shows completed story points.
- A custom tooltip shows sprint name and point total on hover.
- A clear empty state appears when no sprint has any Done stories.
- Summary tiles show sprints tracked, total completed points, and average velocity.
- The velocity page is linked from the project workspace header as a Velocity button.
- No migration is needed — the chart reads from existing `public.sprints` and `public.user_stories` fields.

The chart intentionally does not implement burndown, cumulative flow, or risk analytics.

## Sprint burndown chart status

Issue #26 adds a project-scoped sprint burndown chart:

- `/projects/[projectId]/analytics/burndown` is protected by the existing Supabase server-side user check.
- All sprints for the project are fetched to populate a sprint selector dropdown in the header.
- The page defaults to the most recently created sprint when no `sprintId` query param is present.
- The sprint selector is a `"use client"` component that pushes a `?sprintId=` query param via `useRouter` to switch sprints without a full navigation.
- Data is aggregated server-side using `buildBurndownData` in `src/lib/charts.ts` — no client-side data fetching.
- The `BurndownChart` component is a `"use client"` Recharts `LineChart` with two series: Actual (solid blue) and Ideal (dashed grey).
- The Ideal line is a straight line from total sprint story points on day 1 to zero on the last day of the sprint.
- The Actual line uses a simplified model: linear interpolation from total points at sprint start to remaining points at the current date (or sprint end if past). Future days are omitted.
- A custom tooltip shows date, ideal points, and actual points on hover.
- A legend labels both series.
- A clear empty state appears when the selected sprint has no start or end date.
- Summary tiles show total points, remaining points, and completion percentage when the sprint has stories.
- The burndown page links back to the velocity chart and to the project workspace.
- The burndown page is linked from the project workspace header as a Burndown button and from the velocity page header.
- No migration is needed — the chart reads from existing `public.sprints` and `public.user_stories` fields.

The chart intentionally does not implement day-level completion tracking, cumulative flow, or risk analytics.

## Risk register status

Issue #28 adds a project-scoped risk register:

- `/projects/[projectId]/risks` is protected by the existing Supabase server-side user check.
- `/projects/[projectId]/risks/new` contains a risk creation form validated with Zod before inserting into `public.risks`.
- Risk form fields are `title` (required, minimum 3 characters), `description` (optional), `probability` (1–5 select), `impact` (1–5 select), `mitigation` (optional), and `status` (open, mitigated, closed — default open).
- On valid submission, `owner_id` is set to the authenticated user's id and `project_id` from the route parameter.
- Successful creation redirects to `/projects/[projectId]/risks`.
- Each risk card shows title, probability/impact ratings, risk score (probability × impact), a colour-coded severity badge, status badge, and mitigation summary when present.
- Severity badge colours: Low (1–4, green), Medium (5–9, amber), High (10–15, orange), Critical (16–25, red).
- A clear empty state with an Add risk action appears when no risks exist.
- The project workspace header now includes a rose-tinted Risks button and an Open risks count tile.
- The dashboard Open risks summary card now shows the real count from Supabase RLS.
- No migration is needed — `public.risks` exists from the initial schema migration.

The register intentionally does not implement risk editing, deletion, or risk AI workflows.

## UI polish status

Issue #30 replaces the former sidebar-and-topbar authenticated layout with a single unified sticky top navigation bar, aligns all page content to a `max-w-6xl` container, and applies consistent spacing and background treatment across all authenticated routes.

- `AppNav` (`src/components/app/app-nav.tsx`) is a `"use client"` component shared by all authenticated pages. It uses `usePathname()` for active link highlighting, shows the signed-in user's email, and exposes a logout form.
- The nav matches the marketing site header: `Sparkles` logo mark, site name and tagline, pill-shaped active state, glassmorphism background (`bg-background/80 backdrop-blur-xl`).
- `app-sidebar.tsx` and `app-topbar.tsx` are removed.
- All authenticated pages use the `<AppNav>` + `<main className="flex-1 ...">` pattern. The Kanban board page uses a wider `max-w-[1720px]` content container to accommodate the five-column board layout.
- `src/app/layout.tsx` sets `flex min-h-dvh flex-col` on `<body>` so `<main>` fills the remaining viewport height without leaving empty space below short pages.
- A subtle dot-grid pattern is applied to `<body>` via CSS `radial-gradient` to give the white background texture without competing with page content.
- `src/lib/dashboard.ts` no longer exports `dashboardNavItems` or `DashboardNavItem`, which were used only by the deleted sidebar component.

## Environment variables

Copy `.env.example` to `.env.local` and provide the Supabase cloud project values:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

AI provider variables:

- `GROQ_API_KEY`

Do not prefix `GROQ_API_KEY` with `NEXT_PUBLIC_`. It is read only on the server inside the `/api/ai/*` route handlers and must never be exposed to client components. Configure it in local `.env.local` and in your deployment environment variables.

## Supabase Auth setup

Issue #6 adds Supabase email/password authentication using `@supabase/ssr`. The app does not use `@supabase/auth-helpers-nextjs`.

### Configure Supabase Cloud

1. Confirm the Issue #2 SQL schema has already been applied.
2. In the Supabase dashboard, go to `Authentication > Providers`.
3. Enable the `Email` provider.
4. Choose whether email confirmation is required.
5. In `Authentication > URL Configuration`, set the site URL to the deployed app URL. For local development, use `http://localhost:3000`.
6. Add local and deployed redirect URLs as needed, starting with `http://localhost:3000/**`.

### Auth behavior

- `/` remains public.
- `/login` signs users in with Supabase Auth and redirects authenticated users to `/dashboard`.
- `/register` creates a Supabase Auth user. If email confirmation is disabled, the new user is redirected to `/dashboard`; if confirmation is enabled, the page sends the user back to login with a check-your-email message.
- `/dashboard` verifies the user on the server with `supabase.auth.getUser()` and redirects unauthenticated users to `/login`.
- The dashboard shows the authenticated user's email and includes a logout form.
- `middleware.ts` refreshes Supabase auth cookies through the `@supabase/ssr` server client.

## Supabase database setup

Issue #2 adds the initial Supabase schema in:

```text
supabase/migrations/20260503000100_initial_schema.sql
```

The migration is designed for a Supabase cloud project. It creates the public app tables, enables Row Level Security, adds membership-based policies for authenticated users, and installs triggers for profile creation, project owner membership, and `updated_at` maintenance.

### Apply in Supabase Cloud

1. Open the Supabase dashboard for the Minavolve project.
2. Go to `SQL Editor`.
3. Open `supabase/migrations/20260503000100_initial_schema.sql`.
4. Paste the full SQL into a new query.
5. Run the query.
6. Confirm these tables exist in the `public` schema:
   - `profiles`
   - `projects`
   - `project_members`
   - `sprints`
   - `user_stories`
   - `risks`
   - `ai_generations`
   - `activity_events`

7. In `Authentication > Policies` or the Table Editor, confirm RLS is enabled for every table listed above.

You can also verify the cloud project from the SQL Editor:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'projects',
    'project_members',
    'sprints',
    'user_stories',
    'risks',
    'ai_generations',
    'activity_events'
  )
order by tablename;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

### Schema notes

- Supabase Auth remains the source of truth for users in `auth.users`.
- `public.profiles` references `auth.users(id)` and is created automatically by the `on_auth_user_created` trigger.
- `public.projects.owner_id` references `public.profiles(id)`.
- Creating a project automatically adds the creator to `public.project_members` with the `owner` role.
- Project data access is based on `public.is_project_member(project_id)` and `public.is_project_owner(project_id)` helper functions.
- Activity events are append-only for authenticated project members through RLS; no update or delete policy is defined for normal clients.

## Why this is a good recruiter/reviewer snapshot

This foundation demonstrates product framing, route organization, design consistency, and readiness for future backend integration without mixing in unfinished auth or data concerns. It gives reviewers a clear picture of how the product is intended to feel before the interactive workflow work begins.
