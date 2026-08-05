-- Run this in Supabase SQL Editor to fix "Email not confirmed" for admin login.
-- Admin login after running:
-- Email: terrax@gmail.com
-- Password: Admin123@@

update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  updated_at = now()
where email = 'terrax@gmail.com';
