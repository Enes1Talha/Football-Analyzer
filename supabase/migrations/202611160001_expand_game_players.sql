-- Generated from football-analyzer-mobile/game/data.ts.
-- Additive upsert: no profiles, rooms or scores are modified.
begin;
insert into public.game_players (id,name,clubs) values
-- https://www.uefa.com/uefachampionsleague/news/01e1-0e73a5a40fd0-cf701112f836-1000--united-braced-for-beckham-reunion/
 ('beckham','David Beckham',array['Manchester United','Real Madrid','AC Milan']),
-- https://www.uefa.com/MultimediaFiles/Download/competitions/Statistics/01/85/99/80/1859980_DOWNLOAD.pdf
 ('cristiano','Cristiano Ronaldo',array['Manchester United','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/023f-0e98047a7d5d-55052900dddf-1000--ibrahimovic-plays-for-seventh-champions-league-club/
 ('zlatan','Zlatan Ibrahimović',array['Ajax','Juventus','Inter','Barcelona','AC Milan','Paris Saint-Germain','Manchester United']),
-- https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes
 ('cech','Petr Čech',array['Chelsea','Arsenal']),
-- https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes
 ('cesc','Cesc Fàbregas',array['Chelsea','Arsenal']),
-- https://www.uefa.com/uefachampionsleague/news/01cf-0e6f8175da77-70f6f9a8645c-1000--fenerbahce-invite-emre-aboard/
 ('emre','Emre Belözoğlu',array['Galatasaray','Fenerbahçe','Inter','Newcastle United']),
-- https://www.aa.com.tr/tr/futbol/burak-yilmaz-galatasarayin-basarisinin-altinda-yatan-sirri-acikladi/3564514
 ('burak','Burak Yılmaz',array['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor']),
-- https://www.liverpoolfc.com/news/first-team/120383-kuyt-agrees-fenerbahce-deal
 ('kuyt','Dirk Kuyt',array['Feyenoord','Liverpool','Fenerbahçe']),
-- https://www.uefa.com/uefachampionsleague/news/0205-0e82f5488bd6-736eb926ee25-1000--galatasaray-signal-intent-with-sneijder-signing/
 ('sneijder','Wesley Sneijder',array['Ajax','Real Madrid','Inter','Galatasaray']),
-- https://www.uefa.com/uefachampionsleague/news/0205-0e8303c5f5c4-8fae37114cb4-1000--galatasaray-bring-drogba-back-to-europe/
 ('drogba','Didier Drogba',array['Marseille','Chelsea','Galatasaray']),
-- https://www.uefa.com/uefachampionsleague/news/0253-0d80681a8b6a-835e118a60b8-1000--galatasaray-capture-world-cup-winner-podolski/
 ('podolski','Lukas Podolski',array['Bayern Munich','Arsenal','Inter','Galatasaray']),
-- https://eredivisie.com/news/ex-man-utd-and-arsenal-forward-van-persie-retires-after-final-feyenoord-game/
 ('van-persie','Robin van Persie',array['Feyenoord','Arsenal','Manchester United','Fenerbahçe'])
on conflict (id) do update set name=excluded.name,clubs=excluded.clubs;
commit;
