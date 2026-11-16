begin;
alter table public.game_profiles
  add column display_name text not null default '' check (char_length(display_name)<=40),
  add column bio text not null default '' check (char_length(bio)<=160),
  add column avatar text not null default '' check (octet_length(avatar)<=180000);

create function public.game_profile() returns jsonb
language sql security definer set search_path = '' as $$
 select jsonb_build_object('username',username,'display_name',display_name,'bio',bio,'avatar',avatar,'created_at',created_at)
 from public.game_profiles where id=auth.uid();
$$;

create function public.game_update_profile(p_username text,p_display_name text,p_bio text,p_avatar text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid(); n text := lower(trim(p_username));
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if n is null or n !~ '^[a-z0-9_]{3,20}$' then raise exception 'Kullanıcı adı 3–20 karakter: a-z, 0-9 ve alt çizgi.'; end if;
 if p_display_name is null or char_length(trim(p_display_name))>40 then raise exception 'Görünen ad en fazla 40 karakter olabilir.'; end if;
 if p_bio is null or char_length(trim(p_bio))>160 then raise exception 'Biyografi en fazla 160 karakter olabilir.'; end if;
 if p_avatar is null or octet_length(p_avatar)>180000 or (p_avatar<>'' and p_avatar !~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$') then
   raise exception 'Fotoğraf işlenemedi. Başka bir fotoğraf seç.';
 end if;
 update public.game_profiles set username=n,display_name=trim(p_display_name),bio=trim(p_bio),avatar=p_avatar where id=u;
 if not found then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 return public.game_profile();
exception when unique_violation then raise exception 'Bu kullanıcı adı başka biri tarafından kullanılıyor.';
end $$;
revoke all on function public.game_profile(), public.game_update_profile(text,text,text,text) from public,anon;
grant execute on function public.game_profile(), public.game_update_profile(text,text,text,text) to authenticated;
notify pgrst, 'reload schema';
commit;
