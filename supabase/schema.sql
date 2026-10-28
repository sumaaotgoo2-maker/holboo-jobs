create table jobs(
 id uuid primary key default gen_random_uuid(),
 owner uuid not null references auth.users(id) default auth.uid(),
 title text not null, company text not null, location text, type text,
 category text, salary text, description text, contact text,
 approved boolean not null default false,
 created_at timestamptz not null default now());
alter table jobs enable row level security;
create policy "all see approved" on jobs for select using (approved);
create policy "owner sees own" on jobs for select using (auth.uid()=owner);
create policy "owner inserts" on jobs for insert with check (auth.uid()=owner and approved=false);
create policy "owner deletes" on jobs for delete using (auth.uid()=owner);
