begin;
create table public.game_more_less_questions(id text primary key,data jsonb not null);
alter table public.game_more_less_questions enable row level security;
revoke all on public.game_more_less_questions from public,anon,authenticated;
insert into public.game_more_less_questions(id,data) values
('more-less-001-081', '{"id":"more-less-001-081","prompt":"EURO 2008 finallerinde hangisi daha fazla gol attı?","playerA":"David Villa","playerB":"Semih Şentürk","valueA":4,"valueB":3,"correctAnswer":"A","unit":"gol","period":"2008","source":"https://www.uefa.com/uefaeuro/history/seasons/2008/statistics/"}'),
('more-less-001-082', '{"id":"more-less-001-082","prompt":"EURO 2008 finallerinde hangisi daha fazla gol attı?","playerA":"Arda Turan","playerB":"Semih Şentürk","valueA":2,"valueB":3,"correctAnswer":"B","unit":"gol","period":"2008","source":"https://www.uefa.com/uefaeuro/history/seasons/2008/statistics/"}'),
('more-less-001-083', '{"id":"more-less-001-083","prompt":"EURO 2008 finallerinde hangisi daha fazla gol attı?","playerA":"Lukas Podolski","playerB":"Semih Şentürk","valueA":3,"valueB":3,"correctAnswer":"equal","unit":"gol","period":"2008","source":"https://www.uefa.com/uefaeuro/history/seasons/2008/statistics/"}'),
('more-less-001-084', '{"id":"more-less-001-084","prompt":"EURO 2008 finallerinde hangisi daha fazla gol attı?","playerA":"Roman Pavlyuchenko","playerB":"Arda Turan","valueA":3,"valueB":2,"correctAnswer":"A","unit":"gol","period":"2008","source":"https://www.uefa.com/uefaeuro/history/seasons/2008/statistics/"}'),
('more-less-001-085', '{"id":"more-less-001-085","prompt":"EURO 2016 finallerinde hangisi daha fazla gol attı?","playerA":"Gareth Bale","playerB":"Antoine Griezmann","valueA":3,"valueB":6,"correctAnswer":"B","unit":"gol","period":"2016","source":"https://www.uefa.com/uefaeuro/history/seasons/2016/statistics/"}'),
('more-less-001-086', '{"id":"more-less-001-086","prompt":"EURO 2016 finallerinde hangisi daha fazla gol attı?","playerA":"Antoine Griezmann","playerB":"Cristiano Ronaldo","valueA":6,"valueB":3,"correctAnswer":"A","unit":"gol","period":"2016","source":"https://www.uefa.com/uefaeuro/history/seasons/2016/statistics/"}'),
('more-less-001-087', '{"id":"more-less-001-087","prompt":"EURO 2020 finallerinde (2021''de oynandı) hangisi daha fazla gol attı?","playerA":"Cristiano Ronaldo","playerB":"Patrik Schick","valueA":5,"valueB":5,"correctAnswer":"equal","unit":"gol","period":"2020","source":"https://www.uefa.com/uefaeuro/history/seasons/2020/statistics/"}'),
('more-less-001-088', '{"id":"more-less-001-088","prompt":"EURO 2020 finallerinde (2021''de oynandı) hangisi daha fazla gol attı?","playerA":"Karim Benzema","playerB":"Patrik Schick","valueA":4,"valueB":5,"correctAnswer":"B","unit":"gol","period":"2020","source":"https://www.uefa.com/uefaeuro/history/seasons/2020/statistics/"}'),
('more-less-001-089', '{"id":"more-less-001-089","prompt":"EURO 2020 finallerinde (2021''de oynandı) hangisi daha fazla gol attı?","playerA":"Cristiano Ronaldo","playerB":"Emil Forsberg","valueA":5,"valueB":4,"correctAnswer":"A","unit":"gol","period":"2020","source":"https://www.uefa.com/uefaeuro/history/seasons/2020/statistics/"}'),
('more-less-001-090', '{"id":"more-less-001-090","prompt":"EURO 2020 finallerinde hangi kaleci daha fazla kurtarış yaptı?","playerA":"Uğurcan Çakır","playerB":"Kasper Schmeichel","valueA":18,"valueB":18,"correctAnswer":"equal","unit":"kurtarış","period":"2020","source":"https://www.uefa.com/uefaeuro/history/seasons/2020/statistics/"}'),
('more-less-001-091', '{"id":"more-less-001-091","prompt":"EURO 2020 finallerinde hangi kaleci daha fazla kurtarış yaptı?","playerA":"Uğurcan Çakır","playerB":"Yann Sommer","valueA":18,"valueB":21,"correctAnswer":"B","unit":"kurtarış","period":"2020","source":"https://www.uefa.com/uefaeuro/history/seasons/2020/statistics/"}'),
('more-less-001-092', '{"id":"more-less-001-092","prompt":"EURO 2024 finallerinde hangi kaleci daha fazla kurtarış yaptı?","playerA":"Mike Maignan","playerB":"Mert Günok","valueA":16,"valueB":15,"correctAnswer":"A","unit":"kurtarış","period":"2024","source":"https://www.uefa.com/uefaeuro/history/seasons/2024/statistics/"}'),
('more-less-001-093', '{"id":"more-less-001-093","prompt":"EURO 2024 finallerinde hangi kaleci daha fazla kurtarış yaptı?","playerA":"Jordan Pickford","playerB":"Giorgi Mamardashvili","valueA":17,"valueB":29,"correctAnswer":"B","unit":"kurtarış","period":"2024","source":"https://www.uefa.com/uefaeuro/history/seasons/2024/statistics/"}'),
('more-less-001-094', '{"id":"more-less-001-094","prompt":"2025/26 UEFA Şampiyonlar Ligi''nde hangisi daha fazla gol attı?","playerA":"Kylian Mbappé","playerB":"Harry Kane","valueA":15,"valueB":14,"correctAnswer":"A","unit":"gol","period":"2025/26","source":"https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/"}'),
('more-less-001-095', '{"id":"more-less-001-095","prompt":"2025/26 UEFA Şampiyonlar Ligi''nde hangisi daha fazla gol attı?","playerA":"Erling Haaland","playerB":"Anthony Gordon","valueA":8,"valueB":10,"correctAnswer":"B","unit":"gol","period":"2025/26","source":"https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/"}'),
('more-less-001-096', '{"id":"more-less-001-096","prompt":"2025/26 UEFA Şampiyonlar Ligi''nde hangisi daha fazla isabetli şut çekti?","playerA":"Victor Osimhen","playerB":"Harry Kane","valueA":25,"valueB":23,"correctAnswer":"A","unit":"isabetli şut","period":"2025/26","source":"https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/"}'),
('more-less-001-097', '{"id":"more-less-001-097","prompt":"2025/26 UEFA Şampiyonlar Ligi''nde hangisi daha fazla top kapma (tackle) yaptı?","playerA":"Lucas Torreira","playerB":"Aurélien Tchouaméni","valueA":36,"valueB":39,"correctAnswer":"B","unit":"top kapma (tackle)","period":"2025/26","source":"https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/"}'),
('more-less-001-098', '{"id":"more-less-001-098","prompt":"2025/26 UEFA Şampiyonlar Ligi''nde hangi kaleci daha fazla kurtarış yaptı?","playerA":"Thibaut Courtois","playerB":"Uğurcan Çakır","valueA":56,"valueB":48,"correctAnswer":"A","unit":"kurtarış","period":"2025/26","source":"https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/"}'),
('more-less-001-099', '{"id":"more-less-001-099","prompt":"2025-26 Süper Lig sezonunda hangisi daha fazla lig golü attı?","playerA":"Paul Onuachu","playerB":"Eldor Shomurodov","valueA":22,"valueB":22,"correctAnswer":"equal","unit":"gol","period":"2025-26","source":"https://www.tff.org/default.aspx?pageID=545"}'),
('more-less-001-100', '{"id":"more-less-001-100","prompt":"2001-02 Süper Lig sezonunda hangisi daha fazla lig golü attı?","playerA":"Arif Erdem","playerB":"İlhan Mansız","valueA":21,"valueB":21,"correctAnswer":"equal","unit":"gol","period":"2001-02","source":"https://www.tff.org/default.aspx?pageID=545"}');
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
create or replace function public.game_group(p_action text default 'list',p_code text default '',p_value text default '',p_kind text default 'daily',p_previous boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); c text:=upper(trim(p_code)); g public.game_groups%rowtype; items jsonb; board jsonb;
 week_start date:=date_trunc('week',clock_timestamp() at time zone 'Europe/Istanbul')::date;
 from_at timestamptz; until_at timestamptz;
begin
 if u is null or not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce giriş yap ve kullanıcı adını tamamla.'; end if;
 if p_kind not in ('daily','clubs','anagram','career','more_less') then raise exception 'Geçersiz oyun.'; end if;
 if p_action not in ('list','create','join','board') then raise exception 'Geçersiz işlem.'; end if;
 if p_action in ('create','join') then
   perform pg_advisory_xact_lock(hashtextextended('group-user:'||u::text,0));
   if (select count(*) from public.game_group_members where user_id=u)>=5 and
     not exists(select 1 from public.game_group_members where user_id=u and group_code=c) then raise exception 'En fazla 5 gruba katılabilirsin.'; end if;
 end if;
 if p_action='create' then
   if char_length(trim(p_value)) not between 3 and 32 then raise exception 'Grup adı 3–32 karakter olmalı.'; end if;
   loop
     c:=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
     begin insert into public.game_groups(code,name,owner_id) values(c,trim(p_value),u) returning * into g;exit;
     exception when unique_violation then null; end;
   end loop;
   insert into public.game_group_members(group_code,user_id) values(c,u);
 elsif p_action='join' then
   select * into g from public.game_groups where code=c for update;
   if not found then raise exception 'Grup bulunamadı. Kodu kontrol et.'; end if;
   if (select count(*) from public.game_group_members where group_code=c)>=50 and not exists
     (select 1 from public.game_group_members where group_code=c and user_id=u) then raise exception 'Grup dolu (50 kişi).'; end if;
   insert into public.game_group_members(group_code,user_id) values(c,u) on conflict do nothing;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('code',gr.code,'name',gr.name) order by gr.created_at),'[]'::jsonb) into items
   from public.game_groups gr join public.game_group_members m on m.group_code=gr.code where m.user_id=u;
 if p_action='list' then return jsonb_build_object('groups',items); end if;
 if not exists(select 1 from public.game_group_members where group_code=c and user_id=u) then raise exception 'Bu grubun üyesi değilsin.'; end if;
 select * into g from public.game_groups where code=c;
 if p_previous then week_start:=week_start-7; end if;
 from_at:=week_start::timestamp at time zone 'Europe/Istanbul';until_at:=(week_start+7)::timestamp at time zone 'Europe/Istanbul';
 if p_kind='daily' then
   with scores as (
     select p.id,p.username,coalesce(sum(e.points),0)::integer as points,
       count(e.completed_at)::integer as played,count(*) filter(where e.points=100)::integer as wins,0 as losses
     from public.game_group_members m join public.game_profiles p on p.id=m.user_id
     left join public.game_daily_entries e on e.user_id=p.id and e.day>=week_start and e.day<week_start+7
       and e.completed_at>=m.joined_at
     where m.group_code=c group by p.id,p.username
   ) select coalesce(jsonb_agg(to_jsonb(s) order by s.rank,s.username),'[]'::jsonb) into board from
     (select *,dense_rank() over(order by points desc,wins desc) as rank from scores) s;
 else
   with eligible as (
     select r.*,row_number() over(partition by least(r.host_id::text,r.guest_id::text),greatest(r.host_id::text,r.guest_id::text),
       (r.finished_at at time zone 'Europe/Istanbul')::date order by r.finished_at,r.code) as daily_match
     from public.game_rooms r
     join public.game_group_members h on h.group_code=c and h.user_id=r.host_id
     join public.game_group_members a on a.group_code=c and a.user_id=r.guest_id
     where r.status='finished' and r.winner_id is not null and r.game_kind=p_kind
       and r.finished_at>=from_at and r.finished_at<until_at and r.created_at>=greatest(h.joined_at,a.joined_at)
   ), scores as (
     select p.id,p.username,(count(*) filter(where e.winner_id=p.id)*3)::integer as points,
       count(e.code)::integer as played,count(*) filter(where e.winner_id=p.id)::integer as wins,
       count(*) filter(where e.winner_id<>p.id)::integer as losses
     from public.game_group_members m join public.game_profiles p on p.id=m.user_id
     left join eligible e on p.id in(e.host_id,e.guest_id) and e.daily_match<=5
     where m.group_code=c group by p.id,p.username
   ) select coalesce(jsonb_agg(to_jsonb(s) order by s.rank,s.username),'[]'::jsonb) into board from
     (select *,dense_rank() over(order by points desc,losses asc) as rank from scores) s;
 end if;
 return jsonb_build_object('groups',items,'code',g.code,'name',g.name,'kind',p_kind,'weekStart',week_start,'weekEnd',week_start+6,
   'nextAt',extract(epoch from until_at)*1000,'board',board);
end $$;
revoke all on function public.game_group(text,text,text,text,boolean) from public,anon;
grant execute on function public.game_group(text,text,text,text,boolean) to authenticated;


notify pgrst,'reload schema';
commit;
