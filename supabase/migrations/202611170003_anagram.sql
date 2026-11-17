begin;
alter table public.game_rooms add column game_kind text not null default 'clubs' check(game_kind in ('clubs','anagram')),
 add column difficulty text check(difficulty in ('easy','medium','hard')),
 add column host_ready boolean not null default false, add column guest_ready boolean not null default false,
 add column puzzle text, add column solution text, add column ends_at timestamptz,
 add column rematch_code text references public.game_rooms(code);
create table public.game_anagrams(word text primary key, player_name text not null, difficulty text not null check(difficulty in ('easy','medium','hard')));
alter table public.game_anagrams enable row level security;
revoke all on public.game_anagrams from public,anon,authenticated;
insert into public.game_anagrams values
 ('MESSI','Lionel Messi','easy'),('NANI','Nani','easy'),('HAGI','Gheorghe Hagi','easy'),('FIGO','Luís Figo','easy'),('ETO O','Samuel Eto''o','easy'),('VIDAL','Arturo Vidal','easy'),
 ('DROGBA','Didier Drogba','medium'),('ANELKA','Nicolas Anelka','medium'),('BECKHAM','David Beckham','medium'),('RONALDO','Cristiano Ronaldo','medium'),('MORATA','Álvaro Morata','medium'),('CRESPO','Hernán Crespo','medium'),('VIEIRA','Patrick Vieira','medium'),('RIBERY','Franck Ribéry','medium'),
 ('IBRAHIMOVIC','Zlatan Ibrahimović','hard'),('LEWANDOWSKI','Robert Lewandowski','hard'),('AUBAMEYANG','Pierre-Emerick Aubameyang','hard'),('SNEIJDER','Wesley Sneijder','hard'),('QUARESMA','Ricardo Quaresma','hard'),('SEEDORF','Clarence Seedorf','hard');

create function public.game_answer_key(value text) returns text language sql immutable set search_path='' as $$
 select regexp_replace(lower(translate(coalesce(value,''),'İıŞşĞğÜüÖöÇçÁáÀàÂâÃãÄäÅåÉéÈèÊêËëÍíÌìÎîÏïÓóÒòÔôÕõÚúÙùÛûÑñĆćČčŠšŽž','IiSsGgUuOoCcAaAaAaAaAaAaEeEeEeEeIiIiIiIiOoOoOoOoUuUuUuNnCcCcSsZz')),'[^a-z0-9]','','g');
$$;
alter function public.game_room(text,text,text) rename to game_club_room;
revoke all on function public.game_club_room(text,text,text) from public,anon,authenticated;

create function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); r public.game_rooms%rowtype; c text:=upper(trim(p_code)); selected public.game_anagrams%rowtype;
 is_host boolean; visible boolean; duration integer; letters text; mixed text; opponent_name text; payload jsonb; now_at timestamptz;
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 if p_action='create_anagram' then
   if p_value not in ('easy','medium','hard') or p_value is null then raise exception 'Bir zorluk seç.'; end if;
   perform pg_advisory_xact_lock(hashtextextended(u::text,0));
   if (select count(*) from public.game_rooms where host_id=u and status in ('waiting','playing') and created_at>now()-interval '24 hours')>=5 then raise exception 'Açık odalarından birini tamamla veya kapat.'; end if;
   loop
     c:=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
     begin insert into public.game_rooms(code,host_id,game_kind,difficulty) values(c,u,'anagram',p_value) returning * into r; exit;
     exception when unique_violation then null; end;
   end loop;
 elsif p_action='create' then
   return public.game_club_room(p_action,p_code,p_value)||jsonb_build_object('gameKind','clubs');
 else
   select * into r from public.game_rooms where code=c for update;
   if not found then raise exception 'Oda bulunamadı. Kodu kontrol et.'; end if;
   if r.game_kind='clubs' then return public.game_club_room(p_action,p_code,p_value)||jsonb_build_object('gameKind','clubs'); end if;
   if p_action='join' and r.host_id<>u and r.guest_id is null and r.status='waiting' and r.created_at>now()-interval '24 hours' then
     update public.game_rooms set guest_id=u where code=c returning * into r;
   end if;
   if u is distinct from r.host_id and u is distinct from r.guest_id then raise exception 'Bu oda dolu veya sana ait değil.'; end if;
 end if;
 if p_action='rematch' then
   if r.status not in ('finished','void') then raise exception 'Önce bu turu tamamla.'; end if;
   if r.guest_id is null then raise exception 'Yeni tur için lobiye dön.'; end if;
   if r.rematch_code is null then
     payload:=public.game_room('create_anagram','',r.difficulty);
     update public.game_rooms set guest_id=case when u=r.host_id then r.guest_id else r.host_id end where code=payload->>'code';
     update public.game_rooms set rematch_code=payload->>'code' where code=c returning * into r;
   end if;
   return public.game_room('state',r.rematch_code,'');
 end if;
 is_host:=u=r.host_id;
 if r.status in ('waiting','playing') and r.created_at<=now()-interval '24 hours' then
   update public.game_rooms set status='void',reason='Odanın süresi doldu.',finished_at=clock_timestamp() where code=c returning * into r;
 end if;
 if p_action='ready' and r.status='waiting' then
   update public.game_rooms set host_ready=host_ready or is_host,guest_ready=guest_ready or not is_host where code=c returning * into r;
   if r.host_ready and r.guest_ready and r.guest_id is not null then
     select * into selected from public.game_anagrams where difficulty=r.difficulty order by random() limit 1;
     if not found then raise exception 'Bu zorluk için henüz soru yok.'; end if;
     letters:=upper(public.game_answer_key(selected.word));
     select string_agg(letter,'' order by random()) into mixed from regexp_split_to_table(letters,'') letter;
     if mixed=letters then mixed:=substr(letters,2)||left(letters,1); end if;
     duration:=case r.difficulty when 'easy' then 5 when 'medium' then 10 else 20 end;
     now_at:=clock_timestamp();
     update public.game_rooms set solution=selected.word,puzzle=mixed,starts_at=now_at+interval '3 seconds',ends_at=now_at+make_interval(secs=>3+duration),status='playing' where code=c returning * into r;
   end if;
 end if;
 now_at:=clock_timestamp(); visible:=r.starts_at is not null and now_at>=r.starts_at;
 if r.status='playing' and now_at>=r.ends_at then
   update public.game_rooms set status='void',answer=r.solution,reason='Süre doldu. Kimse puan kazanmadı.',finished_at=now_at where code=c returning * into r;
 end if;
 if p_action='answer' and r.status='playing' then
   if not visible then raise exception 'Geri sayımın bitmesini bekle.'; end if;
   if char_length(p_value)>80 then raise exception 'Cevap çok uzun.'; end if;
   if coalesce(case when is_host then r.host_attempt else r.guest_attempt end,'epoch')>now_at-interval '500 milliseconds' then raise exception 'Yeni cevap için kısa bir süre bekle.'; end if;
   update public.game_rooms set host_attempt=case when is_host then now_at else host_attempt end,guest_attempt=case when not is_host then now_at else guest_attempt end where code=c;
   if public.game_answer_key(p_value)=public.game_answer_key(r.solution) then
     update public.game_rooms set status='finished',winner_id=u,answer=r.solution,reason='Anagram · İlk doğru cevap',finished_at=now_at where code=c returning * into r;
   else
     payload:=jsonb_build_object('incorrect',true);
   end if;
 end if;
 if p_action='leave' and r.status in ('waiting','playing') then
   if visible then
     update public.game_rooms set status='finished',winner_id=case when is_host then r.guest_id else r.host_id end,answer=r.solution,reason='Anagram · Rakip pes etti',finished_at=now_at where code=c returning * into r;
   else
     update public.game_rooms set status='void',reason='Oyun başlamadan oda kapatıldı. Puan değişmedi.',finished_at=now_at where code=c returning * into r;
   end if;
 end if;
 select username into opponent_name from public.game_profiles where id=case when is_host then r.guest_id else r.host_id end;
 return coalesce(payload,'{}'::jsonb)||jsonb_build_object('code',c,'gameKind','anagram','difficulty',r.difficulty,'status',r.status,'host',is_host,'opponent',opponent_name,
   'ready',case when is_host then r.host_ready else r.guest_ready end,'opponentReady',case when is_host then r.guest_ready else r.host_ready end,
   'team',null,'opponentTeam',null,'remaining',case when r.starts_at is null then null else greatest(0,ceil(extract(epoch from r.starts_at-now_at)))::int end,
   'serverMs',extract(epoch from now_at)*1000,'startsAt',extract(epoch from r.starts_at)*1000,'endsAt',extract(epoch from r.ends_at)*1000,
   'puzzle',case when visible then r.puzzle else null end,'won',r.winner_id=u,'answer',r.answer,'reason',r.reason);
end $$;
revoke all on function public.game_room(text,text,text),public.game_answer_key(text) from public,anon;
grant execute on function public.game_room(text,text,text) to authenticated;
alter function public.game_dashboard() rename to game_dashboard_base;
revoke all on function public.game_dashboard_base() from public,anon,authenticated;
create function public.game_dashboard() returns jsonb language sql security definer set search_path='' as $$
 select public.game_dashboard_base()||jsonb_build_object('byGame',coalesce((
   select jsonb_agg(t) from (
     select game_kind as kind,count(*) filter(where winner_id=auth.uid())::int as wins,
       count(*) filter(where winner_id<>auth.uid())::int as losses
     from public.game_rooms where status='finished' and auth.uid() in(host_id,guest_id) group by game_kind
   ) t),'[]'::jsonb)) where auth.uid() is not null;
$$;
revoke all on function public.game_dashboard() from public,anon;
grant execute on function public.game_dashboard() to authenticated;
notify pgrst,'reload schema';
commit;
