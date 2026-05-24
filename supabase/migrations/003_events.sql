create table public.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  business_id uuid references public.businesses(id) on delete set null,
  coupon_id uuid references public.coupons(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  user_agent text,
  referrer text,
  session_id text,
  created_at timestamptz not null default now()
);

create index events_type_created_idx on public.events(event_type, created_at desc);
create index events_business_idx on public.events(business_id, created_at desc) where business_id is not null;

alter table public.events enable row level security;
create policy "events_insert_anon" on public.events for insert with check (true);
create policy "events_select_service" on public.events for select using (auth.role() = 'service_role');
