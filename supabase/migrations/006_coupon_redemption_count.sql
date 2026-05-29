-- ============================================================
-- 006 — Adiciona redemption_count na tabela coupons
-- ============================================================

alter table public.coupons
  add column if not exists redemption_count int not null default 0;

create or replace function public.increment_coupon_redemption(cid uuid)
returns void
language sql
security definer
as $$
  update public.coupons
  set redemption_count = redemption_count + 1
  where id = cid;
$$;
