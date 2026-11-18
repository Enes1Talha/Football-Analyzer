begin;
create table public.game_daily_questions (
 day date primary key, team_a text not null, team_b text not null,
 answer_ids text[] not null, answers jsonb not null
);
create table public.game_daily_entries (
 user_id uuid not null references public.game_profiles(id), day date not null references public.game_daily_questions(day),
 started_at timestamptz not null default clock_timestamp(), completed_at timestamptz,
 selected_id text, points integer not null default 0 check(points in (0,100)),
 primary key(user_id,day)
);
create table public.game_groups (
 code text primary key, name text not null check(char_length(name) between 3 and 32),
 owner_id uuid not null references public.game_profiles(id), created_at timestamptz not null default clock_timestamp()
);
create table public.game_group_members (
 group_code text not null references public.game_groups(code), user_id uuid not null references public.game_profiles(id),
 joined_at timestamptz not null default clock_timestamp(), primary key(group_code,user_id)
);
create index game_group_members_user on public.game_group_members(user_id);
alter table public.game_daily_questions enable row level security;
alter table public.game_daily_entries enable row level security;
alter table public.game_groups enable row level security;
alter table public.game_group_members enable row level security;
revoke all on public.game_daily_questions,public.game_daily_entries,public.game_groups,public.game_group_members from public,anon,authenticated;

create function public.game_daily(p_action text default 'state',p_day text default '',p_player text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); d date:=(clock_timestamp() at time zone 'Europe/Istanbul')::date;
 q public.game_daily_questions%rowtype; e public.game_daily_entries%rowtype; streak integer:=0; cursor_day date; week_start date; weekly integer;
begin
 if u is null or not exists(select 1 from public.game_profiles where id=u) then raise exception 'Günlük mücadele için giriş yap ve kullanıcı adını tamamla.'; end if;
 if p_action not in ('state','start','answer','pass') then raise exception 'Geçersiz işlem.'; end if;
 if p_action<>'state' and p_day<>d::text then raise exception 'Yeni gün başladı. Günlük mücadeleyi yenile.'; end if;
 -- Persist one common question; later catalog updates cannot change today's answers.
 perform pg_advisory_xact_lock(hashtextextended('daily:'||d::text,0));
 select * into q from public.game_daily_questions where day=d;
 if not found then
   with candidates as (
     select a as team_a,b as team_b,array_agg(p.id order by p.id) as ids,
       jsonb_agg(jsonb_build_object('id',p.id,'name',p.name) order by p.name) as names
     from public.game_players p cross join lateral unnest(p.clubs) a cross join lateral unnest(p.clubs) b
     where a<b group by a,b
   )
   insert into public.game_daily_questions(day,team_a,team_b,answer_ids,answers)
   select d,c.team_a,c.team_b,c.ids,c.names from candidates c
   order by (select count(*) from public.game_daily_questions old where old.day>=d-30 and old.team_a=c.team_a and old.team_b=c.team_b),
     md5(d::text||c.team_a||'|'||c.team_b) limit 1 returning * into q;
   if not found then raise exception 'Günlük soru hazırlanamadı.'; end if;
 end if;
 if p_action='start' then insert into public.game_daily_entries(user_id,day) values(u,d) on conflict do nothing; end if;
 select * into e from public.game_daily_entries where user_id=u and day=d for update;
 if p_action in ('answer','pass') and e.completed_at is null then
   if e.user_id is null then raise exception 'Önce günlük mücadeleyi başlat.'; end if;
   if p_action='answer' and not exists(select 1 from public.game_players where id=p_player) then raise exception 'Listeden bir oyuncu seç.'; end if;
   update public.game_daily_entries set selected_id=case when p_action='answer' then p_player else null end,
     points=case when p_action='answer' and p_player=any(q.answer_ids) then 100 else 0 end,completed_at=clock_timestamp()
     where user_id=u and day=d returning * into e;
 end if;
 cursor_day:=case when e.completed_at is not null then d else d-1 end;
 while exists(select 1 from public.game_daily_entries where user_id=u and day=cursor_day and completed_at is not null) loop
   streak:=streak+1;cursor_day:=cursor_day-1;
 end loop;
 week_start:=date_trunc('week',d::timestamp)::date;
 select coalesce(sum(points),0)::integer into weekly from public.game_daily_entries where user_id=u and day>=week_start and day<week_start+7;
 return jsonb_build_object('day',d,'nextAt',extract(epoch from ((d+1)::timestamp at time zone 'Europe/Istanbul'))*1000,
   'started',e.user_id is not null,'completed',e.completed_at is not null,'points',coalesce(e.points,0),'streak',streak,'weeklyPoints',weekly,
   'teams',case when e.user_id is not null then jsonb_build_array(q.team_a,q.team_b) else '[]'::jsonb end,
   'answers',case when e.completed_at is not null then q.answers else '[]'::jsonb end);
end $$;
revoke all on function public.game_daily(text,text,text) from public,anon;
grant execute on function public.game_daily(text,text,text) to authenticated;

create function public.game_group(p_action text default 'list',p_code text default '',p_value text default '',p_kind text default 'daily',p_previous boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); c text:=upper(trim(p_code)); g public.game_groups%rowtype; items jsonb; board jsonb;
 week_start date:=date_trunc('week',clock_timestamp() at time zone 'Europe/Istanbul')::date;
 from_at timestamptz; until_at timestamptz;
begin
 if u is null or not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce giriş yap ve kullanıcı adını tamamla.'; end if;
 if p_kind not in ('daily','clubs','anagram','career') then raise exception 'Geçersiz oyun.'; end if;
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

-- Add the missing same-opponent rematch to 3-2-1; preserve other games.
alter function public.game_room(text,text,text) rename to game_room_before_club_rematch;
revoke all on function public.game_room_before_club_rematch(text,text,text) from public,anon,authenticated;
create function public.game_room(p_action text,p_code text default '',p_value text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare r public.game_rooms%rowtype; u uuid:=auth.uid(); result jsonb;
begin
 if p_action='rematch' then
   select * into r from public.game_rooms where code=upper(trim(p_code)) for update;
   if found and r.game_kind='clubs' then
     if u is null or (u is distinct from r.host_id and u is distinct from r.guest_id) then raise exception 'Bu oda sana ait değil.'; end if;
     if r.status not in ('finished','void') or r.guest_id is null then raise exception 'Önce maçı tamamla.'; end if;
     if r.rematch_code is null then
       result:=public.game_room_before_club_rematch('create','','');
       update public.game_rooms set guest_id=case when u=r.host_id then r.guest_id else r.host_id end where code=result->>'code';
       update public.game_rooms set rematch_code=result->>'code' where code=r.code returning * into r;
     end if;
     return public.game_room_before_club_rematch('state',r.rematch_code,'');
   end if;
 end if;
 return public.game_room_before_club_rematch(p_action,p_code,p_value);
end $$;
revoke all on function public.game_room(text,text,text) from public,anon;
grant execute on function public.game_room(text,text,text) to authenticated;
notify pgrst,'reload schema';
commit;
