-- Supabase Schema Final for Therra UMKM Platform
-- PostgreSQL-compatible, ready to paste into Supabase SQL Editor

-- Extensions (Supabase usually enables these by default)
create extension if not exists pgcrypto;

-- Auth tables for @auth/core adapter (NeonAdapter)
create table if not exists auth_users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table if not exists auth_accounts (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references auth_users(id) on delete cascade,
  provider text not null,
  type text not null,
  "providerAccountId" text not null,
  access_token text,
  expires_at bigint,
  refresh_token text,
  id_token text,
  scope text,
  session_state text,
  token_type text,
  password text
);
create index if not exists idx_auth_accounts_user on auth_accounts("userId");
create index if not exists idx_auth_accounts_provider on auth_accounts(provider, "providerAccountId");

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references auth_users(id) on delete cascade,
  expires timestamptz not null,
  "sessionToken" text unique not null
);

create table if not exists auth_verification_token (
  identifier text not null,
  token text not null,
  expires timestamptz not null
);
create unique index if not exists idx_auth_verification_token on auth_verification_token(identifier, token);

-- Application tables
create table if not exists users (
  id bigserial primary key,
  license_code text unique,
  business_name text,
  role text not null default 'umkm', -- values: 'umkm', 'admin'
  is_active boolean not null default true,
  expires_at timestamptz,
  device_id text,
  max_devices integer not null default 1,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists idx_users_role on users(role);

create table if not exists products (
  id bigserial primary key,
  name text not null,
  description text,
  price numeric(12,2) not null,
  stock integer not null default 0,
  category text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists orders (
  id bigserial primary key,
  customer_name text not null,
  customer_phone text,
  product_id bigint not null references products(id) on delete restrict,
  quantity integer not null,
  total_amount numeric(12,2) not null,
  channel text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists idx_orders_product on orders(product_id);
create index if not exists idx_orders_status on orders(status);

create table if not exists sales_data (
  id bigserial primary key,
  order_id bigint references orders(id) on delete set null,
  amount numeric(12,2) not null,
  type text not null check (type in ('income','expense')),
  description text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists idx_sales_date on sales_data(date);
create index if not exists idx_sales_type on sales_data(type);

create table if not exists bot_logs (
  id bigserial primary key,
  customer_name text,
  customer_message text not null,
  bot_response text not null,
  channel text,
  intent text,
  created_at timestamptz not null default now()
);
create index if not exists idx_bot_logs_created_at on bot_logs(created_at desc);
create index if not exists idx_bot_logs_channel on bot_logs(channel);

create table if not exists therra_logs (
  id bigserial primary key,
  user_message text not null,
  ai_response text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_therra_logs_created_at on therra_logs(created_at desc);

-- Seed minimal data
insert into users (license_code, business_name, role, is_active, expires_at, max_devices, created_by)
values ('UMKM-0001-DEMO', 'Contoh UMKM', 'umkm', true, now() + interval '90 days', 2, 'admin')
on conflict (license_code) do nothing;

insert into products (name, description, price, stock, category, image_url)
values
  ('Kopi Arabika 250g', 'Kopi premium untuk penikmat', 75000, 100, 'Minuman', ''),
  ('Brownies Coklat', 'Brownies homemade lembut', 55000, 50, 'Makanan', '')
on conflict do nothing;

-- Sample order and sales record
do $$
declare p_id bigint;
declare o_id bigint;
begin
  select id into p_id from products where name = 'Kopi Arabika 250g' limit 1;
  if p_id is not null then
    insert into orders (customer_name, customer_phone, product_id, quantity, total_amount, channel, status)
    values ('Demo Customer', '081234567890', p_id, 2, 150000, 'web', 'pending')
    returning id into o_id;
    insert into sales_data (order_id, amount, type, description)
    values (o_id, 150000, 'income', 'Order from Demo Customer');
  end if;
end $$;

-- Done

