alter table jobs add column if not exists urgent boolean not null default false;
drop policy if exists "anyone inserts" on jobs;
create policy "anyone inserts" on jobs for insert with check (approved=false);
create table if not exists seekers(
 id uuid primary key default gen_random_uuid(),
 name text not null, profession text not null, aimag text, salary text, about text,
 contact text not null, urgent boolean not null default false,
 approved boolean not null default false, created_at timestamptz not null default now());
alter table seekers enable row level security;
drop policy if exists "see approved seekers" on seekers;
create policy "see approved seekers" on seekers for select using (approved);
drop policy if exists "anyone adds seeker" on seekers;
create policy "anyone adds seeker" on seekers for insert with check (approved=false);
revoke select on seekers from anon;
grant select (id,name,profession,aimag,salary,about,urgent,created_at) on seekers to anon;
