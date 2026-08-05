-- Run this in Supabase SQL Editor.
-- After this, create one Supabase Auth user for yourself from Authentication > Users.

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  post_date date default current_date,
  read_time text default '5 min read',
  image_alt_text text,
  image_title text,
  meta_title text,
  meta_description text,
  canonical_url text,
  author_name text not null default 'TERRA-X Team',
  category text not null default 'Technology',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts
  add column if not exists post_date date default current_date,
  add column if not exists read_time text default '5 min read',
  add column if not exists image_alt_text text,
  add column if not exists image_title text,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists canonical_url text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Published blogs are public" on public.blog_posts;
create policy "Published blogs are public"
on public.blog_posts
for select
using (status = 'published');

drop policy if exists "Authenticated admins can read all blogs" on public.blog_posts;
create policy "Authenticated admins can read all blogs"
on public.blog_posts
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can create blogs" on public.blog_posts;
create policy "Authenticated admins can create blogs"
on public.blog_posts
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update blogs" on public.blog_posts;
create policy "Authenticated admins can update blogs"
on public.blog_posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete blogs" on public.blog_posts;
create policy "Authenticated admins can delete blogs"
on public.blog_posts
for delete
to authenticated
using (true);

create index if not exists blog_posts_status_published_at_idx
on public.blog_posts (status, published_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Blog images are public" on storage.objects;
create policy "Blog images are public"
on storage.objects
for select
using (bucket_id = 'blog-images');

drop policy if exists "Authenticated admins can upload blog images" on storage.objects;
create policy "Authenticated admins can upload blog images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated admins can update blog images" on storage.objects;
create policy "Authenticated admins can update blog images"
on storage.objects
for update
to authenticated
using (bucket_id = 'blog-images')
with check (bucket_id = 'blog-images');

drop policy if exists "Authenticated admins can delete blog images" on storage.objects;
create policy "Authenticated admins can delete blog images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-images');

insert into public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  author_name,
  category,
  status,
  published_at
) values (
  'How Terra-X Thinks About Autonomous Excavation',
  'how-terra-x-thinks-about-autonomous-excavation',
  'A short introduction to the robotics, sensing, and field-safety thinking behind TERRA-X autonomous heavy machinery.',
  'Autonomous excavation is not just a software problem. It needs rugged hardware, reliable perception, careful planning, and a field workflow that operators can trust.

## Why it matters

Construction, agriculture, rescue, and defense teams often work in difficult environments where precision and safety matter at the same time.

- AI helps the machine understand the work area.
- LiDAR and sensors help the system map surroundings.
- Remote supervision keeps humans away from risky zones.

TERRA-X is building this stack for real-world heavy-machine operations.',
  null,
  'TERRA-X Team',
  'Technology',
  'published',
  now()
) on conflict (slug) do nothing;
