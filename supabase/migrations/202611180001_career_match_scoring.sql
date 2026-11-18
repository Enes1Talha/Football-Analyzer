begin;
alter table public.game_rooms
 add column career_match boolean not null default false,
 add column host_score integer not null default 0,
 add column guest_score integer not null default 0,
 add column career_round integer not null default 0,
 add column round_done boolean not null default false,
 add column career_rounds jsonb not null default '[]';

create function public.career_points(total integer, revealed integer) returns integer
language sql immutable set search_path='' as $$
 select greatest(20,least(100,100-round(80.0*greatest(0,revealed-2)/greatest(1,total-2))::integer))
$$;
revoke all on function public.career_points(integer,integer) from public,anon,authenticated;

alter function public.game_room(text,text,text) rename to game_room_before_match;
revoke all on function public.game_room_before_match(text,text,text) from public,anon,authenticated;

create function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 u uuid:=auth.uid(); c text:=upper(trim(p_code)); r public.game_rooms%rowtype;
 t public.game_careers%rowtype; payload jsonb; now_at timestamptz; is_host boolean;
 visible boolean; reveal_all boolean; clues integer; total integer; points integer;
 opponent_name text; winner uuid; response_incorrect boolean:=false; submitted jsonb;
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 if p_action='create_career_match' then
   payload:=public.game_room_before_match('create_career',p_code,p_value); c:=payload->>'code';
   update public.game_rooms set career_match=true where code=c returning * into r;
 else
   select * into r from public.game_rooms where code=c for update;
   if not found or not r.career_match then return public.game_room_before_match(p_action,p_code,p_value); end if;
   if p_action='join' and r.host_id<>u and r.guest_id is null and r.status='waiting' and r.created_at>now()-interval '24 hours' then
     update public.game_rooms set guest_id=u where code=c returning * into r;
   end if;
   if u is distinct from r.host_id and u is distinct from r.guest_id then raise exception 'Bu oda dolu veya sana ait değil.'; end if;
 end if;
 is_host:=u=r.host_id; now_at:=clock_timestamp();
 if p_action='rematch' then
   if r.status not in ('finished','void') or r.guest_id is null then raise exception 'Önce maçı tamamla.'; end if;
   if r.rematch_code is null then
     payload:=public.game_room('create_career_match','','');
     update public.game_rooms set guest_id=case when is_host then r.guest_id else r.host_id end where code=payload->>'code';
     update public.game_rooms set rematch_code=payload->>'code' where code=c returning * into r;
   end if;
   return public.game_room('state',r.rematch_code,'');
 end if;
 if r.status in ('waiting','playing') and r.created_at<=now_at-interval '24 hours' then
   update public.game_rooms set status='void',reason='Odanın süresi doldu. Maç puansız kapandı.',finished_at=now_at where code=c returning * into r;
 end if;
 -- A timeout ends a round, never awards a win or erases the match score.
 if r.status='playing' and not r.round_done and now_at>=r.ends_at then
   update public.game_rooms set round_done=true,answer=r.solution,reason='Süre doldu. Bu tur 0 puan.',host_ready=false,guest_ready=false,
     career_rounds=career_rounds||jsonb_build_array(jsonb_build_object('round',career_round,'id',career_data->>'id','winner',null,'points',0,'answer',solution))
     where code=c returning * into r;
 end if;
 if p_action='career_ready' and (r.status='waiting' or (r.status='playing' and r.round_done)) then
   if p_value<>r.career_round::text then raise exception 'Tur değişti. Ekranın yenilenmesini bekle.'; end if;
   update public.game_rooms set host_ready=host_ready or is_host,guest_ready=guest_ready or not is_host where code=c returning * into r;
   if r.host_ready and r.guest_ready and r.guest_id is not null then
     select * into t from public.game_careers
       where id not in (select item->>'id' from jsonb_array_elements(r.career_rounds) item)
       order by random() limit 1;
     if not found then
       select * into t from public.game_careers where id is distinct from r.career_data->>'id' order by random() limit 1;
     end if;
     if not found then raise exception 'Henüz yeterli kariyer sorusu yok.'; end if;
     now_at:=clock_timestamp();
     update public.game_rooms set career_data=t.data,solution=t.data->>'playerName',answer=null,reason=null,
       career_round=career_round+1,round_done=false,host_ready=false,guest_ready=false,
       host_attempt=null,guest_attempt=null,status='playing',starts_at=now_at+interval '3 seconds',
       ends_at=now_at+make_interval(secs=>3+(jsonb_array_length(t.data->'stages')-2)*8+20)
       where code=c returning * into r;
   end if;
 end if;
 now_at:=clock_timestamp(); visible:=r.starts_at is not null and now_at>=r.starts_at;
 total:=coalesce(jsonb_array_length(r.career_data->'stages'),0);
 clues:=least(total,2+floor(greatest(0,extract(epoch from now_at-r.starts_at))/8)::integer);
 points:=public.career_points(total,clues);
 if p_action='career_answer' and r.status='playing' and not r.round_done then
   if not visible then raise exception 'Geri sayımın bitmesini bekle.'; end if;
   submitted:=p_value::jsonb;
   if submitted->>'round' is distinct from r.career_round::text then raise exception 'Bu cevap önceki tura ait.'; end if;
   if coalesce(char_length(submitted->>'answer'),0) not between 1 and 80 then raise exception 'Geçerli bir cevap yaz.'; end if;
   if coalesce(case when is_host then r.host_attempt else r.guest_attempt end,'epoch')>now_at-interval '500 milliseconds' then raise exception 'Yeni cevap için kısa bir süre bekle.'; end if;
   update public.game_rooms set host_attempt=case when is_host then now_at else host_attempt end,
     guest_attempt=case when not is_host then now_at else guest_attempt end where code=c;
   if public.game_answer_key(submitted->>'answer')=public.game_answer_key(r.solution) or exists
     (select 1 from jsonb_array_elements_text(r.career_data->'aliases') a where public.game_answer_key(a)=public.game_answer_key(submitted->>'answer')) then
     update public.game_rooms set host_score=host_score+case when is_host then points else 0 end,
       guest_score=guest_score+case when not is_host then points else 0 end,round_done=true,answer=solution,
       host_ready=false,guest_ready=false,reason='Kariyer · Tur tamamlandı',
       career_rounds=career_rounds||jsonb_build_array(jsonb_build_object('round',career_round,'id',career_data->>'id','winner',u,'points',points,'answer',solution))
       where code=c returning * into r;
     if greatest(r.host_score,r.guest_score)>=300 then
       update public.game_rooms set status='finished',winner_id=u,finished_at=now_at,reason='Kariyer · 300 puana ulaştı' where code=c returning * into r;
     end if;
   else response_incorrect:=true; end if;
 end if;
 if p_action='leave' and r.status in ('waiting','playing') then
   if r.career_round>1 or (r.career_round=1 and visible) then
     winner:=case when is_host then r.guest_id else r.host_id end;
     update public.game_rooms set status='finished',winner_id=winner,answer=solution,reason='Kariyer · Rakip maçı bıraktı',finished_at=now_at where code=c returning * into r;
   else
     update public.game_rooms set status='void',reason='Maç başlamadan oda kapatıldı.',finished_at=now_at where code=c returning * into r;
   end if;
 end if;
 reveal_all:=r.round_done or r.status in ('finished','void');
 select username into opponent_name from public.game_profiles where id=case when is_host then r.guest_id else r.host_id end;
 return jsonb_build_object('code',c,'gameKind','career','careerMatch',true,'status',r.status,'host',is_host,'opponent',opponent_name,
   'ready',case when is_host then r.host_ready else r.guest_ready end,'opponentReady',case when is_host then r.guest_ready else r.host_ready end,
   'round',r.career_round,'roundDone',r.round_done,'myScore',case when is_host then r.host_score else r.guest_score end,
   'opponentScore',case when is_host then r.guest_score else r.host_score end,'targetScore',300,
   'roundPoints',case when visible and not reveal_all then points else null end,
   'lastRoundPoints',case when reveal_all then r.career_rounds->-1->'points' else null end,
   'roundWon',case when reveal_all then (r.career_rounds->-1->>'winner')=u::text else null end,
   'serverMs',extract(epoch from now_at)*1000,'startsAt',extract(epoch from r.starts_at)*1000,'endsAt',extract(epoch from r.ends_at)*1000,
   'career',case when visible or reveal_all then (select coalesce(jsonb_agg(stage order by ordinal),'[]'::jsonb)
      from jsonb_array_elements(r.career_data->'stages') with ordinality s(stage,ordinal) where reveal_all or ordinal<=clues) else '[]'::jsonb end,
   'totalClues',case when visible or reveal_all then total else 0 end,
   'careerSource',case when reveal_all then r.career_data->>'source' else null end,
   'nextClueAt',case when visible and not reveal_all and clues<total then extract(epoch from r.starts_at)*1000+(clues-1)*8000 else null end,
   'answer',case when reveal_all then r.answer else null end,'reason',r.reason,'won',r.winner_id=u,'incorrect',response_incorrect);
end $$;
revoke all on function public.game_room(text,text,text) from public,anon;
grant execute on function public.game_room(text,text,text) to authenticated;

-- Keep the existing dashboard and add per-game friend records.
alter function public.game_dashboard() rename to game_dashboard_before_rivals;
revoke all on function public.game_dashboard_before_rivals() from public,anon,authenticated;
create function public.game_dashboard() returns jsonb language plpgsql security definer set search_path='' as $$
declare base jsonb; breakdown jsonb; u uuid:=auth.uid();
begin
 base:=public.game_dashboard_before_rivals();
 select coalesce(jsonb_agg(to_jsonb(s)),'[]'::jsonb) into breakdown from (
   select p.id as opponent_id,p.username as opponent,r.game_kind as kind,
     count(*) filter(where r.winner_id=u)::integer as wins,
     count(*) filter(where r.winner_id<>u)::integer as losses
   from public.game_rooms r join public.game_profiles p on p.id=case when r.host_id=u then r.guest_id else r.host_id end
   where r.status='finished' and r.winner_id is not null and u in(r.host_id,r.guest_id)
   group by p.id,p.username,r.game_kind order by p.username,r.game_kind
 ) s;
 return base||jsonb_build_object('rivalsByGame',breakdown);
end $$;
revoke all on function public.game_dashboard() from public,anon;
grant execute on function public.game_dashboard() to authenticated;
notify pgrst,'reload schema';
commit;
