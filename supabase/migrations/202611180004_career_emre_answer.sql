begin;
-- Search aliases are not necessarily sufficiently specific as free-text answers.
update public.game_careers
set data=jsonb_set(data,'{aliases}','["Emre Belözoğlu","Belözoğlu"]'::jsonb)
where id='emre';
-- Existing open rooms carry their own snapshot; correct that too, preserving scores.
update public.game_rooms
set career_data=jsonb_set(career_data,'{aliases}','["Emre Belözoğlu","Belözoğlu"]'::jsonb)
where game_kind='career' and status in ('waiting','playing') and career_data->>'id'='emre';
notify pgrst,'reload schema';
commit;
