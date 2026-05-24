-- ============================================================
-- 000 — Schema base (rodar PRIMEIRO)
-- Cria: categories, businesses, business_products, coupons, leads
-- ============================================================

-- 1. Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_select"
  on public.categories for select using (true);

create policy "categories_service_all"
  on public.categories for all using (auth.role() = 'service_role');

-- Seed categorias
insert into public.categories (name, slug) values
  ('Alimentação',       'alimentacao'),
  ('Supermercados',     'supermercados'),
  ('Farmácias',         'farmacias'),
  ('Beleza & Estética', 'beleza-estetica'),
  ('Saúde',             'saude'),
  ('Educação',          'educacao'),
  ('Serviços',          'servicos'),
  ('Lojas & Comércio',  'lojas-comercio'),
  ('Automotivo',        'automotivo'),
  ('Lazer & Esporte',   'lazer-esporte')
on conflict (slug) do nothing;

-- 2. Businesses
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  address text,
  phone text,
  whatsapp text,
  hours text,
  website text,
  image_url text,
  rating numeric(3,1) default 4.5,
  reviews_count int default 0,
  featured boolean not null default false,
  discount_label text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_slug_idx on public.businesses(slug);
create index if not exists businesses_category_idx on public.businesses(category_id);
create index if not exists businesses_featured_idx on public.businesses(featured);

alter table public.businesses enable row level security;

create policy "businesses_public_select"
  on public.businesses for select using (true);

create policy "businesses_service_all"
  on public.businesses for all using (auth.role() = 'service_role');

-- 3. Business products
create table if not exists public.business_products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  price text,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists business_products_business_idx on public.business_products(business_id);

alter table public.business_products enable row level security;

create policy "business_products_public_select"
  on public.business_products for select using (true);

create policy "business_products_service_all"
  on public.business_products for all using (auth.role() = 'service_role');

-- 4. Coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  code text not null,
  discount_label text not null,
  description text,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists coupons_active_idx on public.coupons(active, expires_at);

alter table public.coupons enable row level security;

create policy "coupons_public_select"
  on public.coupons for select using (true);

create policy "coupons_service_all"
  on public.coupons for all using (auth.role() = 'service_role');

-- 5. Leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  responsible text not null,
  whatsapp text not null,
  email text not null,
  address text not null,
  status text not null default 'novo',
  notes text,
  created_at timestamptz not null default now(),
  constraint leads_status_check check (status in ('novo', 'em_contato', 'fechado', 'descartado'))
);

create index if not exists leads_status_idx on public.leads(status, created_at desc);

alter table public.leads enable row level security;

create policy "leads_insert_anon"
  on public.leads for insert with check (true);

create policy "leads_select_service"
  on public.leads for select using (auth.role() = 'service_role');

create policy "leads_update_service"
  on public.leads for update using (auth.role() = 'service_role');
