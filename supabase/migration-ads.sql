-- Реклам: онцлох зар, байгууллагын профайл, баннер, захиалга
-- Supabase > SQL Editor дээр нэг удаа ажиллуулна.

-- 1) Онцлох зар (админ Table Editor дээр featured=true болгож, featured_until-д хугацаа тавина)
alter table jobs add column if not exists featured boolean not null default false;
alter table jobs add column if not exists featured_until timestamptz;
drop policy if exists "anyone inserts" on jobs;
create policy "anyone inserts" on jobs for insert with check (approved=false and featured=false);

-- 2) Байгууллагын профайл (premium_until хугацаа дуустал Premium харагдана)
create table if not exists companies(
 id uuid primary key default gen_random_uuid(),
 name text unique not null, about text, website text, phone text, address text,
 logo_url text, cover_url text, premium_until timestamptz,
 approved boolean not null default false, created_at timestamptz not null default now());
alter table companies enable row level security;
drop policy if exists "see approved companies" on companies;
create policy "see approved companies" on companies for select using (approved);

-- 3) Баннер (place: 'home' эсвэл 'jobs'; ends_at дуусмагц автоматаар алга болно)
create table if not exists banners(
 id uuid primary key default gen_random_uuid(),
 place text not null check (place in ('home','jobs')),
 image_url text not null, link text,
 starts_at timestamptz not null default now(), ends_at timestamptz,
 created_at timestamptz not null default now());
alter table banners enable row level security;
drop policy if exists "see active banners" on banners;
create policy "see active banners" on banners for select using (starts_at<=now() and (ends_at is null or ends_at>now()));

-- 4) Захиалгын хүсэлт (зөвхөн нэмнэ, админ л харна)
create table if not exists ad_orders(
 id uuid primary key default gen_random_uuid(),
 plan text not null check (plan in ('featured','profile','banner')),
 org text not null, contact text not null, note text,
 created_at timestamptz not null default now());
alter table ad_orders enable row level security;
drop policy if exists "anyone orders" on ad_orders;
create policy "anyone orders" on ad_orders for insert with check (true);
