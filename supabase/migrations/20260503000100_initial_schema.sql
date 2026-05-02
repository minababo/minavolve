create schema if not exists extensions;
create extension if not exists "pgcrypto" with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_length check (email is null or length(trim(email)) > 3)
);

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_length check (length(trim(name)) between 2 and 120),
  constraint projects_status_check check (status in ('active', 'archived')),
  constraint projects_owner_name_unique unique (owner_id, name)
);

create table public.project_members (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_members_role_check check (role in ('owner', 'admin', 'member', 'viewer')),
  constraint project_members_project_user_unique unique (project_id, user_id)
);

create table public.sprints (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  goal text,
  status text not null default 'planned',
  starts_on date,
  ends_on date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sprints_name_length check (length(trim(name)) between 2 and 120),
  constraint sprints_status_check check (status in ('planned', 'active', 'completed', 'cancelled')),
  constraint sprints_date_range_check check (starts_on is null or ends_on is null or ends_on >= starts_on),
  constraint sprints_project_name_unique unique (project_id, name),
  constraint sprints_id_project_unique unique (id, project_id)
);

create table public.user_stories (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sprint_id uuid,
  title text not null,
  description text,
  status text not null default 'backlog',
  priority text not null default 'medium',
  story_points smallint,
  sort_order integer not null default 0,
  assignee_id uuid references public.profiles(id) on delete set null,
  reporter_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_stories_sprint_project_fk foreign key (sprint_id, project_id)
    references public.sprints(id, project_id) on delete set null (sprint_id),
  constraint user_stories_title_length check (length(trim(title)) between 2 and 180),
  constraint user_stories_status_check check (status in ('backlog', 'todo', 'in_progress', 'review', 'done', 'cancelled')),
  constraint user_stories_priority_check check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint user_stories_points_check check (story_points is null or story_points between 0 and 100),
  constraint user_stories_id_project_unique unique (id, project_id)
);

create table public.risks (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sprint_id uuid,
  user_story_id uuid,
  title text not null,
  description text,
  likelihood text not null default 'medium',
  impact text not null default 'medium',
  status text not null default 'open',
  owner_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  due_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint risks_sprint_project_fk foreign key (sprint_id, project_id)
    references public.sprints(id, project_id) on delete set null (sprint_id),
  constraint risks_story_project_fk foreign key (user_story_id, project_id)
    references public.user_stories(id, project_id) on delete set null (user_story_id),
  constraint risks_title_length check (length(trim(title)) between 2 and 180),
  constraint risks_likelihood_check check (likelihood in ('low', 'medium', 'high')),
  constraint risks_impact_check check (impact in ('low', 'medium', 'high')),
  constraint risks_status_check check (status in ('open', 'mitigating', 'resolved', 'accepted'))
);

create table public.ai_generations (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sprint_id uuid,
  user_story_id uuid,
  requested_by uuid references public.profiles(id) on delete set null,
  generation_type text not null,
  prompt text not null,
  response text,
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  status text not null default 'queued',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_generations_sprint_project_fk foreign key (sprint_id, project_id)
    references public.sprints(id, project_id) on delete set null (sprint_id),
  constraint ai_generations_story_project_fk foreign key (user_story_id, project_id)
    references public.user_stories(id, project_id) on delete set null (user_story_id),
  constraint ai_generations_type_check check (generation_type in ('standup_summary', 'sprint_review', 'risk_analysis', 'story_breakdown', 'general')),
  constraint ai_generations_status_check check (status in ('queued', 'completed', 'failed')),
  constraint ai_generations_input_tokens_check check (input_tokens is null or input_tokens >= 0),
  constraint ai_generations_output_tokens_check check (output_tokens is null or output_tokens >= 0),
  constraint ai_generations_prompt_length check (length(trim(prompt)) > 0)
);

create table public.activity_events (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activity_events_entity_type_check check (
    entity_type in ('project', 'project_member', 'sprint', 'user_story', 'risk', 'ai_generation')
  ),
  constraint activity_events_event_type_length check (length(trim(event_type)) between 2 and 80),
  constraint activity_events_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create index profiles_email_idx on public.profiles (lower(email)) where email is not null;
create index projects_owner_id_idx on public.projects (owner_id);
create index projects_status_idx on public.projects (status);
create index project_members_user_id_idx on public.project_members (user_id);
create index project_members_project_role_idx on public.project_members (project_id, role);
create index sprints_project_status_idx on public.sprints (project_id, status);
create index sprints_project_dates_idx on public.sprints (project_id, starts_on, ends_on);
create index user_stories_project_status_sort_idx on public.user_stories (project_id, status, sort_order);
create index user_stories_sprint_status_idx on public.user_stories (sprint_id, status);
create index user_stories_assignee_idx on public.user_stories (assignee_id);
create index risks_project_status_idx on public.risks (project_id, status);
create index risks_sprint_status_idx on public.risks (sprint_id, status);
create index risks_owner_idx on public.risks (owner_id);
create index ai_generations_project_type_idx on public.ai_generations (project_id, generation_type);
create index ai_generations_requested_by_idx on public.ai_generations (requested_by);
create index ai_generations_status_idx on public.ai_generations (status);
create index activity_events_project_created_idx on public.activity_events (project_id, created_at desc);
create index activity_events_actor_idx on public.activity_events (actor_id);
create index activity_events_entity_idx on public.activity_events (entity_type, entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_project_member(project_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = $1
      and pm.user_id = coalesce($2, auth.uid())
  );
$$;

create or replace function public.is_project_owner(project_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = $1
      and p.owner_id = coalesce($2, auth.uid())
  )
  or exists (
    select 1
    from public.project_members pm
    where pm.project_id = $1
      and pm.user_id = coalesce($2, auth.uid())
      and pm.role = 'owner'
  );
$$;

create or replace function public.shares_project_with_user(target_user_id uuid, user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.project_members mine
    join public.project_members theirs
      on theirs.project_id = mine.project_id
    where mine.user_id = coalesce($2, auth.uid())
      and theirs.user_id = $1
  );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', '')
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

  return new;
end;
$$;

create or replace function public.add_project_creator_as_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (project_id, user_id) do update
    set role = 'owner',
        updated_at = now();

  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_project_members_updated_at
before update on public.project_members
for each row execute function public.set_updated_at();

create trigger set_sprints_updated_at
before update on public.sprints
for each row execute function public.set_updated_at();

create trigger set_user_stories_updated_at
before update on public.user_stories
for each row execute function public.set_updated_at();

create trigger set_risks_updated_at
before update on public.risks
for each row execute function public.set_updated_at();

create trigger set_ai_generations_updated_at
before update on public.ai_generations
for each row execute function public.set_updated_at();

create trigger set_activity_events_updated_at
before update on public.activity_events
for each row execute function public.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create trigger add_project_creator_as_owner
after insert on public.projects
for each row execute function public.add_project_creator_as_owner();

insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    nullif(u.raw_user_meta_data ->> 'name', '')
  ),
  nullif(u.raw_user_meta_data ->> 'avatar_url', '')
from auth.users u
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.sprints enable row level security;
alter table public.user_stories enable row level security;
alter table public.risks enable row level security;
alter table public.ai_generations enable row level security;
alter table public.activity_events enable row level security;

revoke all on public.profiles from anon;
revoke all on public.projects from anon;
revoke all on public.project_members from anon;
revoke all on public.sprints from anon;
revoke all on public.user_stories from anon;
revoke all on public.risks from anon;
revoke all on public.ai_generations from anon;
revoke all on public.activity_events from anon;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_members to authenticated;
grant select, insert, update, delete on public.sprints to authenticated;
grant select, insert, update, delete on public.user_stories to authenticated;
grant select, insert, update, delete on public.risks to authenticated;
grant select, insert, update, delete on public.ai_generations to authenticated;
grant select, insert, update, delete on public.activity_events to authenticated;

revoke all on function public.is_project_member(uuid, uuid) from public;
revoke all on function public.is_project_owner(uuid, uuid) from public;
revoke all on function public.shares_project_with_user(uuid, uuid) from public;
grant execute on function public.is_project_member(uuid, uuid) to authenticated;
grant execute on function public.is_project_owner(uuid, uuid) to authenticated;
grant execute on function public.shares_project_with_user(uuid, uuid) to authenticated;

create policy "Profiles are visible to self and project peers"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.shares_project_with_user(id));

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Project members can view projects"
on public.projects
for select
to authenticated
using (public.is_project_member(id));

create policy "Authenticated users can create owned projects"
on public.projects
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Project owners can update projects"
on public.projects
for update
to authenticated
using (public.is_project_owner(id))
with check (public.is_project_owner(id) and owner_id = auth.uid());

create policy "Project owners can delete projects"
on public.projects
for delete
to authenticated
using (public.is_project_owner(id));

create policy "Project members can view memberships"
on public.project_members
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project owners can add members"
on public.project_members
for insert
to authenticated
with check (public.is_project_owner(project_id));

create policy "Project owners can update members"
on public.project_members
for update
to authenticated
using (public.is_project_owner(project_id))
with check (public.is_project_owner(project_id));

create policy "Project owners can remove members"
on public.project_members
for delete
to authenticated
using (public.is_project_owner(project_id) or (user_id = auth.uid() and role <> 'owner'));

create policy "Project members can view sprints"
on public.sprints
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project members can create sprints"
on public.sprints
for insert
to authenticated
with check (public.is_project_member(project_id) and (created_by is null or created_by = auth.uid()));

create policy "Project members can update sprints"
on public.sprints
for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

create policy "Project owners can delete sprints"
on public.sprints
for delete
to authenticated
using (public.is_project_owner(project_id));

create policy "Project members can view user stories"
on public.user_stories
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project members can create user stories"
on public.user_stories
for insert
to authenticated
with check (public.is_project_member(project_id) and (created_by is null or created_by = auth.uid()));

create policy "Project members can update user stories"
on public.user_stories
for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

create policy "Project owners can delete user stories"
on public.user_stories
for delete
to authenticated
using (public.is_project_owner(project_id));

create policy "Project members can view risks"
on public.risks
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project members can create risks"
on public.risks
for insert
to authenticated
with check (public.is_project_member(project_id) and (created_by is null or created_by = auth.uid()));

create policy "Project members can update risks"
on public.risks
for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

create policy "Project owners can delete risks"
on public.risks
for delete
to authenticated
using (public.is_project_owner(project_id));

create policy "Project members can view AI generations"
on public.ai_generations
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project members can create AI generations"
on public.ai_generations
for insert
to authenticated
with check (public.is_project_member(project_id) and (requested_by is null or requested_by = auth.uid()));

create policy "Project members can update AI generations"
on public.ai_generations
for update
to authenticated
using (public.is_project_member(project_id))
with check (public.is_project_member(project_id));

create policy "Project owners can delete AI generations"
on public.ai_generations
for delete
to authenticated
using (public.is_project_owner(project_id));

create policy "Project members can view activity events"
on public.activity_events
for select
to authenticated
using (public.is_project_member(project_id));

create policy "Project members can create activity events"
on public.activity_events
for insert
to authenticated
with check (public.is_project_member(project_id) and (actor_id is null or actor_id = auth.uid()));
