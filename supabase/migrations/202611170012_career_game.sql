begin;
alter table public.game_rooms drop constraint game_rooms_game_kind_check;
alter table public.game_rooms add constraint game_rooms_game_kind_check check(game_kind in ('clubs','anagram','career'));
alter table public.game_rooms add column career_data jsonb;
create table public.game_careers(id text primary key, data jsonb not null check(jsonb_array_length(data->'stages')>=3));
alter table public.game_careers enable row level security;
revoke all on public.game_careers from public,anon,authenticated;
insert into public.game_careers(id,data) values
 ('sneijder','{"id":"sneijder","playerName":"Wesley Sneijder","aliases":["Wesley Sneijder","Sneijder"],"stages":[{"club":"Ajax","startYear":2002,"endYear":2007,"loan":false},{"club":"Real Madrid","startYear":2007,"endYear":2009,"loan":false},{"club":"Inter","startYear":2009,"endYear":2013,"loan":false},{"club":"Galatasaray","startYear":2013,"endYear":2017,"loan":false},{"club":"Nice","startYear":2017,"endYear":2018,"loan":false},{"club":"Al-Gharafa","startYear":2018,"endYear":2019,"loan":false}],"source":"https://en.wikipedia.org/wiki/Wesley_Sneijder","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('drogba','{"id":"drogba","playerName":"Didier Drogba","aliases":["Didier Drogba","Drogba"],"stages":[{"club":"Le Mans","startYear":1998,"endYear":2002,"loan":false},{"club":"Guingamp","startYear":2002,"endYear":2003,"loan":false},{"club":"Marseille","startYear":2003,"endYear":2004,"loan":false},{"club":"Chelsea","startYear":2004,"endYear":2012,"loan":false},{"club":"Shanghai Shenhua","startYear":2012,"endYear":2013,"loan":false},{"club":"Galatasaray","startYear":2013,"endYear":2014,"loan":false},{"club":"Chelsea","startYear":2014,"endYear":2015,"loan":false},{"club":"Montreal Impact","startYear":2015,"endYear":2016,"loan":false},{"club":"Phoenix Rising","startYear":2017,"endYear":2018,"loan":false}],"source":"https://en.wikipedia.org/wiki/Didier_Drogba","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q83488','{"id":"wd-Q83488","playerName":"Mesut Özil","aliases":["Mesut Özil","Özil"],"stages":[{"club":"Schalke 04","startYear":2006,"endYear":2008,"loan":false},{"club":"Werder Bremen","startYear":2008,"endYear":2010,"loan":false},{"club":"Real Madrid","startYear":2010,"endYear":2013,"loan":false},{"club":"Arsenal","startYear":2013,"endYear":2021,"loan":false},{"club":"Fenerbahçe","startYear":2021,"endYear":2022,"loan":false},{"club":"İstanbul Başakşehir","startYear":2022,"endYear":2023,"loan":false}],"source":"https://en.wikipedia.org/wiki/Mesut_%C3%96zil","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('van-persie','{"id":"van-persie","playerName":"Robin van Persie","aliases":["Robin van Persie","Persie"],"stages":[{"club":"Feyenoord","startYear":2001,"endYear":2004,"loan":false},{"club":"Arsenal","startYear":2004,"endYear":2012,"loan":false},{"club":"Manchester United","startYear":2012,"endYear":2015,"loan":false},{"club":"Fenerbahçe","startYear":2015,"endYear":2018,"loan":false},{"club":"Feyenoord","startYear":2018,"endYear":2019,"loan":false}],"source":"https://en.wikipedia.org/wiki/Robin_van_Persie","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q1939','{"id":"wd-Q1939","playerName":"Nicolas Anelka","aliases":["Nicolas Anelka","Nicolas Sébastien Anelka","Nicolas Sebastien Anelka","Anelka"],"stages":[{"club":"Paris Saint-Germain","startYear":1996,"endYear":1997,"loan":false},{"club":"Arsenal","startYear":1997,"endYear":1999,"loan":false},{"club":"Real Madrid","startYear":1999,"endYear":2000,"loan":false},{"club":"Paris Saint-Germain","startYear":2000,"endYear":2002,"loan":false},{"club":"Liverpool","startYear":2001,"endYear":2002,"loan":true},{"club":"Manchester City","startYear":2002,"endYear":2005,"loan":false},{"club":"Fenerbahçe","startYear":2005,"endYear":2006,"loan":false},{"club":"Bolton Wanderers","startYear":2006,"endYear":2008,"loan":false},{"club":"Chelsea","startYear":2008,"endYear":2012,"loan":false},{"club":"Shanghai Shenhua","startYear":2012,"endYear":2013,"loan":false},{"club":"Juventus","startYear":2013,"endYear":2013,"loan":true},{"club":"West Bromwich Albion","startYear":2013,"endYear":2014,"loan":false},{"club":"Mumbai City","startYear":2014,"endYear":2015,"loan":false}],"source":"https://en.wikipedia.org/wiki/Nicolas_Anelka","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('emre','{"id":"emre","playerName":"Emre Belözoğlu","aliases":["Emre Belözoğlu","Emre","Belözoğlu"],"stages":[{"club":"Galatasaray","startYear":1996,"endYear":2001,"loan":false},{"club":"Inter","startYear":2001,"endYear":2005,"loan":false},{"club":"Newcastle United","startYear":2005,"endYear":2008,"loan":false},{"club":"Fenerbahçe","startYear":2008,"endYear":2012,"loan":false},{"club":"Atlético Madrid","startYear":2012,"endYear":2013,"loan":false},{"club":"Fenerbahçe","startYear":2013,"endYear":2015,"loan":false},{"club":"İstanbul Başakşehir","startYear":2015,"endYear":2019,"loan":false},{"club":"Fenerbahçe","startYear":2019,"endYear":2020,"loan":false}],"source":"https://en.wikipedia.org/wiki/Emre_Bel%C3%B6zo%C4%9Flu","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q189892','{"id":"wd-Q189892","playerName":"Gheorghe Hagi","aliases":["Gheorghe Hagi","Aleluia","Gică","Hagi","George Hagi"],"stages":[{"club":"FC Constanța","startYear":1982,"endYear":1983,"loan":false},{"club":"Sportul Studențesc","startYear":1983,"endYear":1986,"loan":false},{"club":"Steaua București","startYear":1986,"endYear":1990,"loan":false},{"club":"Real Madrid","startYear":1990,"endYear":1992,"loan":false},{"club":"Brescia","startYear":1992,"endYear":1994,"loan":false},{"club":"Barcelona","startYear":1994,"endYear":1996,"loan":false},{"club":"Galatasaray","startYear":1996,"endYear":2001,"loan":false}],"source":"https://en.wikipedia.org/wiki/Gheorghe_Hagi","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q192974','{"id":"wd-Q192974","playerName":"Hakan Şükür","aliases":["Hakan Şükür","Şükür"],"stages":[{"club":"Sakaryaspor","startYear":1987,"endYear":1990,"loan":false},{"club":"Bursaspor","startYear":1990,"endYear":1992,"loan":false},{"club":"Galatasaray","startYear":1992,"endYear":1995,"loan":false},{"club":"Torino","startYear":1995,"endYear":1995,"loan":false},{"club":"Galatasaray","startYear":1995,"endYear":2000,"loan":false},{"club":"Inter","startYear":2000,"endYear":2002,"loan":false},{"club":"Parma","startYear":2002,"endYear":2002,"loan":false},{"club":"Blackburn Rovers","startYear":2002,"endYear":2003,"loan":false},{"club":"Galatasaray","startYear":2003,"endYear":2008,"loan":false}],"source":"https://en.wikipedia.org/wiki/Hakan_%C5%9E%C3%BCk%C3%BCr","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q203665','{"id":"wd-Q203665","playerName":"Simão Sabrosa","aliases":["Simão Sabrosa","Simao Sabrosa","Sabrosa","Simão"],"stages":[{"club":"Sporting CP","startYear":1997,"endYear":1999,"loan":false},{"club":"Barcelona","startYear":1999,"endYear":2001,"loan":false},{"club":"Benfica","startYear":2001,"endYear":2007,"loan":false},{"club":"Atlético Madrid","startYear":2007,"endYear":2010,"loan":false},{"club":"Beşiktaş","startYear":2011,"endYear":2012,"loan":false},{"club":"Espanyol","startYear":2012,"endYear":2014,"loan":false},{"club":"NorthEast United","startYear":2015,"endYear":2015,"loan":false}],"source":"https://en.wikipedia.org/wiki/Sim%C3%A3o_Sabrosa","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb),
 ('wd-Q175296','{"id":"wd-Q175296","playerName":"Raul Meireles","aliases":["Raul Meireles","Raul José Trindade Meireles","Meireles"],"stages":[{"club":"Aves","startYear":2001,"endYear":2003,"loan":true},{"club":"Boavista","startYear":2003,"endYear":2004,"loan":false},{"club":"Porto","startYear":2004,"endYear":2010,"loan":false},{"club":"Liverpool","startYear":2010,"endYear":2011,"loan":false},{"club":"Chelsea","startYear":2011,"endYear":2012,"loan":false},{"club":"Fenerbahçe","startYear":2012,"endYear":2016,"loan":false}],"source":"https://en.wikipedia.org/wiki/Raul_Meireles","sourceType":"secondary","note":"Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir."}'::jsonb);
create or replace function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); r public.game_rooms%rowtype; c text:=upper(trim(p_code)); selected public.game_anagrams%rowtype; career_selected public.game_careers%rowtype; clue_count integer;
 is_host boolean; visible boolean; duration integer; letters text; mixed text; opponent_name text; payload jsonb; now_at timestamptz;
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 if p_action in ('create_anagram','create_career') then
   if p_action='create_career' then p_value:='medium'; end if;
   if p_value not in ('easy','medium','hard') or p_value is null then raise exception 'Bir zorluk seç.'; end if;
   perform pg_advisory_xact_lock(hashtextextended(u::text,0));
   if (select count(*) from public.game_rooms where host_id=u and status in ('waiting','playing') and created_at>now()-interval '24 hours')>=5 then raise exception 'Açık odalarından birini tamamla veya kapat.'; end if;
   loop
     c:=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
     begin insert into public.game_rooms(code,host_id,game_kind,difficulty) values(c,u,case when p_action='create_career' then 'career' else 'anagram' end,p_value) returning * into r; exit;
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
     payload:=public.game_room(case when r.game_kind='career' then 'create_career' else 'create_anagram' end,'',r.difficulty);
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
     if r.game_kind='career' then
       select * into career_selected from public.game_careers order by random() limit 1;
       if not found then raise exception 'Henüz kariyer sorusu yok.'; end if;
       now_at:=clock_timestamp();
       duration:=(jsonb_array_length(career_selected.data->'stages')-2)*8+20;
       update public.game_rooms set solution=career_selected.data->>'playerName',career_data=career_selected.data,
         starts_at=now_at+interval '3 seconds',ends_at=now_at+make_interval(secs=>3+duration),status='playing' where code=c returning * into r;
     else
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
   if public.game_answer_key(p_value)=public.game_answer_key(r.solution) or
      (r.game_kind='career' and exists(select 1 from jsonb_array_elements_text(r.career_data->'aliases') a where public.game_answer_key(a)=public.game_answer_key(p_value))) then
     update public.game_rooms set status='finished',winner_id=u,answer=r.solution,reason=case when r.game_kind='career' then 'Kariyer · İlk doğru cevap' else 'Anagram · İlk doğru cevap' end,finished_at=now_at where code=c returning * into r;
   else
     payload:=jsonb_build_object('incorrect',true);
   end if;
 end if;
 if p_action='leave' and r.status in ('waiting','playing') then
   if visible then
     update public.game_rooms set status='finished',winner_id=case when is_host then r.guest_id else r.host_id end,answer=r.solution,reason=case when r.game_kind='career' then 'Kariyer · Rakip pes etti' else 'Anagram · Rakip pes etti' end,finished_at=now_at where code=c returning * into r;
   else
     update public.game_rooms set status='void',reason='Oyun başlamadan oda kapatıldı. Puan değişmedi.',finished_at=now_at where code=c returning * into r;
   end if;
 end if;
 select username into opponent_name from public.game_profiles where id=case when is_host then r.guest_id else r.host_id end;
 return coalesce(payload,'{}'::jsonb)||jsonb_build_object('code',c,'gameKind',r.game_kind,'difficulty',r.difficulty,'status',r.status,'host',is_host,'opponent',opponent_name,
   'ready',case when is_host then r.host_ready else r.guest_ready end,'opponentReady',case when is_host then r.guest_ready else r.host_ready end,
   'team',null,'opponentTeam',null,'remaining',case when r.starts_at is null then null else greatest(0,ceil(extract(epoch from r.starts_at-now_at)))::int end,
   'serverMs',extract(epoch from now_at)*1000,'startsAt',extract(epoch from r.starts_at)*1000,'endsAt',extract(epoch from r.ends_at)*1000,
   'career',case when r.game_kind='career' and (visible or r.status in ('finished','void')) then
     (select coalesce(jsonb_agg(stage order by ordinal),'[]'::jsonb) from jsonb_array_elements(r.career_data->'stages') with ordinality s(stage,ordinal)
       where r.status in ('finished','void') or ordinal<=2+floor(greatest(0,extract(epoch from now_at-r.starts_at))/8)) else '[]'::jsonb end,
   'totalClues',case when r.game_kind='career' and (visible or r.status in ('finished','void')) then jsonb_array_length(r.career_data->'stages') else 0 end,
   'careerSource',case when r.status in ('finished','void') then r.career_data->>'source' else null end,
   'nextClueAt',case when r.game_kind='career' and visible and 2+floor(extract(epoch from now_at-r.starts_at)/8)<jsonb_array_length(r.career_data->'stages') then
     extract(epoch from r.starts_at)*1000+(floor(extract(epoch from now_at-r.starts_at)/8)+1)*8000 else null end,
   'puzzle',case when visible then r.puzzle else null end,'won',r.winner_id=u,'answer',r.answer,'reason',r.reason);
end $$;
notify pgrst,'reload schema';
commit;
