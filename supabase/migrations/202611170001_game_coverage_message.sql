begin;
-- Preserve the existing scoring/auth implementation; clarify only the coverage message.
do $$
declare definition text;
begin
 select pg_get_functiondef('public.game_room(text,text,text)'::regprocedure) into definition;
 if position('Bu eşleşmede doğrulanmış cevap yok veya aynı takım seçildi. Puan değişmedi.' in definition)=0 then
   raise exception 'Expected room message not found; review migration before applying.';
 end if;
 execute replace(definition,
 'Bu eşleşmede doğrulanmış cevap yok veya aynı takım seçildi. Puan değişmedi.',
 'Aynı takım seçildi veya bu eşleşmenin cevabı henüz veri havuzumuzda yok. Bu, gerçekte ortak oyuncu olmadığı anlamına gelmez. Puan değişmedi.');
end $$;
commit;
