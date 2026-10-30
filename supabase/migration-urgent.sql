alter table jobs add column if not exists urgent boolean not null default false;
drop policy if exists "anyone inserts" on jobs;
create policy "anyone inserts" on jobs for insert with check (approved=false and urgent=false);
