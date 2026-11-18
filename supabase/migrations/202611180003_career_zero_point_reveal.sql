begin;
create or replace function public.career_points(total integer, revealed integer) returns integer
language sql immutable set search_path='' as $$
 select case when revealed>=total then 0 else greatest(0,100-20*greatest(0,revealed-2)) end
$$;
notify pgrst,'reload schema';
commit;
