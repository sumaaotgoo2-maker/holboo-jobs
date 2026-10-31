-- Нэвтрээгүй хүн зар нэмэх боломжтой болгоно (зар approved=false-аар орно)
alter table jobs alter column owner drop not null;
drop policy if exists "owner inserts" on jobs;
create policy "anyone inserts" on jobs for insert with check (approved=false);
