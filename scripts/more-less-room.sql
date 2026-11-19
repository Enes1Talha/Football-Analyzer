begin;
create table public.game_more_less_questions(id text primary key,data jsonb not null);
alter table public.game_more_less_questions enable row level security;
revoke all on public.game_more_less_questions from public,anon,authenticated;
-- QUESTION_SEED
alter table public.game_rooms drop constraint game_rooms_game_kind_check;
alter table public.game_rooms add constraint game_rooms_game_kind_check check(game_kind in ('clubs','anagram','career','more_less'));
alter table public.game_rooms add column comparison_data jsonb, add column host_choice text, add column guest_choice text;
alter function public.game_room(text,text,text) rename to game_room_before_more_less;
revoke all on function public.game_room_before_more_less(text,text,text) from public,anon,authenticated;
create function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); r public.game_rooms%rowtype; c text:=upper(trim(p_code));
 h boolean; t timestamptz; q jsonb; out_q jsonb; result jsonb; opponent_name text; done boolean; hc boolean; gc boolean;
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 if p_action='create_more_less' then
  perform pg_advisory_xact_lock(hashtextextended(u::text,0));
  if (select count(*) from public.game_rooms where host_id=u and status in ('waiting','playing') and created_at>now()-interval '24 hours')>=5 then raise exception 'Önce açık odalarından birini kapat.'; end if;
  loop
   c:=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
   begin insert into public.game_rooms(code,host_id,game_kind) values(c,u,'more_less') returning * into r;exit;
   exception when unique_violation then null;end;
  end loop;
 else
  select * into r from public.game_rooms where code=c for update;
  if not found or r.game_kind<>'more_less' then return public.game_room_before_more_less(p_action,p_code,p_value);end if;
  if p_action='join' and r.guest_id is null and r.host_id<>u and r.status='waiting' and r.created_at>now()-interval '24 hours' then
   update public.game_rooms set guest_id=u where code=c returning * into r;
  end if;
  if u is distinct from r.host_id and u is distinct from r.guest_id then raise exception 'Bu oda sana ait değil.';end if;
 end if;
 h:=u=r.host_id;t:=clock_timestamp();
 if r.status in ('waiting','playing') and r.created_at<=t-interval '24 hours' then
  update public.game_rooms set status='void',reason='Odanın süresi doldu.',finished_at=t where code=c returning * into r;
 end if;
 if p_action='rematch' then
  if r.status not in ('finished','void') or r.guest_id is null then raise exception 'Önce maçı tamamla.';end if;
  if r.rematch_code is null then
   result:=public.game_room('create_more_less','','');
   update public.game_rooms set guest_id=case when h then r.guest_id else r.host_id end where code=result->>'code';
   update public.game_rooms set rematch_code=result->>'code' where code=c returning * into r;
  end if;
  return public.game_room('state',r.rematch_code,'');
 end if;
 if p_action='ready' and r.status='waiting' then
  update public.game_rooms set host_ready=host_ready or h,guest_ready=guest_ready or not h where code=c returning * into r;
  if r.host_ready and r.guest_ready and r.guest_id is not null then
   select data into q from public.game_more_less_questions
   where id is distinct from (select comparison_data->>'id' from public.game_rooms where rematch_code=c limit 1)
   order by random() limit 1;
   if q is null then raise exception 'Henüz soru yok.';end if;
   update public.game_rooms set comparison_data=q,status='playing',starts_at=t+interval '3 seconds',ends_at=t+interval '23 seconds' where code=c returning * into r;
  end if;
 end if;
 if p_action='more_less_answer' and r.status='playing' and t<r.ends_at then
  if t<r.starts_at then raise exception 'Geri sayımı bekle.';end if;
  if p_value is null or p_value not in ('A','B','equal') then raise exception 'İki oyuncudan birini veya Eşit seç.';end if;
  update public.game_rooms set host_choice=case when h then coalesce(host_choice,p_value) else host_choice end,
   guest_choice=case when not h then coalesce(guest_choice,p_value) else guest_choice end where code=c returning * into r;
 end if;
 if r.status='playing' and (t>=r.ends_at or (r.host_choice is not null and r.guest_choice is not null)) then
  hc:=coalesce(r.host_choice=r.comparison_data->>'correctAnswer',false);gc:=coalesce(r.guest_choice=r.comparison_data->>'correctAnswer',false);
  update public.game_rooms set status=case when hc<>gc then 'finished' else 'void' end,
   winner_id=case when hc and not gc then host_id when gc and not hc then guest_id else null end,
   answer=(r.comparison_data->>'playerA')||': '||(r.comparison_data->>'valueA')||' · '||(r.comparison_data->>'playerB')||': '||(r.comparison_data->>'valueB'),
   reason=case when hc<>gc then 'Hangisi Daha Fazla · Tek doğru seçim kazandı.' else 'Berabere. Galibiyet ve mağlubiyet değişmedi.' end,
   finished_at=t where code=c returning * into r;
 end if;
 if p_action='leave' and r.status in ('waiting','playing') then
  update public.game_rooms set status=case when r.starts_at is not null and t>=r.starts_at then 'finished' else 'void' end,
   winner_id=case when r.starts_at is not null and t>=r.starts_at then case when h then guest_id else host_id end else null end,
   reason='Hangisi Daha Fazla · Oyuncu odadan ayrıldı.',finished_at=t where code=c returning * into r;
 end if;
 done:=r.status in ('finished','void');
 if done then out_q:=r.comparison_data;
 elsif t>=r.starts_at then out_q:=r.comparison_data-'valueA'-'valueB'-'correctAnswer'-'source';end if;
 select username into opponent_name from public.game_profiles where id=case when h then r.guest_id else r.host_id end;
 return jsonb_build_object('code',c,'gameKind','more_less','status',r.status,'host',h,'opponent',opponent_name,
  'ready',case when h then r.host_ready else r.guest_ready end,'opponentReady',case when h then r.guest_ready else r.host_ready end,
  'question',out_q,'myChoice',case when h then r.host_choice else r.guest_choice end,
  'opponentAnswered',case when h then r.guest_choice is not null else r.host_choice is not null end,
  'opponentChoice',case when done then case when h then r.guest_choice else r.host_choice end end,
  'won',case when r.winner_id is not null then r.winner_id=u end,'answer',r.answer,'reason',r.reason,
  'serverMs',extract(epoch from t)*1000,'startsAt',extract(epoch from r.starts_at)*1000,'endsAt',extract(epoch from r.ends_at)*1000);
end $$;
revoke all on function public.game_room(text,text,text) from public,anon;
grant execute on function public.game_room(text,text,text) to authenticated;
alter function public.game_dashboard() rename to game_dashboard_before_more_less;
revoke all on function public.game_dashboard_before_more_less() from public,anon,authenticated;
create function public.game_dashboard() returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; history_rows jsonb; u uuid:=auth.uid();
begin
 if u is null then raise exception 'Önce giriş yap.';end if;
 result:=public.game_dashboard_before_more_less();
 select coalesce(jsonb_agg(to_jsonb(x) order by x.finished_at desc,x.code),'[]'::jsonb) into history_rows from (
  select r.code,p.username as opponent,r.winner_id=u as won,r.finished_at,r.host_team,r.guest_team,r.answer,r.reason,r.game_kind as kind
  from public.game_rooms r join public.game_profiles p on p.id=case when r.host_id=u then r.guest_id else r.host_id end
  where u in(r.host_id,r.guest_id) and (r.status='finished' or (r.status='void' and r.game_kind='more_less' and r.comparison_data is not null))
  order by r.finished_at desc,r.code limit 20
 ) x;
 return result||jsonb_build_object('history',history_rows);
end $$;
revoke all on function public.game_dashboard() from public,anon;
grant execute on function public.game_dashboard() to authenticated;
-- GROUP_FUNCTION
notify pgrst,'reload schema';
commit;
