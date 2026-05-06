# Minavolve

Minavolve is an Agile sprint board product concept with room for an AI assistant. This repository currently ships a polished landing page, Supabase email/password authentication, an authenticated dashboard layout, initial Supabase-backed project/sprint/user story creation and listing, and a basic read-only Kanban board that later issues can extend with drag-and-drop interactions and AI workflows.

## What this issue includes

- A marketing landing page for the Minavolve concept
- App Router route structure for `/`, `/login`, `/register`, and `/dashboard`
- Shared product copy in `src/lib/site.ts`
- Reusable marketing components for the landing page
- Supabase email/password login, registration, logout, and protected dashboard access
- Authenticated dashboard layout with sidebar navigation, top bar, static summary metrics, placeholder work sections, and a five-column Kanban preview
- Authenticated project listing, project creation, and a basic project workspace placeholder backed by Supabase RLS
- Project-scoped sprint listing, sprint creation, and a basic sprint workspace placeholder backed by Supabase RLS
- Project-scoped user story listing, story creation, optional sprint assignment, and a basic story workspace placeholder backed by Supabase RLS
- Project-scoped read-only Kanban board grouped by user story status
- Starter environment variable documentation in `.env.example`
- Initial Supabase schema migration for projects, sprints, stories, risks, AI generations, activity, memberships, and profiles

## What is intentionally not implemented yet

- No project editing or deletion
- No sprint editing or deletion
- No user story editing or deletion
- No drag-and-drop board behavior or Kanban status updates
- No charts or risk register CRUD
- No AI API routes or provider integration

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

## Dashboard status

Issue #8 adds the authenticated dashboard shell. The page keeps the existing server-side Supabase user check, shows the signed-in user's email in the top bar, and keeps logout wired through the dashboard server action.

Current dashboard content is intentionally static:

- Summary cards for projects, active sprints, user stories, and open risks. Project, active sprint, and user story counts are read from Supabase when available.
- Placeholder sections for recent projects, sprint planning, Kanban preview, risk register, delivery analytics, and AI assistant
- A visual Kanban preview with Backlog, To Do, In Progress, Review, and Done columns. Project workspaces also include a read-only Kanban board backed by user stories.

Drag-and-drop, Kanban movement, charts, risk CRUD, and AI provider calls remain out of scope for this issue.

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

Issue #16 adds a basic project-specific Kanban board:

- `/projects/[projectId]/kanban` reads user stories from `public.user_stories` for the current project.
- Stories are grouped into Backlog, To Do, In Progress, Review, and Done columns based on `status`.
- Cards show title, priority, story points, status, sprint name when linked, and acceptance criteria count.
- Project workspaces link to the Kanban board, and story detail pages link back to the board.
- Empty columns show clear empty states.

The board is read-only. Drag-and-drop, sort persistence, and status updates remain out of scope for this issue.

The implementation assumes `public.user_stories.status` and `public.user_stories.sort_order` already exist, as defined in the initial schema, and also uses the Issue #14 story fields such as `acceptance_criteria` and `story_points` for card metadata.

## Environment variables

Copy `.env.example` to `.env.local` and provide the Supabase cloud project values:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

AI provider variables remain placeholders for later issues:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

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
