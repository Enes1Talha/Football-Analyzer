-- Accept the original Sørloth spelling as well as SORLOTH; preserve permissions.
begin;
create or replace function public.game_answer_key(value text) returns text language sql immutable set search_path='' as $$
 select regexp_replace(lower(translate(coalesce(value,''),'İıŞşĞğÜüÖöÇçÁáÀàÂâÃãÄäÅåÉéÈèÊêËëÍíÌìÎîÏïÓóÒòÔôÕõÚúÙùÛûÑñĆćČčŠšŽžØø','IiSsGgUuOoCcAaAaAaAaAaAaEeEeEeEeIiIiIiIiOoOoOoOoUuUuUuNnCcCcSsZzOo')),'[^a-z0-9]','','g');
$$;
commit;
