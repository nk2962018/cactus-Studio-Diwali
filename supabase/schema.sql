create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 120),
  email text not null default '' check (char_length(email) <= 180),
  address text not null default '' check (char_length(address) <= 500),
  city text not null default '' check (char_length(city) <= 120),
  state text not null default '' check (char_length(state) <= 120),
  pincode text not null default '' check (pincode = '' or pincode ~ '^[1-9][0-9]{5}$'),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

create policy "Users read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Users create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);