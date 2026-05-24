-- ============================================================
-- SPRINT 1 — Bairros
-- Execute no Supabase SQL Editor (ordem importa)
-- ============================================================

-- 1. Tabela de bairros
create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  position int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists neighborhoods_active_idx
  on public.neighborhoods(is_active, position);

-- RLS
alter table public.neighborhoods enable row level security;

create policy "neighborhoods_public_select"
  on public.neighborhoods for select
  using (is_active = true);

create policy "neighborhoods_service_all"
  on public.neighborhoods for all
  using (auth.role() = 'service_role');

-- 2. Seed — bairros de Eusébio/CE
-- Fonte: Lei Municipal 049/2021 — https://www.eusebio.ce.gov.br
insert into public.neighborhoods (name, slug, position) values
  ('Amador',           'amador',          1),
  ('Autódromo',        'autodromo',       2),
  ('Cararu',           'cararu',          3),
  ('Centro',           'centro',          4),
  ('Cidade Alpha',     'cidade-alpha',    5),
  ('Coaçú',           'coacu',           6),
  ('Coité',           'coite',           7),
  ('Encantada',        'encantada',       8),
  ('Guaribas',         'guaribas',        9),
  ('Jabuti',           'jabuti',          10),
  ('Lagoinha',         'lagoinha',        11),
  ('Mangabeira',       'mangabeira',      12),
  ('Novo Portugal',    'novo-portugal',   13),
  ('Olho D''água',     'olho-dagua',      14),
  ('Parque Hawaí',     'parque-hawai',    15),
  ('Pires Façanha',    'pires-facanha',   16),
  ('Precabura',        'precabura',       17),
  ('Santa Clara',      'santa-clara',     18),
  ('Santo Antônio',    'santo-antonio',   19),
  ('Tamatanduba',      'tamatanduba',     20),
  ('Terral',           'terral',          21),
  ('Timbú',           'timbu',           22),
  ('Urucunema',        'urucunema',       23),
  ('Vereda Tropical',  'vereda-tropical', 24)
on conflict (slug) do nothing;

-- 3. Coluna neighborhood_id em businesses
alter table public.businesses
  add column if not exists neighborhood_id uuid
    references public.neighborhoods(id)
    on delete set null;

create index if not exists businesses_neighborhood_idx
  on public.businesses(neighborhood_id);
