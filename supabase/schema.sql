create extension if not exists "uuid-ossp";

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  goal text,
  sex text,
  height_cm numeric,
  weight_kg numeric,
  age integer,
  lifestyle text,
  calorie_target integer,
  protein_target_g integer,
  fat_target_g integer,
  carbs_target_g integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists dining_halls (
  id text primary key,
  name text not null
);

create table if not exists menu_items (
  id text primary key,
  name text not null,
  calories integer not null,
  protein_g integer not null,
  fat_g integer not null,
  carbs_g integer not null,
  updated_at timestamptz default now()
);

create table if not exists menu_entries (
  id uuid primary key default uuid_generate_v4(),
  dining_hall_id text references dining_halls(id),
  date date not null,
  period text not null,
  menu_item_id text references menu_items(id)
);

create table if not exists meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  meal_name text not null,
  created_at timestamptz default now()
);

create table if not exists meal_log_items (
  id uuid primary key default uuid_generate_v4(),
  meal_log_id uuid references meal_logs(id) on delete cascade,
  menu_item_id text references menu_items(id),
  quantity integer not null default 1
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
before update on profiles
for each row execute function set_updated_at();

insert into dining_halls (id, name)
values
  ('hub', 'The Hub'),
  ('juniper', 'Juniper Dining'),
  ('argos', 'Argos')
on conflict do nothing;

alter table profiles enable row level security;
alter table meal_logs enable row level security;
alter table meal_log_items enable row level security;
alter table dining_halls enable row level security;
alter table menu_items enable row level security;
alter table menu_entries enable row level security;

-- Every policy is dropped before being created so this whole file can be
-- re-run safely at any time.

-- Menu data is public to read.
drop policy if exists "Dining halls are publicly readable" on dining_halls;
create policy "Dining halls are publicly readable" on dining_halls
  for select using (true);
drop policy if exists "Menu items are publicly readable" on menu_items;
create policy "Menu items are publicly readable" on menu_items
  for select using (true);
drop policy if exists "Menu entries are publicly readable" on menu_entries;
create policy "Menu entries are publicly readable" on menu_entries
  for select using (true);

-- The app inserts menu items when a user logs a meal.
drop policy if exists "Signed-in users can add menu items" on menu_items;
create policy "Signed-in users can add menu items" on menu_items
  for insert to authenticated with check (true);
drop policy if exists "Signed-in users can update menu items" on menu_items;
create policy "Signed-in users can update menu items" on menu_items
  for update to authenticated using (true);

drop policy if exists "Profiles are viewable by owner" on profiles;
create policy "Profiles are viewable by owner" on profiles
  for select using (auth.uid() = user_id);
drop policy if exists "Profiles are editable by owner" on profiles;
create policy "Profiles are editable by owner" on profiles
  for insert with check (auth.uid() = user_id);
drop policy if exists "Profiles update by owner" on profiles;
create policy "Profiles update by owner" on profiles
  for update using (auth.uid() = user_id);

drop policy if exists "Meal logs by owner" on meal_logs;
create policy "Meal logs by owner" on meal_logs
  for select using (auth.uid() = user_id);
drop policy if exists "Meal logs insert by owner" on meal_logs;
create policy "Meal logs insert by owner" on meal_logs
  for insert with check (auth.uid() = user_id);
drop policy if exists "Meal logs delete by owner" on meal_logs;
create policy "Meal logs delete by owner" on meal_logs
  for delete using (auth.uid() = user_id);

drop policy if exists "Meal log items by owner" on meal_log_items;
create policy "Meal log items by owner" on meal_log_items
  for select using (
    auth.uid() = (select user_id from meal_logs where meal_logs.id = meal_log_items.meal_log_id)
  );
drop policy if exists "Meal log items insert by owner" on meal_log_items;
create policy "Meal log items insert by owner" on meal_log_items
  for insert with check (
    auth.uid() = (select user_id from meal_logs where meal_logs.id = meal_log_items.meal_log_id)
  );
drop policy if exists "Meal log items delete by owner" on meal_log_items;
create policy "Meal log items delete by owner" on meal_log_items
  for delete using (
    auth.uid() = (select user_id from meal_logs where meal_logs.id = meal_log_items.meal_log_id)
  );
