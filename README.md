# Minavolve

Minavolve is an Agile sprint board product concept with room for an AI assistant. This repository currently ships the visual foundation: a polished landing page, placeholder authentication routes, and a dashboard shell that later issues can connect to Supabase, drag-and-drop interactions, and AI workflows.

## What this issue includes

- A marketing landing page for the Minavolve concept
- App Router route structure for `/`, `/login`, `/register`, and `/dashboard`
- Shared product copy in `src/lib/site.ts`
- Reusable marketing components for the landing page
- Placeholder auth and dashboard pages with intentional styling
- Starter environment variable documentation in `.env.example`

## What is intentionally not implemented yet

- No Supabase setup or database calls
- No real authentication or session handling
- No drag-and-drop board behavior
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

## Linting

Run the project linter with:

```bash
npm run lint
```

## Route guide

- `/`: product landing page for Minavolve
- `/login`: placeholder sign-in screen
- `/register`: placeholder account creation screen
- `/dashboard`: placeholder sprint board shell

## Environment variables

The app does not consume external services yet, but `.env.example` documents the variables planned for upcoming issues:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

## Why this is a good recruiter/reviewer snapshot

This foundation demonstrates product framing, route organization, design consistency, and readiness for future backend integration without mixing in unfinished auth or data concerns. It gives reviewers a clear picture of how the product is intended to feel before the interactive workflow work begins.
