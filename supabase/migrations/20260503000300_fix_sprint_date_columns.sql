alter table public.sprints
add column if not exists start_date date,
add column if not exists end_date date;

alter table public.sprints
drop constraint if exists sprints_date_order;

alter table public.sprints
add constraint sprints_date_order
check (
  start_date is null
  or end_date is null
  or end_date >= start_date
);