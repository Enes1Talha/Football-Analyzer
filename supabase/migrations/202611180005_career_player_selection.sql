begin;
alter function public.game_room(text,text,text) rename to game_room_before_pick;
revoke all on function public.game_room_before_pick(text,text,text) from public,anon,authenticated;
create function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare r public.game_rooms%rowtype; u uuid:=auth.uid(); submitted jsonb; selected_id text; answer_text text;
begin
 if p_action<>'career_pick' then return public.game_room_before_pick(p_action,p_code,p_value); end if;
 if u is null then raise exception 'Önce giriş yap.'; end if;
 select * into r from public.game_rooms where code=upper(trim(p_code)) for update;
 if not found or (u is distinct from r.host_id and u is distinct from r.guest_id) then raise exception 'Oda bulunamadı veya sana ait değil.'; end if;
 if not r.career_match then raise exception 'Bu oda oyuncu seçimini desteklemiyor.'; end if;
 if char_length(p_value)>512 then raise exception 'Geçersiz oyuncu seçimi.'; end if;
 submitted:=p_value::jsonb; selected_id:=submitted->>'playerId';
 if selected_id is null or not exists(select 1 from public.game_players where id=selected_id) then raise exception 'Listeden bir oyuncu seç.'; end if;
 -- Only the identity is trusted, never a client-provided name, alias or score.
 answer_text:=case when selected_id=r.career_data->>'id' then r.solution else '__incorrect_player_selection__' end;
 return public.game_room_before_pick('career_answer',r.code,jsonb_build_object('round',submitted->'round','answer',answer_text)::text);
end $$;
revoke all on function public.game_room(text,text,text) from public,anon;
grant execute on function public.game_room(text,text,text) to authenticated;
notify pgrst,'reload schema';
commit;
