-- Create mixer_presets table
create table if not exists public.mixer_presets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  mixer_state jsonb not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Add RLS policies
alter table public.mixer_presets enable row level security;

-- Create policies
create policy "Users can view their own mixer presets"
  on public.mixer_presets
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mixer presets"
  on public.mixer_presets
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mixer presets"
  on public.mixer_presets
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own mixer presets"
  on public.mixer_presets
  for delete
  using (auth.uid() = user_id);