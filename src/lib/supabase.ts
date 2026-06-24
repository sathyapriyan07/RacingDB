import { createClient } from "@supabase/supabase-js";

// Retrieve keys from environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Detect if keys are placeholder values or missing
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl !== "https://your-project.supabase.co" && 
  supabaseAnonKey !== "your-anon-public-key" &&
  supabaseUrl.trim() !== "" &&
  supabaseAnonKey.trim() !== "";

// Lazily initialize Supabase Client to avoid crashes when keys are absent
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean SQL migration queries to set up Supabase schema, RLS, and storage
export const SUPABASE_SETUP_SQL = `-- OneGrid F1 Database Schema & Storage Setup
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- =========================================================================
-- 1. TABLE CREATION
-- =========================================================================

-- F1 Journal Articles
create table if not exists public.articles (
  id text primary key,
  title text not null,
  summary text,
  content text not null,
  category text not null,
  "imageUrl" text,
  "publishedAt" text not null,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Custom Hall Of Fame Rankings
create table if not exists public.custom_hall_of_fame_rankings (
  id text primary key,
  "driverId" text not null,
  rank integer not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drivers Directory
create table if not exists public.drivers (
  id text primary key,
  name text not null,
  code text,
  "teamId" text,
  "teamName" text,
  country text,
  number integer,
  "birthDate" text,
  biography text,
  "imageUrl" text,
  stats jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Constructors / Teams
create table if not exists public.teams (
  id text primary key,
  name text not null,
  "fullCompanyName" text,
  base text,
  "teamPrincipal" text,
  chassis text,
  engine text,
  championships integer,
  "imageUrl" text,
  stats jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Grand Prix Circuits
create table if not exists public.circuits (
  id text primary key,
  name text not null,
  location text,
  country text,
  length text,
  laps integer,
  "recordTime" text,
  "recordDriver" text,
  "recordYear" text,
  description text,
  "mapImageUrl" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Formula 1 Races & Results
create table if not exists public.races (
  id text primary key,
  name text not null,
  round integer,
  date text,
  "circuitId" text,
  completed boolean default false,
  "winnerId" text,
  "fastestLap" jsonb,
  "driverOfTheDayId" text,
  "championshipImpact" text,
  results jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Profiles (to store emails with application security roles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text not null default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- =========================================================================
alter table public.articles enable row level security;
alter table public.custom_hall_of_fame_rankings enable row level security;
alter table public.drivers enable row level security;
alter table public.teams enable row level security;
alter table public.circuits enable row level security;
alter table public.races enable row level security;
alter table public.profiles enable row level security;

-- =========================================================================
-- 3. CREATE ROW LEVEL SECURITY POLICIES
-- =========================================================================

-- Public Read Access Policies (Permit anonymous reads so everyone can browse)
create policy "Allow public read access on articles" on public.articles for select using (true);
create policy "Allow public read access on custom_hall_of_fame_rankings" on public.custom_hall_of_fame_rankings for select using (true);
create policy "Allow public read access on drivers" on public.drivers for select using (true);
create policy "Allow public read access on teams" on public.teams for select using (true);
create policy "Allow public read access on circuits" on public.circuits for select using (true);
create policy "Allow public read access on races" on public.races for select using (true);
create policy "Allow public read access on profiles" on public.profiles for select using (true);

-- Admin-Only Write Access Policies (Restricts INSERT, UPDATE, DELETE to authenticated users with 'admin' role in profiles or metadata)
create policy "Allow admin CRUD on articles" on public.articles for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow admin CRUD on custom_hall_of_fame_rankings" on public.custom_hall_of_fame_rankings for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow admin CRUD on drivers" on public.drivers for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow admin CRUD on teams" on public.teams for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow admin CRUD on circuits" on public.circuits for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow admin CRUD on races" on public.races for all to authenticated 
  using (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Allow owner or admin update on profiles" on public.profiles for all to authenticated
  using (auth.uid() = id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (auth.uid() = id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- =========================================================================
-- 4. STORAGE BUCKET & STORAGE POLICIES
-- =========================================================================

-- Create the public f1-assets bucket if it does not exist
insert into storage.buckets (id, name, public) 
values ('f1-assets', 'f1-assets', true)
on conflict (id) do nothing;

-- Policy to allow anonymous users to read items from 'f1-assets' bucket (Public viewable)
create policy "Allow public access to assets"
  on storage.objects for select
  using ( bucket_id = 'f1-assets' );

-- Policy to allow ONLY authenticated admins to upload to 'f1-assets' bucket
create policy "Allow admin upload to assets"
  on storage.objects for insert
  to authenticated
  with check ( 
    bucket_id = 'f1-assets' 
    and (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Policy to allow ONLY authenticated admins to delete from 'f1-assets' bucket
create policy "Allow admin delete from assets"
  on storage.objects for delete
  to authenticated
  using ( 
    bucket_id = 'f1-assets' 
    and (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- =========================================================================
-- 5. ADMIN USER CREATION & PROMOTION (PROFILES TABLE SYNCHRONIZATION)
-- =========================================================================

-- OPTION A: RUN THIS QUERY IF YOUR ACCOUNT ALREADY EXISTS IN auth.users:
--
-- insert into public.profiles (id, email, role)
-- select id, email, 'admin' from auth.users where email = 'sathyafonegrid07@gmail.com'
-- on conflict (id) do update set role = 'admin';
--
-- update auth.users
-- set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
-- where email = 'sathyafonegrid07@gmail.com';

-- OPTION B: AUTOMATIC SYNCHRONIZATION TRIGGER FOR NEW REGISTRATIONS
-- This trigger automatically synchronizes newly registered accounts with the 'public.profiles' table,
-- and automatically elevates specified emails (like sathyafonegrid07@gmail.com) to 'admin'.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  assigned_role text := 'user';
begin
  if new.email = 'sathyafonegrid07@gmail.com' then
    assigned_role := 'admin';
  end if;

  -- Insert profile entry mapping the user ID and email
  insert into public.profiles (id, email, role)
  values (new.id, new.email, assigned_role)
  on conflict (id) do update set email = excluded.email, role = excluded.role;

  -- Sync raw user metadata to include role claim for client-side queries
  new.raw_user_meta_data := coalesce(new.raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', assigned_role);
  
  return new;
end;
$$ language plpgsql security definer;

-- Clean up older triggers if any
drop trigger if exists on_auth_user_created_assign_role on auth.users;
drop trigger if exists on_auth_user_created_sync_profile on auth.users;

-- Bind trigger on registration
create trigger on_auth_user_created_sync_profile
  before insert on auth.users
  for each row execute procedure public.handle_new_user();
`;
