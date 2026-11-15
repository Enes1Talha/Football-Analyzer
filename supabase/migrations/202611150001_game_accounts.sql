begin;

create table public.game_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);
create table public.game_players (
  id text primary key, name text not null, clubs text[] not null
);
insert into public.game_players values
 ('beckham','David Beckham',array['Manchester United','Real Madrid','AC Milan']),
 ('cristiano','Cristiano Ronaldo',array['Manchester United','Real Madrid']),
 ('zlatan','Zlatan Ibrahimović',array['Ajax','Juventus','Inter','Barcelona','AC Milan','Paris Saint-Germain','Manchester United']),
 ('cech','Petr Čech',array['Chelsea','Arsenal']),
 ('cesc','Cesc Fàbregas',array['Chelsea','Arsenal']);
create table public.game_rooms (
  code text primary key,
  host_id uuid not null references public.game_profiles(id),
  guest_id uuid references public.game_profiles(id),
  host_team text, guest_team text,
  starts_at timestamptz,
  status text not null default 'waiting' check (status in ('waiting','playing','finished','void')),
  winner_id uuid references public.game_profiles(id),
  answer text, reason text,
  host_attempt timestamptz, guest_attempt timestamptz,
  created_at timestamptz not null default now(), finished_at timestamptz,
  check (host_id is distinct from guest_id),
  check (winner_id is null or winner_id in (host_id,guest_id))
);
create index game_rooms_host on public.game_rooms(host_id, created_at desc);
create index game_rooms_guest on public.game_rooms(guest_id, created_at desc);
alter table public.game_profiles enable row level security;
alter table public.game_players enable row level security;
alter table public.game_rooms enable row level security;
revoke all on public.game_profiles, public.game_players, public.game_rooms from anon, authenticated;

-- All mutations run here: clients cannot choose winners or write statistics.
create function public.game_set_username(p_username text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare u uuid := auth.uid(); n text := lower(trim(p_username));
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if n !~ '^[a-z0-9_]{3,20}$' then raise exception 'Kullanıcı adı 3–20 karakter: a-z, 0-9 ve alt çizgi.'; end if;
 insert into public.game_profiles(id,username) values(u,n);
 return jsonb_build_object('id',u,'username',n);
exception when unique_violation then raise exception 'Bu kullanıcı adı alınmış veya hesabının kullanıcı adı zaten var.';
end $$;

create function public.game_room(p_action text, p_code text default '', p_value text default '') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
 u uuid := auth.uid(); r public.game_rooms%rowtype; c text := upper(trim(p_code));
 is_host boolean; visible boolean; opponent_name text; answer_name text;
begin
 if u is null then raise exception 'Önce giriş yap.'; end if;
 if not exists(select 1 from public.game_profiles where id=u) then raise exception 'Önce kullanıcı adını oluştur.'; end if;
 if p_action='create' then
   -- Serialize creation per account and limit abandoned rooms.
   perform pg_advisory_xact_lock(hashtextextended(u::text,0));
   if (select count(*) from public.game_rooms where host_id=u and status in ('waiting','playing') and created_at>now()-interval '24 hours') >= 5 then
     raise exception 'Açık odalarından birini tamamla veya kapat.';
   end if;
   loop
     c := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
     begin
       insert into public.game_rooms(code,host_id) values(c,u) returning * into r;
       exit;
     exception when unique_violation then null;
     end;
   end loop;
 else
   select * into r from public.game_rooms where code=c for update;
   if not found then raise exception 'Oda bulunamadı. Kodu kontrol et.'; end if;
   if p_action='join' and r.host_id<>u and r.guest_id is null and r.status='waiting' and r.created_at>now()-interval '24 hours' then
     update public.game_rooms set guest_id=u where code=c returning * into r;
   end if;
   if u is distinct from r.host_id and u is distinct from r.guest_id then raise exception 'Bu oda dolu veya sana ait değil.'; end if;
 end if;
 is_host := u=r.host_id;
 if r.status in ('waiting','playing') and r.created_at<=now()-interval '24 hours' then
   update public.game_rooms set status='void', reason='Odanın süresi doldu.', finished_at=now() where code=c returning * into r;
 end if;
 if p_action='ready' and r.status='waiting' then
   if not exists(select 1 from public.game_players where p_value=any(clubs)) then raise exception 'Listeden bir takım seç.'; end if;
   if (is_host and r.host_team is not null) or (not is_host and r.guest_team is not null) then raise exception 'Seçimin zaten kilitlendi.'; end if;
   update public.game_rooms set host_team=case when is_host then p_value else host_team end,
     guest_team=case when not is_host then p_value else guest_team end where code=c returning * into r;
   if r.host_team is not null and r.guest_team is not null then
     update public.game_rooms set starts_at=clock_timestamp()+interval '3 seconds',status='playing' where code=c returning * into r;
   end if;
 end if;
 visible := r.starts_at is not null and clock_timestamp()>=r.starts_at;
 if r.status='playing' and visible and (r.host_team=r.guest_team or not exists(
   select 1 from public.game_players where clubs @> array[r.host_team,r.guest_team]
 )) then
   update public.game_rooms set status='void',reason='Bu eşleşmede doğrulanmış cevap yok veya aynı takım seçildi. Puan değişmedi.',finished_at=now() where code=c returning * into r;
 end if;
 if p_action='answer' and r.status='playing' then
   if not visible then raise exception 'Geri sayımın bitmesini bekle.'; end if;
   if coalesce(case when is_host then r.host_attempt else r.guest_attempt end,'epoch') > clock_timestamp()-interval '1 second' then
     raise exception 'Yeni cevap için bir saniye bekle.';
   end if;
   update public.game_rooms set host_attempt=case when is_host then clock_timestamp() else host_attempt end,
     guest_attempt=case when not is_host then clock_timestamp() else guest_attempt end where code=c;
   select name into answer_name from public.game_players where id=p_value and clubs @> array[r.host_team,r.guest_team];
   if answer_name is not null then
     update public.game_rooms set status='finished',winner_id=u,answer=answer_name,reason='İlk doğru cevap',finished_at=clock_timestamp() where code=c returning * into r;
   else
     return jsonb_build_object('incorrect',true);
   end if;
 end if;
 if p_action='leave' and r.status in ('waiting','playing') then
   if r.status='playing' and visible then
     update public.game_rooms set status='finished',winner_id=case when is_host then r.guest_id else r.host_id end,
       reason='Rakip pes etti',finished_at=clock_timestamp() where code=c returning * into r;
   else
     update public.game_rooms set status='void',reason='Oyun başlamadan oda kapatıldı. Puan değişmedi.',finished_at=clock_timestamp() where code=c returning * into r;
   end if;
 end if;
 select username into opponent_name from public.game_profiles where id=case when is_host then r.guest_id else r.host_id end;
 return jsonb_build_object('code',r.code,'status',r.status,'host',is_host,'opponent',opponent_name,
   'team',case when is_host then r.host_team else r.guest_team end,
   'opponentTeam',case when visible then case when is_host then r.guest_team else r.host_team end else null end,
   'opponentReady',case when is_host then r.guest_team is not null else r.host_team is not null end,
   'remaining',case when r.starts_at is null then null else greatest(0,ceil(extract(epoch from r.starts_at-clock_timestamp())))::int end,
   'won',r.winner_id=u,'answer',r.answer,'reason',r.reason);
end $$;

create function public.game_dashboard() returns jsonb
language sql security definer set search_path = '' as $$
 with results as (
   select host_id as user_id,guest_id as opponent_id,winner_id=host_id as won,finished_at,code,host_team,guest_team,answer,reason from public.game_rooms where status='finished'
   union all
   select guest_id,host_id,winner_id=guest_id,finished_at,code,guest_team,host_team,answer,reason from public.game_rooms where status='finished'
 ), totals as (
   select p.id,p.username,count(*) filter(where r.won)::int as wins,
     count(*) filter(where not r.won)::int as losses
   from public.game_profiles p left join results r on r.user_id=p.id group by p.id
 ), ranked as (
   select *,row_number() over(order by wins desc,losses asc,username) as rank from totals
 ), history as (
   select r.*,p.username as opponent from results r join public.game_profiles p on p.id=r.opponent_id where user_id=auth.uid()
 ), rivals as (
   select opponent_id,opponent,count(*) filter(where won)::int as wins,count(*) filter(where not won)::int as losses,max(finished_at) as last_played
   from history group by opponent_id,opponent
 )
 select jsonb_build_object(
   'profile',(select to_jsonb(t) from ranked t where id=auth.uid()),
   'streak',(select count(*) from history where won and finished_at>coalesce((select max(finished_at) from history where not won),'epoch')),
   'leaderboard',coalesce((select jsonb_agg(t) from (select * from ranked order by rank limit 50)t),'[]'::jsonb),
   'rivals',coalesce((select jsonb_agg(t) from (select * from rivals order by last_played desc limit 50)t),'[]'::jsonb),
   'history',coalesce((select jsonb_agg(t) from (select code,opponent,won,finished_at,host_team,guest_team,answer,reason from history order by finished_at desc,code limit 20)t),'[]'::jsonb)
 ) where auth.uid() is not null;
$$;
revoke all on function public.game_set_username(text), public.game_room(text,text,text), public.game_dashboard() from public, anon;
grant execute on function public.game_set_username(text), public.game_room(text,text,text), public.game_dashboard() to authenticated;
notify pgrst, 'reload schema';
commit;
