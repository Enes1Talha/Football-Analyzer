begin;
create or replace function public.career_points(total integer, revealed integer) returns integer
language sql immutable set search_path='' as $$
 select greatest(20,100-20*greatest(0,revealed-2))
$$;
notify pgrst,'reload schema';
commit;
