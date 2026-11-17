-- Match results are public to read; imports are restricted to the server/admin.
-- The existing matches table was originally created outside these migrations.
begin;
alter table public.matches enable row level security;
revoke all on table public.matches from public, anon, authenticated;
grant select on table public.matches to anon, authenticated;
create policy matches_public_read on public.matches
  for select to anon, authenticated using (true);
commit;
