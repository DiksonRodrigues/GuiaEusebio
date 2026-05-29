-- ============================================================
-- 005 — Adiciona icon_name e color na tabela categories
-- ============================================================

alter table public.categories
  add column if not exists icon_name text,
  add column if not exists color     text;

update public.categories set icon_name = 'Utensils',    color = '#ef4444' where slug = 'alimentacao';
update public.categories set icon_name = 'ShoppingCart', color = '#10b981' where slug = 'supermercados';
update public.categories set icon_name = 'Pill',         color = '#3b82f6' where slug = 'farmacias';
update public.categories set icon_name = 'Sparkles',     color = '#ec4899' where slug = 'beleza-estetica';
update public.categories set icon_name = 'Heart',        color = '#f43f5e' where slug = 'saude';
update public.categories set icon_name = 'BookOpen',     color = '#8b5cf6' where slug = 'educacao';
update public.categories set icon_name = 'Wrench',       color = '#f59e0b' where slug = 'servicos';
update public.categories set icon_name = 'Store',        color = '#6366f1' where slug = 'lojas-comercio';
update public.categories set icon_name = 'Car',          color = '#64748b' where slug = 'automotivo';
update public.categories set icon_name = 'Dumbbell',     color = '#0ea5e9' where slug = 'lazer-esporte';
