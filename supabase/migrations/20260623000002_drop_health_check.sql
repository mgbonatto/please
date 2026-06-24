-- 20260623000002_drop_health_check.sql
-- The M1 connection probe is no longer referenced by the app (homepage replaced in M2).
drop table if exists public.health_check;
