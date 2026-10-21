-- DCYM Bokaro Parish: run this once in Supabase (SQL Editor > New query > paste > Run).

create table if not exists public.site_content (
  id int primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Anyone can read the content (the public website needs this).
create policy "public can read content" on public.site_content
  for select using (true);

-- Only signed-in staff (users you create in Supabase) can change it.
create policy "staff can add content" on public.site_content
  for insert to authenticated with check (true);
create policy "staff can edit content" on public.site_content
  for update to authenticated using (true) with check (true);

-- Public storage bucket for photos.
insert into storage.buckets (id, name, public)
values ('parish-media', 'parish-media', true)
on conflict (id) do nothing;

create policy "public can view photos" on storage.objects
  for select using (bucket_id = 'parish-media');
create policy "staff can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'parish-media');
create policy "staff can delete photos" on storage.objects
  for delete to authenticated using (bucket_id = 'parish-media');
