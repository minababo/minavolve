-- Align user_stories table with Issue #14 user story creation/listing feature.
-- Records the required schema for story CRUD, sprint assignment, and acceptance criteria.

alter table public.user_stories
add column if not exists sprint_id uuid;

alter table public.user_stories
add column if not exists description text;

alter table public.user_stories
add column if not exists acceptance_criteria text[] not null default '{}';

alter table public.user_stories
add column if not exists story_points integer not null default 1;

alter table public.user_stories
add column if not exists priority text not null default 'medium';

alter table public.user_stories
add column if not exists status text not null default 'backlog';

alter table public.user_stories
add column if not exists sort_order numeric not null default 0;

alter table public.user_stories
add column if not exists assignee_id uuid;

alter table public.user_stories
add column if not exists updated_at timestamptz not null default now();

alter table public.user_stories
drop constraint if exists user_stories_sprint_id_fkey;

alter table public.user_stories
add constraint user_stories_sprint_id_fkey
foreign key (sprint_id)
references public.sprints(id)
on delete set null;

alter table public.user_stories
drop constraint if exists user_stories_assignee_id_fkey;

alter table public.user_stories
add constraint user_stories_assignee_id_fkey
foreign key (assignee_id)
references public.profiles(id)
on delete set null;

alter table public.user_stories
drop constraint if exists user_stories_story_points_check;

alter table public.user_stories
add constraint user_stories_story_points_check
check (story_points between 1 and 100);

alter table public.user_stories
drop constraint if exists user_stories_priority_check;

alter table public.user_stories
add constraint user_stories_priority_check
check (priority in ('low', 'medium', 'high', 'urgent'));

alter table public.user_stories
drop constraint if exists user_stories_status_check;

alter table public.user_stories
add constraint user_stories_status_check
check (status in ('backlog', 'todo', 'in_progress', 'review', 'done'));

create index if not exists user_stories_project_id_idx
on public.user_stories(project_id);

create index if not exists user_stories_sprint_id_idx
on public.user_stories(sprint_id);

create index if not exists user_stories_status_idx
on public.user_stories(status);

create index if not exists user_stories_assignee_id_idx
on public.user_stories(assignee_id);