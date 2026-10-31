-- Төлбөрийн мэдээллийг GitHub-д бичихгүй, Supabase-д хадгална (дараа нь Table Editor дээр засаж болно)
create table if not exists settings(key text primary key, value jsonb not null);
alter table settings enable row level security;
drop policy if exists "read bank" on settings;
create policy "read bank" on settings for select using (key = 'bank');
insert into settings(key,value) values('bank','{"bank":"Хаан банк","account":"73005005156262418","name":"С.Отгонмягмар"}')
on conflict (key) do update set value = excluded.value;
