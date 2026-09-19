-- PostgreSQL schema for TERRA-X blog administration.
-- The Node server also applies this schema automatically on startup.
create extension if not exists pgcrypto;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  post_date date default current_date,
  read_time text,
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

create or replace function set_blog_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at
before update on blog_posts
for each row execute function set_blog_updated_at();

create index if not exists blog_posts_published_idx on blog_posts (status, published_at desc);
