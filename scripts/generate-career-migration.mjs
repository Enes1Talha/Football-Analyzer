import {readFileSync,writeFileSync} from 'node:fs';
const trails=JSON.parse(readFileSync('src/lib/career-trails.json','utf8'));
const quote=s=>"'"+s.replace(/'/g,"''")+"'";
let fn=readFileSync('supabase/migrations/202611170003_anagram.sql','utf8').match(/create function public\.game_room\([\s\S]+?end \$\$;/)[0];
function replace(a,b){if(!fn.includes(a))throw new Error('Missing migration anchor: '+a);fn=fn.replace(a,b);}
replace('create function public.game_room','create or replace function public.game_room');
replace('selected public.game_anagrams%rowtype;', 'selected public.game_anagrams%rowtype; career_selected public.game_careers%rowtype; clue_count integer;');
replace("if p_action='create_anagram' then", "if p_action in ('create_anagram','create_career') then\n   if p_action='create_career' then p_value:='medium'; end if;");
replace("values(c,u,'anagram',p_value)","values(c,u,case when p_action='create_career' then 'career' else 'anagram' end,p_value)");
replace("public.game_room('create_anagram','',r.difficulty)","public.game_room(case when r.game_kind='career' then 'create_career' else 'create_anagram' end,'',r.difficulty)");
replace("     select * into selected from public.game_anagrams",`     if r.game_kind='career' then
       select * into career_selected from public.game_careers order by random() limit 1;
       if not found then raise exception 'Henüz kariyer sorusu yok.'; end if;
       now_at:=clock_timestamp();
       duration:=(jsonb_array_length(career_selected.data->'stages')-2)*8+20;
       update public.game_rooms set solution=career_selected.data->>'playerName',career_data=career_selected.data,
         starts_at=now_at+interval '3 seconds',ends_at=now_at+make_interval(secs=>3+duration),status='playing' where code=c returning * into r;
     else
     select * into selected from public.game_anagrams`);
replace("status='playing' where code=c returning * into r;\n   end if;", "status='playing' where code=c returning * into r;\n     end if;\n   end if;");
replace("if public.game_answer_key(p_value)=public.game_answer_key(r.solution) then",`if public.game_answer_key(p_value)=public.game_answer_key(r.solution) or
      (r.game_kind='career' and exists(select 1 from jsonb_array_elements_text(r.career_data->'aliases') a where public.game_answer_key(a)=public.game_answer_key(p_value))) then`);
replace("reason='Anagram · İlk doğru cevap'", "reason=case when r.game_kind='career' then 'Kariyer · İlk doğru cevap' else 'Anagram · İlk doğru cevap' end");
replace("reason='Anagram · Rakip pes etti'", "reason=case when r.game_kind='career' then 'Kariyer · Rakip pes etti' else 'Anagram · Rakip pes etti' end");
replace("'gameKind','anagram'", "'gameKind',r.game_kind");
replace("   'puzzle',case when visible then r.puzzle else null end",`   'career',case when r.game_kind='career' and (visible or r.status in ('finished','void')) then
     (select coalesce(jsonb_agg(stage order by ordinal),'[]'::jsonb) from jsonb_array_elements(r.career_data->'stages') with ordinality s(stage,ordinal)
       where r.status in ('finished','void') or ordinal<=2+floor(greatest(0,extract(epoch from now_at-r.starts_at))/8)) else '[]'::jsonb end,
   'totalClues',case when r.game_kind='career' and (visible or r.status in ('finished','void')) then jsonb_array_length(r.career_data->'stages') else 0 end,
   'careerSource',case when r.status in ('finished','void') then r.career_data->>'source' else null end,
   'nextClueAt',case when r.game_kind='career' and visible and 2+floor(extract(epoch from now_at-r.starts_at)/8)<jsonb_array_length(r.career_data->'stages') then
     extract(epoch from r.starts_at)*1000+(floor(extract(epoch from now_at-r.starts_at)/8)+1)*8000 else null end,
   'puzzle',case when visible then r.puzzle else null end`);
const header=`begin;
alter table public.game_rooms drop constraint game_rooms_game_kind_check;
alter table public.game_rooms add constraint game_rooms_game_kind_check check(game_kind in ('clubs','anagram','career'));
alter table public.game_rooms add column career_data jsonb;
create table public.game_careers(id text primary key, data jsonb not null check(jsonb_array_length(data->'stages')>=3));
alter table public.game_careers enable row level security;
revoke all on public.game_careers from public,anon,authenticated;
insert into public.game_careers(id,data) values
${trails.map(t=>` (${quote(t.id)},${quote(JSON.stringify(t))}::jsonb)`).join(',\n')};
`;
writeFileSync('supabase/migrations/202611170012_career_game.sql',header+fn+"\nnotify pgrst,'reload schema';\ncommit;\n",{flag:'wx'});
console.log('Created career migration with '+trails.length+' trails');
