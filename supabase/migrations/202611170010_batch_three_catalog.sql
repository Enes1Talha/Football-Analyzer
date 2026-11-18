-- Generated from football-analyzer-mobile/game/data.ts.
-- Additive upsert: no profiles, rooms or scores are modified.
begin;
insert into public.game_players (id,name,clubs) values
-- https://www.wikidata.org/wiki/Q615
 ('messi','Lionel Messi',array['Barcelona','Paris Saint-Germain']),
-- https://www.uefa.com/uefachampionsleague/news/01e1-0e73a5a40fd0-cf701112f836-1000--united-braced-for-beckham-reunion/
 ('beckham','David Beckham',array['Manchester United','Real Madrid','AC Milan','Paris Saint-Germain']),
-- https://www.uefa.com/MultimediaFiles/Download/competitions/Statistics/01/85/99/80/1859980_DOWNLOAD.pdf
 ('cristiano','Cristiano Ronaldo',array['Manchester United','Real Madrid','Juventus','Sporting CP']),
-- https://www.uefa.com/uefachampionsleague/news/023f-0e98047a7d5d-55052900dddf-1000--ibrahimovic-plays-for-seventh-champions-league-club/
 ('zlatan','Zlatan Ibrahimović',array['Ajax','Juventus','Inter','Barcelona','AC Milan','Paris Saint-Germain','Manchester United']),
-- https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes
 ('cech','Petr Čech',array['Chelsea','Arsenal']),
-- https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes
 ('cesc','Cesc Fàbregas',array['Chelsea','Arsenal','Barcelona']),
-- https://www.uefa.com/uefachampionsleague/news/01cf-0e6f8175da77-70f6f9a8645c-1000--fenerbahce-invite-emre-aboard/
 ('emre','Emre Belözoğlu',array['Galatasaray','Fenerbahçe','Inter','Newcastle United','Atlético Madrid']),
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
 ('van-persie','Robin van Persie',array['Feyenoord','Arsenal','Manchester United','Fenerbahçe']),
-- https://www.wikidata.org/wiki/Q1939
 ('wd-Q1939','Nicolas Anelka',array['Arsenal','Chelsea','Liverpool','Real Madrid','Fenerbahçe','Juventus','Paris Saint-Germain','Manchester City']),
-- https://www.wikidata.org/wiki/Q2301910
 ('wd-Q2301910','Michy Batshuayi',array['Chelsea','Galatasaray','Fenerbahçe','Beşiktaş','Borussia Dortmund','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q6298063
 ('wd-Q6298063','João Cancelo',array['Barcelona','Inter','Juventus','Bayern Munich','Benfica','Manchester City','Valencia']),
-- https://www.wikidata.org/wiki/Q180553
 ('wd-Q180553','Alexis Sánchez',array['Manchester United','Arsenal','Barcelona','Inter','Sevilla','Marseille']),
-- https://www.wikidata.org/wiki/Q188241
 ('wd-Q188241','Ricardo Quaresma',array['Chelsea','Barcelona','Beşiktaş','Inter','Porto','Sporting CP']),
-- https://www.wikidata.org/wiki/Q29339
 ('wd-Q29339','Maniche',array['Chelsea','Inter','Porto','Benfica','Sporting CP','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q314241
 ('wd-Q314241','José Sosa',array['Fenerbahçe','Beşiktaş','Trabzonspor','AC Milan','Bayern Munich','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q363829
 ('wd-Q363829','Paulo Futre',array['AC Milan','Porto','Benfica','Sporting CP','Atlético Madrid','Marseille']),
-- https://www.wikidata.org/wiki/Q48770
 ('wd-Q48770','Álvaro Morata',array['Chelsea','Real Madrid','Galatasaray','AC Milan','Juventus','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q63659
 ('wd-Q63659','Gabriel Heinze',array['Manchester United','Real Madrid','Paris Saint-Germain','Sporting CP','Roma','Marseille']),
-- https://www.wikidata.org/wiki/Q129700
 ('wd-Q129700','Mario Balotelli',array['Liverpool','AC Milan','Inter','Manchester City','Marseille']),
-- https://www.wikidata.org/wiki/Q138172
 ('wd-Q138172','Radamel Falcao',array['Manchester United','Chelsea','Galatasaray','Porto','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q146907
 ('wd-Q146907','Miralem Pjanić',array['Barcelona','Beşiktaş','Juventus','Roma','Lyon']),
-- https://www.wikidata.org/wiki/Q15214940
 ('wd-Q15214940','Alex Telles',array['Manchester United','Galatasaray','Inter','Porto','Sevilla']),
-- https://www.wikidata.org/wiki/Q168287
 ('wd-Q168287','Christian Panucci',array['Chelsea','Real Madrid','AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q173139
 ('wd-Q173139','George Weah',array['Chelsea','AC Milan','Paris Saint-Germain','Manchester City','Marseille']),
-- https://www.wikidata.org/wiki/Q185115
 ('wd-Q185115','Edgar Davids',array['Barcelona','AC Milan','Inter','Juventus','Ajax']),
-- https://www.wikidata.org/wiki/Q189686
 ('wd-Q189686','Patrick Kluivert',array['Barcelona','AC Milan','Ajax','Valencia','Newcastle United']),
-- https://www.wikidata.org/wiki/Q1909
 ('wd-Q1909','Adil Rami',array['Fenerbahçe','AC Milan','Sevilla','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q191080
 ('wd-Q191080','Seydou Keita',array['Barcelona','Roma','Sevilla','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q191151
 ('wd-Q191151','Alberto Aquilani',array['Liverpool','AC Milan','Juventus','Sporting CP','Roma']),
-- https://www.wikidata.org/wiki/Q196219
 ('wd-Q196219','Henrih Mhitaryan',array['Manchester United','Arsenal','Inter','Roma','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q203665
 ('wd-Q203665','Simão Sabrosa',array['Barcelona','Beşiktaş','Benfica','Sporting CP','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q210944
 ('wd-Q210944','Tiago Mendes',array['Chelsea','Juventus','Benfica','Atlético Madrid','Lyon']),
-- https://www.wikidata.org/wiki/Q216557
 ('wd-Q216557','Mohamed Sissoko',array['Liverpool','Real Madrid','Juventus','Paris Saint-Germain','Valencia']),
-- https://www.wikidata.org/wiki/Q251683
 ('wd-Q251683','Ángel Di María',array['Manchester United','Real Madrid','Juventus','Paris Saint-Germain','Benfica']),
-- https://www.wikidata.org/wiki/Q27049064
 ('wd-Q27049064','João Félix',array['Chelsea','Barcelona','AC Milan','Benfica','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q276399
 ('wd-Q276399','José Antonio Reyes',array['Arsenal','Real Madrid','Benfica','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q297603
 ('wd-Q297603','Nemanja Matić',array['Manchester United','Chelsea','Benfica','Roma','Lyon']),
-- https://www.wikidata.org/wiki/Q312157
 ('wd-Q312157','Raheem Sterling',array['Arsenal','Chelsea','Liverpool','Manchester City','Feyenoord']),
-- https://www.wikidata.org/wiki/Q313316
 ('wd-Q313316','Romelu Lukaku',array['Manchester United','Chelsea','Fenerbahçe','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q314440
 ('wd-Q314440','Paulo Sousa',array['Inter','Juventus','Benfica','Sporting CP','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q372379
 ('wd-Q372379','Georginio Wijnaldum',array['Liverpool','Paris Saint-Germain','Roma','Feyenoord','Newcastle United']),
-- https://www.wikidata.org/wiki/Q44977
 ('wd-Q44977','Pierre-Emerick Aubameyang',array['Arsenal','Chelsea','Barcelona','Borussia Dortmund','Marseille']),
-- https://www.wikidata.org/wiki/Q46347
 ('wd-Q46347','Patrick Vieira',array['Arsenal','AC Milan','Inter','Juventus','Manchester City']),
-- https://www.wikidata.org/wiki/Q725768
 ('wd-Q725768','Dimas Teixeira',array['Fenerbahçe','Juventus','Benfica','Sporting CP','Marseille']),
-- https://www.wikidata.org/wiki/Q114859
 ('wd-Q114859','Loïc Rémy',array['Chelsea','Lyon','Marseille','Newcastle United']),
-- https://www.wikidata.org/wiki/Q1185419
 ('wd-Q1185419','Bruma',array['Galatasaray','Fenerbahçe','Benfica','Sporting CP']),
-- https://www.wikidata.org/wiki/Q1255625
 ('wd-Q1255625','Samuel Eto''o',array['Chelsea','Real Madrid','Barcelona','Inter']),
-- https://www.wikidata.org/wiki/Q125796
 ('wd-Q125796','Winston Bogarde',array['Chelsea','Barcelona','AC Milan','Ajax']),
-- https://www.wikidata.org/wiki/Q128829
 ('wd-Q128829','Michael Owen',array['Manchester United','Liverpool','Real Madrid','Newcastle United']),
-- https://www.wikidata.org/wiki/Q1347269
 ('wd-Q1347269','İslam Süleymani',array['Fenerbahçe','Sporting CP','Lyon','Newcastle United']),
-- https://www.wikidata.org/wiki/Q1378371
 ('wd-Q1378371','Alessandro Florenzi',array['AC Milan','Paris Saint-Germain','Roma','Valencia']),
-- https://www.wikidata.org/wiki/Q1388570
 ('wd-Q1388570','Sergen Yalçın',array['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor']),
-- https://www.wikidata.org/wiki/Q14602686
 ('wd-Q14602686','Gabriel Paulista',array['Arsenal','Beşiktaş','Atlético Madrid','Valencia']),
-- https://www.wikidata.org/wiki/Q151034
 ('wd-Q151034','Kevin-Prince Boateng',array['Barcelona','Beşiktaş','AC Milan','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q153786
 ('wd-Q153786','Edin Džeko',array['Fenerbahçe','Inter','Roma','Manchester City']),
-- https://www.wikidata.org/wiki/Q155903
 ('wd-Q155903','Dietmar Hamann',array['Liverpool','Bayern Munich','Manchester City','Newcastle United']),
-- https://www.wikidata.org/wiki/Q161089
 ('wd-Q161089','İlkay Gündoğan',array['Barcelona','Galatasaray','Manchester City','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q163666
 ('wd-Q163666','Pepe Reina',array['Liverpool','Barcelona','AC Milan','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q168740
 ('wd-Q168740','Juan Mata',array['Manchester United','Chelsea','Galatasaray','Valencia']),
-- https://www.wikidata.org/wiki/Q172720
 ('wd-Q172720','Dani Alves',array['Barcelona','Juventus','Paris Saint-Germain','Sevilla']),
-- https://www.wikidata.org/wiki/Q175296
 ('wd-Q175296','Raul Meireles',array['Chelsea','Liverpool','Fenerbahçe','Porto']),
-- https://www.wikidata.org/wiki/Q179172
 ('wd-Q179172','Bojan Krkić',array['Barcelona','AC Milan','Ajax','Roma']),
-- https://www.wikidata.org/wiki/Q180993
 ('wd-Q180993','Antonio Cassano',array['Real Madrid','AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q182063
 ('wd-Q182063','Nicolás Otamendi',array['Porto','Benfica','Manchester City','Valencia']),
-- https://www.wikidata.org/wiki/Q1839
 ('wd-Q1839','Laurent Blanc',array['Manchester United','Barcelona','Inter','Marseille']),
-- https://www.wikidata.org/wiki/Q18394009
 ('wd-Q18394009','Renato Sanches',array['Paris Saint-Germain','Bayern Munich','Benfica','Roma']),
-- https://www.wikidata.org/wiki/Q184177
 ('wd-Q184177','Thomas Vermaelen',array['Arsenal','Barcelona','Ajax','Roma']),
-- https://www.wikidata.org/wiki/Q184218
 ('wd-Q184218','Ryan Babel',array['Liverpool','Galatasaray','Beşiktaş','Ajax']),
-- https://www.wikidata.org/wiki/Q184362
 ('wd-Q184362','Claude Makelélé',array['Chelsea','Real Madrid','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q185650
 ('wd-Q185650','Nigel de Jong',array['Galatasaray','AC Milan','Ajax','Manchester City']),
-- https://www.wikidata.org/wiki/Q186071
 ('wd-Q186071','Javier Saviola',array['Real Madrid','Barcelona','Benfica','Sevilla']),
-- https://www.wikidata.org/wiki/Q187171
 ('wd-Q187171','Mario Mandžukić',array['AC Milan','Juventus','Bayern Munich','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q188696
 ('wd-Q188696','Christian Vieri',array['AC Milan','Inter','Juventus','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q188720
 ('wd-Q188720','Michael Laudrup',array['Real Madrid','Barcelona','Juventus','Ajax']),
-- https://www.wikidata.org/wiki/Q18881
 ('wd-Q18881','Aly Cissokho',array['Liverpool','Porto','Valencia','Lyon']),
-- https://www.wikidata.org/wiki/Q188997
 ('wd-Q188997','Wojciech Szczęsny',array['Arsenal','Barcelona','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q1894
 ('wd-Q1894','Memphis Depay',array['Manchester United','Barcelona','Atlético Madrid','Lyon']),
-- https://www.wikidata.org/wiki/Q18962
 ('wd-Q18962','Adrien Rabiot',array['AC Milan','Juventus','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q19116103
 ('wd-Q19116103','André Onana',array['Manchester United','Trabzonspor','Inter','Ajax']),
-- https://www.wikidata.org/wiki/Q191848
 ('wd-Q191848','Khalid Boulahrouz',array['Chelsea','Sporting CP','Sevilla','Feyenoord']),
-- https://www.wikidata.org/wiki/Q191885
 ('wd-Q191885','Thiago Motta',array['Barcelona','Inter','Paris Saint-Germain','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q1920
 ('wd-Q1920','Samir Nasri',array['Arsenal','Manchester City','Sevilla','Marseille']),
-- https://www.wikidata.org/wiki/Q192565
 ('wd-Q192565','João Pereira',array['Trabzonspor','Benfica','Sporting CP','Valencia']),
-- https://www.wikidata.org/wiki/Q192671
 ('wd-Q192671','Arturo Vidal',array['Barcelona','Inter','Juventus','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q1928
 ('wd-Q1928','Hatem Ben Arfa',array['Paris Saint-Germain','Lyon','Marseille','Newcastle United']),
-- https://www.wikidata.org/wiki/Q192986
 ('wd-Q192986','John Carew',array['Beşiktaş','Roma','Valencia','Lyon']),
-- https://www.wikidata.org/wiki/Q19367
 ('wd-Q19367','Juan Bernat',array['Paris Saint-Germain','Bayern Munich','Benfica','Valencia']),
-- https://www.wikidata.org/wiki/Q193706
 ('wd-Q193706','David Luiz',array['Arsenal','Chelsea','Paris Saint-Germain','Benfica']),
-- https://www.wikidata.org/wiki/Q19392
 ('wd-Q19392','Éver Banega',array['Inter','Atlético Madrid','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q194579
 ('wd-Q194579','Lucas Ocampos',array['AC Milan','Ajax','Sevilla','Marseille']),
-- https://www.wikidata.org/wiki/Q19613570
 ('wd-Q19613570','Cengiz Ünder',array['Fenerbahçe','Beşiktaş','Roma','Marseille']),
-- https://www.wikidata.org/wiki/Q204059
 ('wd-Q204059','Mateja Kežman',array['Chelsea','Fenerbahçe','Paris Saint-Germain','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q204141
 ('wd-Q204141','Christian Poulsen',array['Liverpool','Juventus','Ajax','Sevilla']),
-- https://www.wikidata.org/wiki/Q204895
 ('wd-Q204895','Júlio Baptista',array['Arsenal','Real Madrid','Roma','Sevilla']),
-- https://www.wikidata.org/wiki/Q208050
 ('wd-Q208050','Leonardo Bonucci',array['Fenerbahçe','AC Milan','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q208638
 ('wd-Q208638','Simon Kjær',array['Fenerbahçe','AC Milan','Roma','Sevilla']),
-- https://www.wikidata.org/wiki/Q210453
 ('wd-Q210453','Thiago Emiliano da Silva',array['Chelsea','AC Milan','Paris Saint-Germain','Porto']),
-- https://www.wikidata.org/wiki/Q210916
 ('wd-Q210916','Álvaro Negredo',array['Beşiktaş','Manchester City','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q212854
 ('wd-Q212854','Brian Laudrup',array['Chelsea','AC Milan','Ajax','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q214513
 ('wd-Q214513','Mark Hughes',array['Manchester United','Chelsea','Barcelona','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q215952
 ('wd-Q215952','Emerson Ferreira da Rosa',array['Real Madrid','AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q216928
 ('wd-Q216928','Andrew Cole',array['Manchester United','Arsenal','Manchester City','Newcastle United']),
-- https://www.wikidata.org/wiki/Q219618
 ('wd-Q219618','Morgan De Sanctis',array['Galatasaray','Juventus','Roma','Sevilla']),
-- https://www.wikidata.org/wiki/Q219771
 ('wd-Q219771','Ludovic Giuly',array['Barcelona','Paris Saint-Germain','Roma','Lyon']),
-- https://www.wikidata.org/wiki/Q222231
 ('wd-Q222231','Daniel Sturridge',array['Chelsea','Liverpool','Trabzonspor','Manchester City']),
-- https://www.wikidata.org/wiki/Q2307574
 ('wd-Q2307574','Emílio Peixe',array['Porto','Benfica','Sporting CP','Sevilla']),
-- https://www.wikidata.org/wiki/Q24050378
 ('wd-Q24050378','Tammy Abraham',array['Chelsea','Beşiktaş','AC Milan','Roma']),
-- https://www.wikidata.org/wiki/Q245054
 ('wd-Q245054','Fabio Borini',array['Chelsea','Liverpool','AC Milan','Roma']),
-- https://www.wikidata.org/wiki/Q252190
 ('wd-Q252190','Xherdan Shaqiri',array['Liverpool','Inter','Bayern Munich','Lyon']),
-- https://www.wikidata.org/wiki/Q26259982
 ('wd-Q26259982','Matthijs de Ligt',array['Manchester United','Juventus','Ajax','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q26517
 ('wd-Q26517','Luis Suárez',array['Liverpool','Barcelona','Ajax','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q26932598
 ('wd-Q26932598','Achraf Hakimi',array['Real Madrid','Inter','Paris Saint-Germain','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q271615
 ('wd-Q271615','Boudewijn Zenden',array['Chelsea','Liverpool','Barcelona','Marseille']),
-- https://www.wikidata.org/wiki/Q27694
 ('wd-Q27694','Emre Can',array['Liverpool','Juventus','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q294806
 ('wd-Q294806','César Azpilicueta',array['Chelsea','Atlético Madrid','Sevilla','Marseille']),
-- https://www.wikidata.org/wiki/Q295637
 ('wd-Q295637','Victor Moses',array['Chelsea','Liverpool','Fenerbahçe','Inter']),
-- https://www.wikidata.org/wiki/Q311872
 ('wd-Q311872','Philippe Coutinho',array['Liverpool','Barcelona','Inter','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q313911
 ('wd-Q313911','Luuk de Jong',array['Barcelona','Porto','Sevilla','Newcastle United']),
-- https://www.wikidata.org/wiki/Q313927
 ('wd-Q313927','Pablo Osvaldo',array['Inter','Juventus','Porto','Roma']),
-- https://www.wikidata.org/wiki/Q314028
 ('wd-Q314028','Kévin Gameiro',array['Paris Saint-Germain','Atlético Madrid','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q3163157
 ('wd-Q3163157','Javier Manquillo',array['Liverpool','Atlético Madrid','Marseille','Newcastle United']),
-- https://www.wikidata.org/wiki/Q348199
 ('wd-Q348199','Mehmet Topal',array['Galatasaray','Fenerbahçe','Beşiktaş','Valencia']),
-- https://www.wikidata.org/wiki/Q351797
 ('wd-Q351797','Emiliano Insúa',array['Liverpool','Galatasaray','Sporting CP','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q352820
 ('wd-Q352820','Ray Wilkins',array['Manchester United','Chelsea','AC Milan','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q42731
 ('wd-Q42731','Fernando Torres',array['Chelsea','Liverpool','AC Milan','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q437329
 ('wd-Q437329','Danilo Luiz da Silva',array['Real Madrid','Juventus','Porto','Manchester City']),
-- https://www.wikidata.org/wiki/Q44297797
 ('wd-Q44297797','Ferran Torres',array['Barcelona','Paris Saint-Germain','Manchester City','Valencia']),
-- https://www.wikidata.org/wiki/Q45567
 ('wd-Q45567','Fernando Morientes',array['Liverpool','Real Madrid','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q456617
 ('wd-Q456617','Nolito',array['Barcelona','Benfica','Manchester City','Sevilla']),
-- https://www.wikidata.org/wiki/Q458101
 ('wd-Q458101','Ciro Immobile',array['Beşiktaş','Juventus','Borussia Dortmund','Sevilla']),
-- https://www.wikidata.org/wiki/Q460700
 ('wd-Q460700','Jocelyn Angloma',array['Inter','Paris Saint-Germain','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q482947
 ('wd-Q482947','Nani',array['Manchester United','Fenerbahçe','Sporting CP','Valencia']),
-- https://www.wikidata.org/wiki/Q483145
 ('wd-Q483145','Luís Figo',array['Real Madrid','Barcelona','Inter','Sporting CP']),
-- https://www.wikidata.org/wiki/Q483846
 ('wd-Q483846','Gonzalo Higuaín',array['Chelsea','Real Madrid','AC Milan','Juventus']),
-- https://www.wikidata.org/wiki/Q484909
 ('wd-Q484909','Clarence Seedorf',array['Real Madrid','AC Milan','Inter','Ajax']),
-- https://www.wikidata.org/wiki/Q5024
 ('wd-Q5024','Abel Xavier',array['Liverpool','Galatasaray','Benfica','Roma']),
-- https://www.wikidata.org/wiki/Q508711
 ('wd-Q508711','Didier Deschamps',array['Chelsea','Juventus','Valencia','Marseille']),
-- https://www.wikidata.org/wiki/Q529207
 ('wd-Q529207','Ronaldo',array['Real Madrid','Barcelona','AC Milan','Inter']),
-- https://www.wikidata.org/wiki/Q5370912
 ('wd-Q5370912','Emerson Palmieri',array['Chelsea','Roma','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q62227
 ('wd-Q62227','Juan Esnáider',array['Real Madrid','Juventus','Porto','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q6298271
 ('wd-Q6298271','João Mário',array['Beşiktaş','Inter','Benfica','Sporting CP']),
-- https://www.wikidata.org/wiki/Q701297
 ('wd-Q701297','Mateo Kovačić',array['Chelsea','Real Madrid','Inter','Manchester City']),
-- https://www.wikidata.org/wiki/Q708079
 ('wd-Q708079','Bruno N''Gotty',array['AC Milan','Paris Saint-Germain','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q744556
 ('wd-Q744556','Daniel da Cruz Carvalho',array['Ajax','Benfica','Sporting CP','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q75857
 ('wd-Q75857','Nuri Şahin',array['Liverpool','Real Madrid','Borussia Dortmund','Feyenoord']),
-- https://www.wikidata.org/wiki/Q919720
 ('wd-Q919720','Miquel Soler',array['Real Madrid','Barcelona','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q969520
 ('wd-Q969520','Michael Essien',array['Chelsea','Real Madrid','AC Milan','Lyon']),
-- https://www.wikidata.org/wiki/Q973416
 ('wd-Q973416','Fernando Francisco Reges',array['Galatasaray','Porto','Manchester City','Sevilla']),
-- https://www.wikidata.org/wiki/Q102027
 ('wd-Q102027','Fabio Cannavaro',array['Real Madrid','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q1042676
 ('wd-Q1042676','Carlos Alhinho',array['Porto','Benfica','Sporting CP']),
-- https://www.wikidata.org/wiki/Q10490646
 ('wd-Q10490646','Dinu Sânmărtean',array['Real Madrid','Bayern Munich','Manchester City']),
-- https://www.wikidata.org/wiki/Q10504661
 ('wd-Q10504661','Romeu Silva',array['Porto','Benfica','Sporting CP']),
-- https://www.wikidata.org/wiki/Q10556350
 ('wd-Q10556350','Mariano Díaz Mejía',array['Real Madrid','Sevilla','Lyon']),
-- https://www.wikidata.org/wiki/Q106625792
 ('wd-Q106625792','Nicolás González Iglesias',array['Barcelona','Manchester City','Valencia']),
-- https://www.wikidata.org/wiki/Q106691309
 ('wd-Q106691309','Cher Ndour',array['Beşiktaş','Paris Saint-Germain','Benfica']),
-- https://www.wikidata.org/wiki/Q107089
 ('wd-Q107089','Robert Enke',array['Barcelona','Fenerbahçe','Benfica']),
-- https://www.wikidata.org/wiki/Q1083975
 ('wd-Q1083975','Aldo Bet',array['AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q109428
 ('wd-Q109428','Diego Ribas da Cunha',array['Juventus','Porto','Atlético Madrid','Fenerbahçe']),
-- https://www.wikidata.org/wiki/Q110053
 ('wd-Q110053','Mats Hummels',array['Bayern Munich','Roma','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q1114411
 ('wd-Q1114411','Egemen Korkmaz',array['Fenerbahçe','Beşiktaş','Trabzonspor']),
-- https://www.wikidata.org/wiki/Q112184628
 ('wd-Q112184628','Dean Huijsen',array['Real Madrid','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q1170553
 ('wd-Q1170553','Enrico Candiani',array['AC Milan','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q1175706
 ('wd-Q1175706','Dave Mitchell',array['Chelsea','Feyenoord','Newcastle United']),
-- https://www.wikidata.org/wiki/Q118942
 ('wd-Q118942','Frank Stapleton',array['Manchester United','Arsenal','Ajax']),
-- https://www.wikidata.org/wiki/Q119562
 ('wd-Q119562','Sergio Agüero',array['Barcelona','Atlético Madrid','Manchester City']),
-- https://www.wikidata.org/wiki/Q11966
 ('wd-Q11966','Bafétimbi Gomis',array['Galatasaray','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q12386093
 ('wd-Q12386093','José María Martín Rodríguez',array['Barcelona','Atlético Madrid','Valencia']),
-- https://www.wikidata.org/wiki/Q1255421
 ('wd-Q1255421','Tschen La Ling',array['Ajax','Marseille','Feyenoord']),
-- https://www.wikidata.org/wiki/Q128719
 ('wd-Q128719','Jasper Cillessen',array['Barcelona','Ajax','Valencia']),
-- https://www.wikidata.org/wiki/Q128912
 ('wd-Q128912','Daley Blind',array['Manchester United','Ajax','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q1294326
 ('wd-Q1294326','Tibor Szalay',array['Barcelona','Beşiktaş','Sevilla']),
-- https://www.wikidata.org/wiki/Q133556
 ('wd-Q133556','Ashley Cole',array['Arsenal','Chelsea','Roma']),
-- https://www.wikidata.org/wiki/Q1337309
 ('wd-Q1337309','Luciano Spinosi',array['AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q13488
 ('wd-Q13488','Grégory Coupet',array['Paris Saint-Germain','Atlético Madrid','Lyon']),
-- https://www.wikidata.org/wiki/Q13494
 ('wd-Q13494','Jean-Pierre Papin',array['AC Milan','Bayern Munich','Marseille']),
-- https://www.wikidata.org/wiki/Q1354960
 ('wd-Q1354960','Muhammed Salah',array['Chelsea','Liverpool','Roma']),
-- https://www.wikidata.org/wiki/Q1360075
 ('wd-Q1360075','Laurent Fournier',array['Paris Saint-Germain','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q136986
 ('wd-Q136986','Mauro Icardi',array['Galatasaray','Inter','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q137231
 ('wd-Q137231','Arkadiusz Milik',array['Juventus','Ajax','Marseille']),
-- https://www.wikidata.org/wiki/Q1374415
 ('wd-Q1374415','Eurico Gomes',array['Porto','Benfica','Sporting CP']),
-- https://www.wikidata.org/wiki/Q13780454
 ('wd-Q13780454','Mario Lemina',array['Galatasaray','Juventus','Marseille']),
-- https://www.wikidata.org/wiki/Q1385196
 ('wd-Q1385196','Luigi Cevenini',array['AC Milan','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q1388915
 ('wd-Q1388915','Pascal Nouma',array['Beşiktaş','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q1449429
 ('wd-Q1449429','Dario Bonetti',array['AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q1450945
 ('wd-Q1450945','Valentino Lazaro',array['Inter','Benfica','Newcastle United']),
-- https://www.wikidata.org/wiki/Q14558450
 ('wd-Q14558450','Adnan Januzaj',array['Manchester United','Borussia Dortmund','Sevilla']),
-- https://www.wikidata.org/wiki/Q147589
 ('wd-Q147589','Kolo Touré',array['Arsenal','Liverpool','Manchester City']),
-- https://www.wikidata.org/wiki/Q14947422
 ('wd-Q14947422','Héctor Bellerín',array['Arsenal','Barcelona','Sporting CP']),
-- https://www.wikidata.org/wiki/Q150921
 ('wd-Q150921','Marko Marin',array['Chelsea','Trabzonspor','Sevilla']),
-- https://www.wikidata.org/wiki/Q15113616
 ('wd-Q15113616','André Silva',array['AC Milan','Porto','Sevilla']),
-- https://www.wikidata.org/wiki/Q151260
 ('wd-Q151260','Jérôme Boateng',array['Bayern Munich','Manchester City','Lyon']),
-- https://www.wikidata.org/wiki/Q151269
 ('wd-Q151269','Robert Lewandowski',array['Barcelona','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q151838
 ('wd-Q151838','Axel Witsel',array['Benfica','Atlético Madrid','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q151853
 ('wd-Q151853','Mark van Bommel',array['Barcelona','AC Milan','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q154708
 ('wd-Q154708','Shinji Kagawa',array['Manchester United','Beşiktaş','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q15521306
 ('wd-Q15521306','Bernardo Silva',array['Real Madrid','Benfica','Manchester City']),
-- https://www.wikidata.org/wiki/Q155884
 ('wd-Q155884','Christian Ziege',array['Liverpool','AC Milan','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q155911
 ('wd-Q155911','Thomas Häßler',array['Juventus','Roma','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q156822
 ('wd-Q156822','Lúcio',array['Inter','Juventus','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q157847
 ('wd-Q157847','Harald Schumacher',array['Fenerbahçe','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q15963931
 ('wd-Q15963931','Munir El Haddadi',array['Barcelona','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q160206
 ('wd-Q160206','Hernán Crespo',array['Chelsea','AC Milan','Inter']),
-- https://www.wikidata.org/wiki/Q161054
 ('wd-Q161054','Ivan Perišić',array['Inter','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q1612196
 ('wd-Q1612196','Celestino Celio',array['AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q16148978
 ('wd-Q16148978','Marco Asensio',array['Real Madrid','Fenerbahçe','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q16236859
 ('wd-Q16236859','Clément Lenglet',array['Barcelona','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q162892
 ('wd-Q162892','Luis del Sol',array['Real Madrid','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q16302330
 ('wd-Q16302330','Lucas Torreira',array['Arsenal','Galatasaray','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q16499882
 ('wd-Q16499882','Leroy Sané',array['Galatasaray','Bayern Munich','Manchester City']),
-- https://www.wikidata.org/wiki/Q165125
 ('wd-Q165125','Javier Hernández Balcázar',array['Manchester United','Real Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q16724213
 ('wd-Q16724213','Roman Yaremçuk',array['Benfica','Valencia','Lyon']),
-- https://www.wikidata.org/wiki/Q16729477
 ('wd-Q16729477','Gonçalo Guedes',array['Paris Saint-Germain','Benfica','Valencia']),
-- https://www.wikidata.org/wiki/Q167790
 ('wd-Q167790','Edinson Cavani',array['Manchester United','Paris Saint-Germain','Valencia']),
-- https://www.wikidata.org/wiki/Q16979983
 ('wd-Q16979983','Luka Jović',array['Real Madrid','AC Milan','Benfica']),
-- https://www.wikidata.org/wiki/Q17163
 ('wd-Q17163','Johan Cruyff',array['Barcelona','Ajax','Feyenoord']),
-- https://www.wikidata.org/wiki/Q172149
 ('wd-Q172149','Hugo Leal',array['Paris Saint-Germain','Porto','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q173360
 ('wd-Q173360','Giovanni van Bronckhorst',array['Arsenal','Barcelona','Feyenoord']),
-- https://www.wikidata.org/wiki/Q173972
 ('wd-Q173972','Ruud Gullit',array['Chelsea','AC Milan','Feyenoord']),
-- https://www.wikidata.org/wiki/Q17493
 ('wd-Q17493','Thiago Alcántara',array['Liverpool','Barcelona','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q17612631
 ('wd-Q17612631','Mikel Merino',array['Arsenal','Borussia Dortmund','Newcastle United']),
-- https://www.wikidata.org/wiki/Q177343
 ('wd-Q177343','Mikaël Silvestre',array['Manchester United','Arsenal','Inter']),
-- https://www.wikidata.org/wiki/Q177686
 ('wd-Q177686','Maicon Douglas Sisenando',array['Inter','Roma','Manchester City']),
-- https://www.wikidata.org/wiki/Q179334
 ('wd-Q179334','Henrik Larsson',array['Manchester United','Barcelona','Feyenoord']),
-- https://www.wikidata.org/wiki/Q179773
 ('wd-Q179773','Pedro Rodríguez Ledesma',array['Chelsea','Barcelona','Roma']),
-- https://www.wikidata.org/wiki/Q1801340
 ('wd-Q1801340','Daniel Kenedy',array['Paris Saint-Germain','Porto','Benfica']),
-- https://www.wikidata.org/wiki/Q180581
 ('wd-Q180581','Milan Baroš',array['Liverpool','Galatasaray','Lyon']),
-- https://www.wikidata.org/wiki/Q182314
 ('wd-Q182314','Peter Schmeichel',array['Manchester United','Sporting CP','Manchester City']),
-- https://www.wikidata.org/wiki/Q182907
 ('wd-Q182907','Gianluca Zambrotta',array['Barcelona','AC Milan','Juventus']),
-- https://www.wikidata.org/wiki/Q183108
 ('wd-Q183108','Fabio Capello',array['AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q18428483
 ('wd-Q18428483','Sofyan Amrabat',array['Manchester United','Fenerbahçe','Feyenoord']),
-- https://www.wikidata.org/wiki/Q185389
 ('wd-Q185389','Dennis Bergkamp',array['Arsenal','Inter','Ajax']),
-- https://www.wikidata.org/wiki/Q18614641
 ('wd-Q18614641','Ainsley Maitland-Niles',array['Arsenal','Roma','Lyon']),
-- https://www.wikidata.org/wiki/Q18637352
 ('wd-Q18637352','Eric Bailly',array['Manchester United','Beşiktaş','Marseille']),
-- https://www.wikidata.org/wiki/Q186415
 ('wd-Q186415','Carlos Marchena',array['Benfica','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q186478
 ('wd-Q186478','Luca Toni',array['Juventus','Bayern Munich','Roma']),
-- https://www.wikidata.org/wiki/Q187426
 ('wd-Q187426','Fernando Gago',array['Real Madrid','Roma','Valencia']),
-- https://www.wikidata.org/wiki/Q187450
 ('wd-Q187450','Philippe Senderos',array['Arsenal','AC Milan','Valencia']),
-- https://www.wikidata.org/wiki/Q1876270
 ('wd-Q1876270','Luigi Sartor',array['Inter','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q188457
 ('wd-Q188457','Danny Welbeck',array['Manchester United','Arsenal','Chelsea']),
-- https://www.wikidata.org/wiki/Q189217
 ('wd-Q189217','Davor Šuker',array['Arsenal','Real Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q18924954
 ('wd-Q18924954','Lucas Hernández',array['Paris Saint-Germain','Bayern Munich','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q189449
 ('wd-Q189449','Yosi Benayun',array['Arsenal','Chelsea','Liverpool']),
-- https://www.wikidata.org/wiki/Q189892
 ('wd-Q189892','Gheorghe Hagi',array['Real Madrid','Barcelona','Galatasaray']),
-- https://www.wikidata.org/wiki/Q190515
 ('wd-Q190515','Craig Bellamy',array['Liverpool','Manchester City','Newcastle United']),
-- https://www.wikidata.org/wiki/Q190651
 ('wd-Q190651','Jerzy Dudek',array['Liverpool','Real Madrid','Feyenoord']),
-- https://www.wikidata.org/wiki/Q1911
 ('wd-Q1911','Olivier Giroud',array['Arsenal','Chelsea','AC Milan']),
-- https://www.wikidata.org/wiki/Q191136
 ('wd-Q191136','James Milner',array['Liverpool','Manchester City','Newcastle United']),
-- https://www.wikidata.org/wiki/Q1913
 ('wd-Q1913','Florent Malouda',array['Chelsea','Trabzonspor','Lyon']),
-- https://www.wikidata.org/wiki/Q1916
 ('wd-Q1916','Patrice Évra',array['Manchester United','Juventus','Marseille']),
-- https://www.wikidata.org/wiki/Q1918
 ('wd-Q1918','Franck Ribéry',array['Galatasaray','Bayern Munich','Marseille']),
-- https://www.wikidata.org/wiki/Q1919
 ('wd-Q1919','Mathieu Valbuena',array['Fenerbahçe','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q192035
 ('wd-Q192035','Iván Zamorano',array['Real Madrid','Inter','Sevilla']),
-- https://www.wikidata.org/wiki/Q192131
 ('wd-Q192131','Giuseppe Meazza',array['AC Milan','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q1923
 ('wd-Q1923','Jérémy Ménez',array['AC Milan','Paris Saint-Germain','Roma']),
-- https://www.wikidata.org/wiki/Q192635
 ('wd-Q192635','Ronald Koeman',array['Barcelona','Ajax','Feyenoord']),
-- https://www.wikidata.org/wiki/Q192923
 ('wd-Q192923','Sokratis Papastathopoulos',array['Arsenal','AC Milan','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q193625
 ('wd-Q193625','Marcel Desailly',array['Chelsea','AC Milan','Marseille']),
-- https://www.wikidata.org/wiki/Q1937
 ('wd-Q1937','William Gallas',array['Arsenal','Chelsea','Marseille']),
-- https://www.wikidata.org/wiki/Q193702
 ('wd-Q193702','Walter Samuel',array['Real Madrid','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q194107
 ('wd-Q194107','Martín Cáceres',array['Barcelona','Juventus','Sevilla']),
-- https://www.wikidata.org/wiki/Q194149
 ('wd-Q194149','Alex Oxlade-Chamberlain',array['Arsenal','Liverpool','Beşiktaş']),
-- https://www.wikidata.org/wiki/Q1942
 ('wd-Q1942','Sébastien Squillaci',array['Arsenal','Sevilla','Lyon']),
-- https://www.wikidata.org/wiki/Q19599124
 ('wd-Q19599124','Benjamin Pavard',array['Inter','Bayern Munich','Marseille']),
-- https://www.wikidata.org/wiki/Q19708656
 ('wd-Q19708656','Gabriel Jesus',array['Arsenal','Barcelona','Manchester City']),
-- https://www.wikidata.org/wiki/Q1988686
 ('wd-Q1988686','Douglas Pereira dos Santos',array['Barcelona','Beşiktaş','Benfica']),
-- https://www.wikidata.org/wiki/Q19938984
 ('wd-Q19938984','Manuel Akanji',array['Inter','Manchester City','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q201367
 ('wd-Q201367','Gregory van der Wiel',array['Fenerbahçe','Ajax','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q201900
 ('wd-Q201900','Rüştü Reçber',array['Barcelona','Fenerbahçe','Beşiktaş']),
-- https://www.wikidata.org/wiki/Q202329
 ('wd-Q202329','Joey Barton',array['Manchester City','Marseille','Newcastle United']),
-- https://www.wikidata.org/wiki/Q202645
 ('wd-Q202645','Adrian Mutu',array['Chelsea','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q2036160
 ('wd-Q2036160','Thomas Meunier',array['Trabzonspor','Paris Saint-Germain','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q203657
 ('wd-Q203657','Jon Dahl Tomasson',array['AC Milan','Feyenoord','Newcastle United']),
-- https://www.wikidata.org/wiki/Q2036850
 ('wd-Q2036850','Mustafa Yücedağ',array['Galatasaray','Fenerbahçe','Ajax']),
-- https://www.wikidata.org/wiki/Q204230
 ('wd-Q204230','Geremi Njitap',array['Chelsea','Real Madrid','Newcastle United']),
-- https://www.wikidata.org/wiki/Q204450
 ('wd-Q204450','Felipe Melo',array['Galatasaray','Inter','Juventus']),
-- https://www.wikidata.org/wiki/Q204848
 ('wd-Q204848','Mathieu Flamini',array['Arsenal','AC Milan','Marseille']),
-- https://www.wikidata.org/wiki/Q20688718
 ('wd-Q20688718','Angeliño',array['Galatasaray','Roma','Manchester City']),
-- https://www.wikidata.org/wiki/Q207186
 ('wd-Q207186','Zlatko Zahovič',array['Porto','Benfica','Valencia']),
-- https://www.wikidata.org/wiki/Q208025
 ('wd-Q208025','Gervinho',array['Arsenal','Trabzonspor','Roma']),
-- https://www.wikidata.org/wiki/Q208104
 ('wd-Q208104','Xabi Alonso',array['Liverpool','Real Madrid','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q20830808
 ('wd-Q20830808','Gianluigi Donnarumma',array['AC Milan','Paris Saint-Germain','Manchester City']),
-- https://www.wikidata.org/wiki/Q20851003
 ('wd-Q20851003','Ousmane Dembélé',array['Barcelona','Paris Saint-Germain','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q2091463
 ('wd-Q2091463','Anthony Martial',array['Manchester United','Sevilla','Lyon']),
-- https://www.wikidata.org/wiki/Q2092171
 ('wd-Q2092171','Denis Suárez',array['Arsenal','Barcelona','Sevilla']),
-- https://www.wikidata.org/wiki/Q209650
 ('wd-Q209650','Jari Litmanen',array['Liverpool','Barcelona','Ajax']),
-- https://www.wikidata.org/wiki/Q20994118
 ('wd-Q20994118','Rodri',array['Barcelona','Atlético Madrid','Manchester City']),
-- https://www.wikidata.org/wiki/Q210491
 ('wd-Q210491','Cristian Chivu',array['Inter','Ajax','Roma']),
-- https://www.wikidata.org/wiki/Q211451
 ('wd-Q211451','Aleksandar Kolarov',array['Inter','Roma','Manchester City']),
-- https://www.wikidata.org/wiki/Q211996
 ('wd-Q211996','José Bosingwa',array['Chelsea','Trabzonspor','Porto']),
-- https://www.wikidata.org/wiki/Q214117
 ('wd-Q214117','Hélder Postiga',array['Porto','Sporting CP','Valencia']),
-- https://www.wikidata.org/wiki/Q215435
 ('wd-Q215435','Albert Riera',array['Liverpool','Galatasaray','Manchester City']),
-- https://www.wikidata.org/wiki/Q215533
 ('wd-Q215533','Rigobert Song',array['Liverpool','Galatasaray','Trabzonspor']),
-- https://www.wikidata.org/wiki/Q216142
 ('wd-Q216142','Alex Rodrigo Dias da Costa',array['Chelsea','AC Milan','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q216260
 ('wd-Q216260','Hedwiges Maduro',array['Ajax','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q216917
 ('wd-Q216917','Jaap Stam',array['Manchester United','AC Milan','Ajax']),
-- https://www.wikidata.org/wiki/Q21693199
 ('wd-Q21693199','Christopher Nkunku',array['Chelsea','AC Milan','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q217760
 ('wd-Q217760','Sylvain Wiltord',array['Arsenal','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q218401
 ('wd-Q218401','Roberto Soldado',array['Real Madrid','Fenerbahçe','Valencia']),
-- https://www.wikidata.org/wiki/Q219248
 ('wd-Q219248','Marc Overmars',array['Arsenal','Barcelona','Ajax']),
-- https://www.wikidata.org/wiki/Q219354
 ('wd-Q219354','Ian Rush',array['Liverpool','Juventus','Newcastle United']),
-- https://www.wikidata.org/wiki/Q219657
 ('wd-Q219657','Frank de Boer',array['Barcelona','Galatasaray','Ajax']),
-- https://www.wikidata.org/wiki/Q219884
 ('wd-Q219884','Stefan Savić',array['Trabzonspor','Atlético Madrid','Manchester City']),
-- https://www.wikidata.org/wiki/Q22007007
 ('wd-Q22007007','Emre Mor',array['Galatasaray','Fenerbahçe','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q2202196
 ('wd-Q2202196','Sebastián Losada',array['Real Madrid','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q220746
 ('wd-Q220746','Juan Pablo Sorín',array['Barcelona','Juventus','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q22279773
 ('wd-Q22279773','Christian Pulisic',array['Chelsea','AC Milan','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q2276748
 ('wd-Q2276748','Juan Carlos Rodríguez',array['Barcelona','Atlético Madrid','Valencia']),
-- https://www.wikidata.org/wiki/Q230529
 ('wd-Q230529','Fabio Grosso',array['Inter','Juventus','Lyon']),
-- https://www.wikidata.org/wiki/Q2319669
 ('wd-Q2319669','Aristide Coscia',array['Inter','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q23759917
 ('wd-Q23759917','Alexander Isak',array['Liverpool','Borussia Dortmund','Newcastle United']),
-- https://www.wikidata.org/wiki/Q2423642
 ('wd-Q2423642','Daniel Xuereb',array['Paris Saint-Germain','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q24258610
 ('wd-Q24258610','Sergio Reguilón',array['Manchester United','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q245011
 ('wd-Q245011','Demetrio Albertini',array['Barcelona','AC Milan','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q2455284
 ('wd-Q2455284','Júlio César Santos Correa',array['Real Madrid','AC Milan','Benfica']),
-- https://www.wikidata.org/wiki/Q246417
 ('wd-Q246417','Denis Cheryshev',array['Real Madrid','Sevilla','Valencia']),
-- https://www.wikidata.org/wiki/Q250962
 ('wd-Q250962','Geovanni Deiberson Maurício',array['Barcelona','Benfica','Manchester City']),
-- https://www.wikidata.org/wiki/Q252596
 ('wd-Q252596','Martín Montoya',array['Barcelona','Inter','Valencia']),
-- https://www.wikidata.org/wiki/Q258115
 ('wd-Q258115','Diego Simeone',array['Inter','Atlético Madrid','Sevilla']),
-- https://www.wikidata.org/wiki/Q26069
 ('wd-Q26069','Klaas-Jan Huntelaar',array['Real Madrid','AC Milan','Ajax']),
-- https://www.wikidata.org/wiki/Q261534
 ('wd-Q261534','Diego Forlán',array['Manchester United','Inter','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q26255506
 ('wd-Q26255506','Diogo Dalot',array['Manchester United','AC Milan','Porto']),
-- https://www.wikidata.org/wiki/Q2658719
 ('wd-Q2658719','Robert McDonald',array['Beşiktaş','Sporting CP','Newcastle United']),
-- https://www.wikidata.org/wiki/Q26973015
 ('wd-Q26973015','Brahim Abdelkader Díaz',array['Real Madrid','AC Milan','Manchester City']),
-- https://www.wikidata.org/wiki/Q269883
 ('wd-Q269883','Emmanuel Petit',array['Arsenal','Chelsea','Barcelona']),
-- https://www.wikidata.org/wiki/Q2707459
 ('wd-Q2707459','Kaba Diawara',array['Arsenal','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q271882
 ('wd-Q271882','Robert Kovač',array['Juventus','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q273715
 ('wd-Q273715','Jordan Henderson',array['Chelsea','Liverpool','Ajax']),
-- https://www.wikidata.org/wiki/Q274268
 ('wd-Q274268','Édouard Cissé',array['Beşiktaş','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q274523
 ('wd-Q274523','Oriol Romeu',array['Chelsea','Barcelona','Valencia']),
-- https://www.wikidata.org/wiki/Q275823
 ('wd-Q275823','Michael Thomas',array['Arsenal','Liverpool','Benfica']),
-- https://www.wikidata.org/wiki/Q276157
 ('wd-Q276157','Barry Venison',array['Liverpool','Galatasaray','Newcastle United']),
-- https://www.wikidata.org/wiki/Q27663808
 ('wd-Q27663808','Matteo Guendouzi',array['Arsenal','Fenerbahçe','Marseille']),
-- https://www.wikidata.org/wiki/Q279673
 ('wd-Q279673','Pablo Gabriel García',array['Real Madrid','AC Milan','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q281734
 ('wd-Q281734','Yūto Nagatomo',array['Galatasaray','Inter','Marseille']),
-- https://www.wikidata.org/wiki/Q282463
 ('wd-Q282463','Jean-Alain Boumsong',array['Juventus','Lyon','Newcastle United']),
-- https://www.wikidata.org/wiki/Q2831818
 ('wd-Q2831818','Alberto Piccinini',array['AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q28531111
 ('wd-Q28531111','Luis Díaz',array['Liverpool','Bayern Munich','Porto']),
-- https://www.wikidata.org/wiki/Q294387
 ('wd-Q294387','Mido',array['Ajax','Roma','Marseille']),
-- https://www.wikidata.org/wiki/Q294501
 ('wd-Q294501','Steve McManaman',array['Liverpool','Real Madrid','Manchester City']),
-- https://www.wikidata.org/wiki/Q294541
 ('wd-Q294541','Stevan Jovetić',array['Inter','Manchester City','Sevilla']),
-- https://www.wikidata.org/wiki/Q294565
 ('wd-Q294565','Angelo Peruzzi',array['Inter','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q294951
 ('wd-Q294951','Christian Eriksen',array['Manchester United','Inter','Ajax']),
-- https://www.wikidata.org/wiki/Q294963
 ('wd-Q294963','Hugo Viana',array['Sporting CP','Valencia','Newcastle United']),
-- https://www.wikidata.org/wiki/Q295416
 ('wd-Q295416','Luis García',array['Liverpool','Barcelona','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q295512
 ('wd-Q295512','Carlos Gamarra',array['Inter','Benfica','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q296222
 ('wd-Q296222','Mauricio Isla',array['Fenerbahçe','Juventus','Marseille']),
-- https://www.wikidata.org/wiki/Q296341
 ('wd-Q296341','Demba Ba',array['Chelsea','Beşiktaş','Newcastle United']),
-- https://www.wikidata.org/wiki/Q296684
 ('wd-Q296684','Ezequiel Garay',array['Real Madrid','Benfica','Valencia']),
-- https://www.wikidata.org/wiki/Q296814
 ('wd-Q296814','Alessandro Mancini',array['AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q296975
 ('wd-Q296975','Iván Helguera',array['Real Madrid','Roma','Valencia']),
-- https://www.wikidata.org/wiki/Q297845
 ('wd-Q297845','Manuel Fernandes',array['Beşiktaş','Benfica','Valencia']),
-- https://www.wikidata.org/wiki/Q298190
 ('wd-Q298190','Robert Prosinečki',array['Real Madrid','Barcelona','Sevilla']),
-- https://www.wikidata.org/wiki/Q298338
 ('wd-Q298338','Vikash Dhorasoo',array['AC Milan','Paris Saint-Germain','Lyon']),
-- https://www.wikidata.org/wiki/Q299244
 ('wd-Q299244','Seydou Doumbia',array['Sporting CP','Roma','Newcastle United']),
-- https://www.wikidata.org/wiki/Q299450
 ('wd-Q299450','Tiago Manuel Dias Correia',array['Manchester United','Beşiktaş','Benfica']),
-- https://www.wikidata.org/wiki/Q299727
 ('wd-Q299727','Rolando',array['Inter','Porto','Marseille']),
-- https://www.wikidata.org/wiki/Q30148558
 ('wd-Q30148558','Jadon Sancho',array['Manchester United','Chelsea','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q302314
 ('wd-Q302314','Pietro Pastore',array['AC Milan','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q308925
 ('wd-Q308925','Jürgen Kohler',array['Juventus','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q310330
 ('wd-Q310330','Javi García',array['Real Madrid','Benfica','Manchester City']),
-- https://www.wikidata.org/wiki/Q310625
 ('wd-Q310625','Marc Bartra',array['Barcelona','Trabzonspor','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q311043
 ('wd-Q311043','Urby Emanuelson',array['AC Milan','Ajax','Roma']),
-- https://www.wikidata.org/wiki/Q311155
 ('wd-Q311155','Lorik Cana',array['Galatasaray','Paris Saint-Germain','Marseille']),
-- https://www.wikidata.org/wiki/Q311171
 ('wd-Q311171','Paul Ince',array['Manchester United','Liverpool','Inter']),
-- https://www.wikidata.org/wiki/Q311368
 ('wd-Q311368','Nikola Kalinić',array['AC Milan','Roma','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q312002
 ('wd-Q312002','Sylvio Mendes Campos Júnior',array['Arsenal','Barcelona','Manchester City']),
-- https://www.wikidata.org/wiki/Q312534
 ('wd-Q312534','Kostas Mitroglou',array['Galatasaray','Benfica','Marseille']),
-- https://www.wikidata.org/wiki/Q312659
 ('wd-Q312659','Pierre van Hooijdonk',array['Fenerbahçe','Benfica','Feyenoord']),
-- https://www.wikidata.org/wiki/Q312892
 ('wd-Q312892','Jérémy Mathieu',array['Barcelona','Sporting CP','Valencia']),
-- https://www.wikidata.org/wiki/Q312928
 ('wd-Q312928','Stéphane Mbia',array['Trabzonspor','Sevilla','Marseille']),
-- https://www.wikidata.org/wiki/Q313131
 ('wd-Q313131','Mauricio Pellegrino',array['Liverpool','Barcelona','Valencia']),
-- https://www.wikidata.org/wiki/Q313145
 ('wd-Q313145','Colin Kâzım-Richards',array['Galatasaray','Fenerbahçe','Feyenoord']),
-- https://www.wikidata.org/wiki/Q313172
 ('wd-Q313172','Julien Escudé',array['Beşiktaş','Ajax','Sevilla']),
-- https://www.wikidata.org/wiki/Q313208
 ('wd-Q313208','Cristiano Zanetti',array['Inter','Juventus','Roma']),
-- https://www.wikidata.org/wiki/Q313382
 ('wd-Q313382','Johnny Rep',array['Ajax','Valencia','Feyenoord']),
-- https://www.wikidata.org/wiki/Q313763
 ('wd-Q313763','George Graham',array['Manchester United','Arsenal','Chelsea']),
-- https://www.wikidata.org/wiki/Q313861
 ('wd-Q313861','Sonny Anderson',array['Barcelona','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q313955
 ('wd-Q313955','António Alberto Bastos Pimparel',array['Porto','Sporting CP','Sevilla']),
-- https://www.wikidata.org/wiki/Q314376
 ('wd-Q314376','Cristian Rodríguez',array['Paris Saint-Germain','Porto','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q314617
 ('wd-Q314617','Diego López Rodríguez',array['Real Madrid','AC Milan','Sevilla']),
-- https://www.wikidata.org/wiki/Q315471
 ('wd-Q315471','Santiago Solari',array['Real Madrid','Inter','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q316695
 ('wd-Q316695','Sylvain Distin',array['Paris Saint-Germain','Manchester City','Newcastle United']),
-- https://www.wikidata.org/wiki/Q317322
 ('wd-Q317322','Alfonso Pérez',array['Real Madrid','Barcelona','Marseille']),
-- https://www.wikidata.org/wiki/Q317612
 ('wd-Q317612','Abdullah Ercan',array['Galatasaray','Fenerbahçe','Trabzonspor']),
-- https://www.wikidata.org/wiki/Q317863
 ('wd-Q317863','Mário Jardel',array['Galatasaray','Porto','Sporting CP']),
-- https://www.wikidata.org/wiki/Q3195361
 ('wd-Q3195361','Kepa Arrizabalaga',array['Arsenal','Chelsea','Real Madrid']),
-- https://www.wikidata.org/wiki/Q326008
 ('wd-Q326008','Saul Malatrasi',array['AC Milan','Inter','Roma']),
-- https://www.wikidata.org/wiki/Q326452
 ('wd-Q326452','Miguel Lopes',array['Porto','Sporting CP','Lyon']),
-- https://www.wikidata.org/wiki/Q327285
 ('wd-Q327285','Stefan Reuter',array['Juventus','Bayern Munich','Borussia Dortmund']),
-- https://www.wikidata.org/wiki/Q327456
 ('wd-Q327456','Hakim Ziyech',array['Chelsea','Galatasaray','Ajax']),
-- https://www.wikidata.org/wiki/Q329451
 ('wd-Q329451','Luiz Gustavo',array['Fenerbahçe','Bayern Munich','Marseille']),
-- https://www.wikidata.org/wiki/Q329524
 ('wd-Q329524','Gary Medel',array['Beşiktaş','Inter','Sevilla']),
-- https://www.wikidata.org/wiki/Q332645
 ('wd-Q332645','Francesco Coco',array['Barcelona','AC Milan','Inter']),
-- https://www.wikidata.org/wiki/Q339252
 ('wd-Q339252','Loris Karius',array['Liverpool','Beşiktaş','Newcastle United']),
-- https://www.wikidata.org/wiki/Q342411
 ('wd-Q342411','Emil Kostadinov',array['Fenerbahçe','Bayern Munich','Porto']),
-- https://www.wikidata.org/wiki/Q342608
 ('wd-Q342608','Peguy Luyindula',array['Paris Saint-Germain','Lyon','Marseille']),
-- https://www.wikidata.org/wiki/Q342707
 ('wd-Q342707','Mamadou Niang',array['Fenerbahçe','Beşiktaş','Marseille']),
-- https://www.wikidata.org/wiki/Q343997
 ('wd-Q343997','Marco Caneira',array['Benfica','Sporting CP','Valencia']),
-- https://www.wikidata.org/wiki/Q83488
 ('wd-Q83488','Mesut Özil',array['Arsenal','Real Madrid','Fenerbahçe']),
-- https://www.wikidata.org/wiki/Q194461
 ('wd-Q194461','Guti',array['Real Madrid','Beşiktaş']),
-- https://www.wikidata.org/wiki/Q429039
 ('wd-Q429039','Roberto Carlos',array['Real Madrid','Fenerbahçe','Inter']),
-- https://www.wikidata.org/wiki/Q45766
 ('wd-Q45766','Mario Gómez',array['Beşiktaş','Bayern Munich']),
-- https://www.wikidata.org/wiki/Q487459
 ('wd-Q487459','Arda Turan',array['Barcelona','Galatasaray','Atlético Madrid']),
-- https://www.wikidata.org/wiki/Q192974
 ('wd-Q192974','Hakan Şükür',array['Galatasaray','Inter']),
-- https://www.wikidata.org/wiki/Q313205
 ('wd-Q313205','Gheorghe Popescu',array['Barcelona','Galatasaray']),
-- https://www.wikidata.org/wiki/Q713895
 ('wd-Q713895','Dušan Tadić',array['Fenerbahçe','Ajax']),
-- https://www.wikidata.org/wiki/Q713711
 ('wd-Q713711','Wilfried Zaha',array['Manchester United','Galatasaray','Lyon']),
-- https://www.wikidata.org/wiki/Q166984
 ('wd-Q166984','John Obi Mikel',array['Chelsea','Trabzonspor']),
-- https://www.wikidata.org/wiki/Q965448
 ('wd-Q965448','Fred',array['Manchester United','Fenerbahçe']),
-- https://www.wikidata.org/wiki/Q373547
 ('wd-Q373547','Diego Lugano',array['Fenerbahçe','Paris Saint-Germain']),
-- https://www.wikidata.org/wiki/Q192856
 ('wd-Q192856','Emmanuel Eboué',array['Arsenal','Galatasaray']),
-- https://www.wikidata.org/wiki/Q207397
 ('wd-Q207397','Didier Zokora',array['Trabzonspor','Sevilla']),
-- https://en.wikipedia.org/wiki/Arda_G%C3%BCler
 ('research-ardaguler-2005-02-25','Arda Güler',array['Fenerbahçe','Real Madrid']),
-- https://en.wikipedia.org/wiki/Orkun_K%C3%B6k%C3%A7%C3%BC
 ('research-orkunkokcu-2000-12-29','Orkun Kökçü',array['Feyenoord','Benfica','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Ozan_Kabak
 ('research-ozankabak-2000-03-25','Ozan Kabak',array['Galatasaray','Liverpool']),
-- https://en.wikipedia.org/wiki/%C3%87a%C4%9Flar_S%C3%B6y%C3%BCnc%C3%BC
 ('research-caglarsoyuncu-1996-05-23','Çağlar Söyüncü',array['Atlético Madrid','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/U%C4%9Furcan_%C3%87ak%C4%B1r
 ('research-ugurcancakir-1996-04-05','Uğurcan Çakır',array['Trabzonspor','Galatasaray']),
-- https://en.wikipedia.org/wiki/Caner_Erkin
 ('research-canererkin-1988-10-04','Caner Erkin',array['Galatasaray','Fenerbahçe','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Sel%C3%A7uk_%C4%B0nan
 ('research-selcukinan-1985-02-10','Selçuk İnan',array['Trabzonspor','Galatasaray']),
-- https://en.wikipedia.org/wiki/T%C3%BCmer_Metin
 ('research-tumermetin-1974-10-14','Tümer Metin',array['Beşiktaş','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Hugo_Almeida
 ('research-hugoalmeida-1984-05-23','Hugo Almeida',array['Porto','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Mehmet_Aur%C3%A9lio
 ('research-mehmetaurelio-1977-12-15','Mehmet Aurélio',array['Trabzonspor','Fenerbahçe','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Adriano_Correia
 ('research-adrianocorreia-1984-10-26','Adriano Correia',array['Sevilla','Barcelona','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Anderson_Talisca
 ('research-talisca-1994-02-01','Talisca',array['Benfica','Beşiktaş','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Adem_Ljaji%C4%87
 ('research-ademljajic-1991-09-29','Adem Ljajić',array['Roma','Inter','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Rachid_Ghezzal
 ('research-rachidghezzal-1992-05-09','Rachid Ghezzal',array['Lyon','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Mohamed_Elneny
 ('research-mohamedelneny-1992-07-11','Mohamed Elneny',array['Arsenal','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Salih_U%C3%A7an
 ('research-salihucan-1994-01-06','Salih Uçan',array['Fenerbahçe','Roma','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Gedson_Fernandes
 ('research-gedsonfernandes-1999-01-09','Gedson Fernandes',array['Benfica','Galatasaray','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Ante_Rebi%C4%87
 ('research-anterebic-1993-09-21','Ante Rebić',array['AC Milan','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Milot_Rashica
 ('research-milotrashica-1996-06-28','Milot Rashica',array['Galatasaray','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Wout_Weghorst
 ('research-woutweghorst-1992-08-07','Wout Weghorst',array['Beşiktaş','Manchester United','Ajax']),
-- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/
 ('research-cenktosun-1991-06-07','Cenk Tosun',array['Beşiktaş','Fenerbahçe']),
-- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/
 ('research-keremakturkoglu-1998-10-21','Kerem Aktürkoğlu',array['Galatasaray','Benfica','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Rafa_Silva
 ('research-rafasilva-batch2','Rafa Silva',array['Benfica','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Vincent_Aboubakar
 ('research-vincentaboubakar-batch2','Vincent Aboubakar',array['Porto','Beşiktaş']),
-- https://en.wikipedia.org/wiki/Allan_Saint-Maximin
 ('research-allansaintmaximin-1997-03-12','Allan Saint-Maximin',array['Newcastle United','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Youssef_En-Nesyri
 ('research-youssefennesyri-1997-06-01','Youssef En-Nesyri',array['Sevilla','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Milan_%C5%A0kriniar
 ('research-milanskriniar-1995-02-11','Milan Škriniar',array['Inter','Paris Saint-Germain','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Sebastian_Szyma%C5%84ski
 ('research-sebastianszymanski-1999-05-10','Sebastian Szymański',array['Feyenoord','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Rade_Kruni%C4%87
 ('research-radekrunic-1993-10-07','Rade Krunić',array['AC Milan','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/N%C3%A9lson_Semedo
 ('research-nelsonsemedo-1993-11-16','Nélson Semedo',array['Benfica','Barcelona','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Diego_Reyes
 ('research-diegoreyes-1992-09-19','Diego Reyes',array['Porto','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Martin_%C5%A0krtel
 ('research-martinskrtel-1984-12-15','Martin Škrtel',array['Liverpool','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Lazar_Markovi%C4%87
 ('research-lazarmarkovic-1994-03-02','Lazar Marković',array['Benfica','Liverpool','Fenerbahçe','Sporting CP','Trabzonspor']),
-- https://en.wikipedia.org/wiki/Bruno_Alves
 ('research-brunoalves-1981-11-27','Bruno Alves',array['Porto','Fenerbahçe']),
-- https://en.wikipedia.org/wiki/Elvir_Balji%C4%87
 ('research-elvirbaljic-1974-07-08','Elvir Baljić',array['Fenerbahçe','Real Madrid','Galatasaray']),
-- https://en.wikipedia.org/wiki/Jay-Jay_Okocha
 ('research-jayjayokocha-1973-08-14','Jay-Jay Okocha',array['Fenerbahçe','Paris Saint-Germain']),
-- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/
 ('research-umitdavala-1973-07-30','Ümit Davala',array['Galatasaray','AC Milan']),
-- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/
 ('research-okanburuk-1973-10-19','Okan Buruk',array['Galatasaray','Inter','Beşiktaş']),
-- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/
 ('research-hamitaltintop-1982-12-08','Hamit Altıntop',array['Bayern Munich','Real Madrid','Galatasaray']),
-- https://en.wikipedia.org/wiki/Harry_Kewell
 ('research-harrykewell-1978-09-22','Harry Kewell',array['Liverpool','Galatasaray']),
-- https://en.wikipedia.org/wiki/Sacha_Boey
 ('research-sachaboey-2000-09-13','Sacha Boey',array['Galatasaray','Bayern Munich']),
-- https://en.wikipedia.org/wiki/S%C3%A9rgio_Oliveira
 ('research-sergiooliveira-1992-06-02','Sérgio Oliveira',array['Porto','Roma','Galatasaray']),
-- https://en.wikipedia.org/wiki/Nicol%C3%B2_Zaniolo
 ('research-nicolozaniolo-1999-07-02','Nicolò Zaniolo',array['Roma','Galatasaray']),
-- https://en.wikipedia.org/wiki/Juraj_Kucka
 ('research-jurajkucka-1987-02-26','Juraj Kucka',array['AC Milan','Trabzonspor']),
-- https://en.wikipedia.org/wiki/%C3%93scar_Cardozo
 ('research-oscarcardozo-1983-05-20','Óscar Cardozo',array['Benfica','Trabzonspor']),
-- https://en.wikipedia.org/wiki/Bruno_Peres
 ('research-brunoperes-1990-03-01','Bruno Peres',array['Roma','Trabzonspor']),
-- https://en.wikipedia.org/wiki/Shota_Arveladze
 ('research-shotaarveladze-batch2','Shota Arveladze',array['Trabzonspor','Ajax']),
-- https://en.wikipedia.org/wiki/Alexander_S%C3%B8rloth
 ('research-alexandersorloth-1995-12-05','Alexander Sørloth',array['Trabzonspor','Atlético Madrid']),
-- https://en.wikipedia.org/wiki/Johan_Elmander
 ('research-johanelmander-1981-05-27','Johan Elmander',array['Feyenoord','Galatasaray']),
-- https://en.wikipedia.org/wiki/Oktay_Derelio%C4%9Flu
 ('research-oktayderelioglu-1975-12-17','Oktay Derelioğlu',array['Trabzonspor','Beşiktaş','Fenerbahçe']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-pepe-batch2','Pepe',array['Real Madrid','Beşiktaş','Porto']),
-- https://www.uefa.com/uefachampionsleague/clubs/players/250099374--davinson-sanchez/
 ('research-davinsonsanchez-batch2','Davinson Sánchez',array['Galatasaray','Ajax']),
-- https://en.wikipedia.org/wiki/Fernando_Muslera
 ('research-fernandomuslera-batch2','Fernando Muslera',array['Galatasaray']),
-- https://en.wikipedia.org/wiki/Dries_Mertens
 ('research-driesmertens-batch2','Dries Mertens',array['Galatasaray']),
-- https://en.wikipedia.org/wiki/Victor_Osimhen
 ('research-victorosimhen-batch2','Victor Osimhen',array['Galatasaray']),
-- https://en.wikipedia.org/wiki/Marek_Ham%C5%A1%C3%ADk
 ('research-marekhamsik-batch2','Marek Hamšík',array['Trabzonspor']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-ikercasillas-batch3','Iker Casillas',array['Real Madrid','Porto']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-karimbenzema-batch3','Karim Benzema',array['Lyon','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-tonikroos-batch3','Toni Kroos',array['Bayern Munich','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-sergioramos-batch3','Sergio Ramos',array['Real Madrid','Paris Saint-Germain','Sevilla']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-gerardpique-batch3','Gerard Piqué',array['Manchester United','Barcelona']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-davidalaba-batch3','David Alaba',array['Bayern Munich','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-gianluigibuffon-batch3','Gianluigi Buffon',array['Juventus','Paris Saint-Germain']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-antoinegriezmann-batch3','Antoine Griezmann',array['Atlético Madrid','Barcelona']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-thierryhenry-batch3','Thierry Henry',array['Barcelona','Arsenal','Juventus']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-arjenrobben-batch3','Arjen Robben',array['Chelsea','Real Madrid','Bayern Munich']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-andreapirlo-batch3','Andrea Pirlo',array['Inter','AC Milan','Juventus']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-thibautcourtois-batch3','Thibaut Courtois',array['Atlético Madrid','Chelsea','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-franklampard-batch3','Frank Lampard',array['Chelsea','Manchester City']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-kylianmbappe-batch3','Kylian Mbappé',array['Paris Saint-Germain','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
 ('research-andriyshevchenko-batch3','Andriy Shevchenko',array['AC Milan','Chelsea']),
-- https://www.uefa.com/uefachampionsleague/news/0266-1190ecaf35c9-0d3e4c5a230e-1000--kylian-mbappe-antoine-griezmann-ousmane-dembele-karim-benzem/
 ('research-raphaelvarane-batch3','Raphaël Varane',array['Real Madrid','Manchester United']),
-- https://www.uefa.com/uefachampionsleague/news/0266-1190ecaf35c9-0d3e4c5a230e-1000--kylian-mbappe-antoine-griezmann-ousmane-dembele-karim-benzem/
 ('research-robertpires-batch3','Robert Pirès',array['Marseille','Arsenal']),
-- https://www.uefa.com/uefachampionsleague/news/0266-1190ecaf35c9-0d3e4c5a230e-1000--kylian-mbappe-antoine-griezmann-ousmane-dembele-karim-benzem/
 ('research-zinedinezidane-batch3','Zinédine Zidane',array['Juventus','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0266-1190ecaf35c9-0d3e4c5a230e-1000--kylian-mbappe-antoine-griezmann-ousmane-dembele-karim-benzem/
 ('research-kingsleycoman-batch3','Kingsley Coman',array['Juventus','Bayern Munich']),
-- https://www.uefa.com/uefachampionsleague/news/0266-1190ecaf35c9-0d3e4c5a230e-1000--kylian-mbappe-antoine-griezmann-ousmane-dembele-karim-benzem/
 ('research-alexandrelacazette-batch3','Alexandre Lacazette',array['Lyon','Arsenal']),
-- https://www.uefa.com/uefachampionsleague/news/0244-0e98ba4865f5-638b28f0a449-1000--clarence-seedorf-arjen-robben-ruud-van-nistelrooy-who-are-th/
 ('research-edwinvandersar-batch3','Edwin van der Sar',array['Ajax','Juventus','Manchester United']),
-- https://www.uefa.com/uefachampionsleague/news/0244-0e98ba4865f5-638b28f0a449-1000--clarence-seedorf-arjen-robben-ruud-van-nistelrooy-who-are-th/
 ('research-ruudvannistelrooy-batch3','Ruud van Nistelrooy',array['Manchester United','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0244-0e98ba4865f5-638b28f0a449-1000--clarence-seedorf-arjen-robben-ruud-van-nistelrooy-who-are-th/
 ('research-marcovanbasten-batch3','Marco van Basten',array['Ajax','AC Milan']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-maxwell-batch3','Maxwell',array['Ajax','Inter','Barcelona','Paris Saint-Germain']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-kaka-batch3','Kaká',array['AC Milan','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-casemiro-batch3','Casemiro',array['Real Madrid','Porto','Manchester United']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-neymar-batch3','Neymar',array['Barcelona','Paris Saint-Germain']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-rivaldo-batch3','Rivaldo',array['Barcelona','AC Milan']),
-- https://www.uefa.com/uefachampionsleague/news/027c-16dec5d3607f-e40e8954f229-1000--neymar-roberto-carlos-thiago-silva-who-are-brazil-s-top-ue/
 ('research-willian-batch3','Willian',array['Chelsea','Arsenal']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-ricardocarvalho-batch3','Ricardo Carvalho',array['Porto','Chelsea','Real Madrid']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-deco-batch3','Deco',array['Porto','Barcelona','Chelsea']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-rubendias-batch3','Rúben Dias',array['Benfica','Manchester City']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-joaomoutinho-batch3','João Moutinho',array['Sporting CP','Porto']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-vitorbaia-batch3','Vítor Baía',array['Porto','Barcelona']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-ruicosta-batch3','Rui Costa',array['Benfica','AC Milan']),
-- https://www.uefa.com/uefachampionsleague/news/0246-0e98e228fe16-d5ff2a10c737-1000--cristiano-ronaldo-bernardo-silva-bruno-fernandes-joao-mout/
 ('research-brunofernandes-batch3','Bruno Fernandes',array['Sporting CP','Manchester United']),
-- https://www.uefa.com/uefachampionsleague/news/0252-0d044f6082ee-2d26fd1c024f-1000--roberto-carlos-lionel-messi-neymar-edinson-cavani-who-are-so/
 ('research-diegogodin-batch3','Diego Godín',array['Atlético Madrid','Inter']),
-- https://www.uefa.com/uefachampionsleague/news/0252-0d044f6082ee-2d26fd1c024f-1000--roberto-carlos-lionel-messi-neymar-edinson-cavani-who-are-so/
 ('research-claudiopizarro-batch3','Claudio Pizarro',array['Bayern Munich','Chelsea']),
-- https://www.uefa.com/uefachampionsleague/news/0252-0d044f6082ee-2d26fd1c024f-1000--roberto-carlos-lionel-messi-neymar-edinson-cavani-who-are-so/
 ('research-juancuadrado-batch3','Juan Cuadrado',array['Chelsea','Juventus','Inter']),
-- https://www.uefa.com/uefachampionsleague/news/0295-1cd2108caa82-1bc515a174ed-1000--gianluigi-buffon-paolo-maldini-andrea-pirlo-alessandro-del-piero-who-are-italys-top-uefa-champions-league-performers/
 ('research-filippoinzaghi-batch3','Filippo Inzaghi',array['Juventus','AC Milan']),
-- https://www.uefa.com/uefachampionsleague/news/0295-1cd2108caa82-1bc515a174ed-1000--gianluigi-buffon-paolo-maldini-andrea-pirlo-alessandro-del-piero-who-are-italys-top-uefa-champions-league-performers/
 ('research-gianlucavialli-batch3','Gianluca Vialli',array['Juventus','Chelsea']),
-- https://www.uefa.com/uefachampionsleague/news/0295-1cd2108caa82-1bc515a174ed-1000--gianluigi-buffon-paolo-maldini-andrea-pirlo-alessandro-del-piero-who-are-italys-top-uefa-champions-league-performers/
 ('research-robertobaggio-batch3','Roberto Baggio',array['Juventus','AC Milan','Inter']),
-- https://www.uefa.com/uefachampionsleague/news/0266-118920ae91ee-a1079c47e9e0-1000--thomas-muller-toni-kroos-manuel-neuer-who-are-germany-s-t/
 ('research-bastianschweinsteiger-batch3','Bastian Schweinsteiger',array['Bayern Munich','Manchester United']),
-- https://www.uefa.com/uefachampionsleague/news/0266-118920ae91ee-a1079c47e9e0-1000--thomas-muller-toni-kroos-manuel-neuer-who-are-germany-s-t/
 ('research-michaelballack-batch3','Michael Ballack',array['Bayern Munich','Chelsea']),
-- https://www.uefa.com/uefachampionsleague/news/0266-118920ae91ee-a1079c47e9e0-1000--thomas-muller-toni-kroos-manuel-neuer-who-are-germany-s-t/
 ('research-mariogotze-batch3','Mario Götze',array['Borussia Dortmund','Bayern Munich']),
-- https://www.uefa.com/uefachampionsleague/news/0266-118920ae91ee-a1079c47e9e0-1000--thomas-muller-toni-kroos-manuel-neuer-who-are-germany-s-t/
 ('research-kaihavertz-batch3','Kai Havertz',array['Chelsea','Arsenal']),
-- https://www.uefa.com/uefachampionsleague/news/0266-118920ae91ee-a1079c47e9e0-1000--thomas-muller-toni-kroos-manuel-neuer-who-are-germany-s-t/
 ('research-sergegnabry-batch3','Serge Gnabry',array['Arsenal','Bayern Munich']),
-- https://www.uefa.com/uefachampionsleague/news/0227-0e9256d3f31f-2c54224782ca-1000--mohamed-salah-sadio-mane-didier-drogba-pierre-emerick-auba/
 ('research-yayatoure-batch3','Yaya Touré',array['Barcelona','Manchester City']),
-- https://www.uefa.com/uefachampionsleague/news/0227-0e9256d3f31f-2c54224782ca-1000--mohamed-salah-sadio-mane-didier-drogba-pierre-emerick-auba/
 ('research-sadiomane-batch3','Sadio Mané',array['Liverpool','Bayern Munich']),
-- https://www.uefa.com/uefachampionsleague/news/0227-0e9256d3f31f-2c54224782ca-1000--mohamed-salah-sadio-mane-didier-drogba-pierre-emerick-auba/
 ('research-sofianefeghouli-batch3','Sofiane Feghouli',array['Valencia','Galatasaray'])
on conflict (id) do update set name=excluded.name,clubs=excluded.clubs;
commit;
