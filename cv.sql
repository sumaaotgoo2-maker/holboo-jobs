-- Supabase → SQL Editor дээр нэг удаа ажиллуулна

-- 1) Өргөдлийн хүснэгт
create table if not exists public.applications (
  id         uuid primary key default gen_random_uuid(),
  job_id     text,                       -- зарын id (хоосон бол ерөнхий CV)
  job_title  text,
  name       text not null check (char_length(name)  between 2 and 100),
  phone      text not null check (char_length(phone) between 6 and 30),
  email      text check (email   is null or char_length(email)   <= 120),
  message    text check (message is null or char_length(message) <= 2000),
  file_path  text not null check (file_path ~ '^[0-9a-f-]{36}\.(pdf|doc|docx)$'),
  file_name  text check (file_name is null or char_length(file_name) <= 200),
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

drop policy if exists "cv_insert_all"  on public.applications;
drop policy if exists "cv_admin_read"  on public.applications;
drop policy if exists "cv_admin_del"   on public.applications;

-- Хэн ч (нэвтрээгүй ч) CV илгээж болно, гэхдээ уншиж чадахгүй
create policy "cv_insert_all" on public.applications
  for insert to anon, authenticated with check (true);
-- Зөвхөн админ харна/устгана
create policy "cv_admin_read" on public.applications
  for select to authenticated using (public.is_admin());
create policy "cv_admin_del" on public.applications
  for delete to authenticated using (public.is_admin());

-- 2) Хувийн (private) storage bucket: 5MB, зөвхөн PDF/DOC/DOCX
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cv_upload_all"  on storage.objects;
drop policy if exists "cv_files_admin_read" on storage.objects;
drop policy if exists "cv_files_admin_del"  on storage.objects;

create policy "cv_upload_all" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'cvs');
create policy "cv_files_admin_read" on storage.objects
  for select to authenticated using (bucket_id = 'cvs' and public.is_admin());
create policy "cv_files_admin_del" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs' and public.is_admin());
