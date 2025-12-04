-- Recommended RLS policies for Supabase
-- Enable RLS on sensitive tables and add minimal policies

alter table products enable row level security;
alter table orders enable row level security;
alter table therra_logs enable row level security;
alter table bot_logs enable row level security;

-- Roles assumption:
-- - Service role (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS automatically in Supabase
-- - Anonymous/public users should have read-only where appropriate

-- Products: allow read to all, write only to service role
create policy products_read_all on products
  for select
  to public
  using (true);

create policy products_write_service on products
  for all
  to authenticated
  using (false)
  with check (false);
-- Note: service role bypasses policies; no explicit policy needed

-- Orders: no public access; only service role can read/write
create policy orders_no_public_select on orders
  for select
  to public
  using (false);

create policy orders_no_public_write on orders
  for all
  to public
  using (false)
  with check (false);

-- Therra logs: public insert disabled; only service role writes
create policy therra_logs_public_select on therra_logs
  for select
  to public
  using (true);

create policy therra_logs_public_insert_denied on therra_logs
  for insert
  to public
  with check (false);

-- Bot logs: read for admin dashboard, write via service role only
create policy bot_logs_public_select on bot_logs
  for select
  to public
  using (true);

create policy bot_logs_public_insert_denied on bot_logs
  for insert
  to public
  with check (false);

-- If you use Supabase Auth, prefer attaching policies to authenticated role
-- and redacting sensitive columns with views.

