-- 1) Админы (ЗӨВХӨН энд бичсэн имэйл админ эрхтэй болно)
create table if not exists site_admins(email text primary key);
alter table site_admins enable row level security;
insert into site_admins(email) values ('ТАНЫ_ИМЭЙЛ_ЭНД') on conflict do nothing;

create or replace function is_admin() returns boolean
language sql security definer stable set search_path=public as
$$ select exists(select 1 from site_admins where email = (auth.jwt() ->> 'email')) $$;

-- 2) Админд зар, профайл, захиалгыг удирдах эрх
alter table ad_orders add column if not exists status text not null default 'new';
alter table jobs add column if not exists featured_until timestamptz;
drop policy if exists "admin all jobs" on jobs;
create policy "admin all jobs" on jobs for all to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "admin all seekers" on seekers;
create policy "admin all seekers" on seekers for all to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "admin all orders" on ad_orders;
create policy "admin all orders" on ad_orders for all to authenticated using (is_admin()) with check (is_admin());
