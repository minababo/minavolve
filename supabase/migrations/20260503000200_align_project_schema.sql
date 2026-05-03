alter table public.projects
add column if not exists project_key text;

alter table public.projects
add column if not exists description text;

alter table public.projects
add column if not exists status text not null default 'active';

alter table public.projects
add column if not exists start_date date;

alter table public.projects
add column if not exists target_end_date date;

alter table public.projects
add column if not exists updated_at timestamptz not null default now();

update public.projects
set project_key = upper(left(regexp_replace(coalesce(name, 'PROJECT'), '[^a-zA-Z0-9]', '', 'g'), 10))
where project_key is null;

alter table public.projects
alter column project_key set not null;

alter table public.projects
drop constraint if exists projects_status_check;

alter table public.projects
add constraint projects_status_check
check (status in ('active', 'paused', 'completed', 'archived'));

alter table public.projects
drop constraint if exists projects_owner_key_unique;

alter table public.projects
add constraint projects_owner_key_unique
unique (owner_id, project_key);

create index if not exists projects_owner_id_idx
on public.projects(owner_id);

create index if not exists projects_status_idx
on public.projects(status);