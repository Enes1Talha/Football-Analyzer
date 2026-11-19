"""One-time additive import. Research provenance remains in research-20261119.
Never overwrite an applied migration; corrections need a later migration.
"""
import json, unicodedata
from pathlib import Path

root = Path(__file__).resolve().parent.parent
folder = root / 'scripts/research-20261119'
load = lambda p: json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(p, data):
    Path(p).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
def quote(s):
    return "'"+s.replace("'", "''")+"'"
def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFKD',s.lower().replace('ı','i').replace('ø','o')) if c.isalnum() and not unicodedata.combining(c))
migration = root / 'supabase/migrations/202611190001_research_expansion_anagrams.sql'
assert not migration.exists(), 'Already generated; create a new migration instead'
pool = load(root.parent/'claude-arastirma/mevcut-oyun-havuzu.json')
assert pool['counts']==dict(players=523,clubs=29,anagrams=204,careerTrails=10)
delta=load(folder/'research_delta_2026-11-19.json')
clubs=load(folder/'two_clubs_batch_next.json')
anagrams=load(folder/'anagram_batch_next.json')
more=load(folder/'more_less_batch_next.json')
old_questions=load(root/'scripts/football_more_less_batch1.json')
existing={p['id']:p for p in pool['players']}
changes=[]
for p in clubs['accepted']:
    old=existing.get(p.get('existingPlayerId'))
    if old:
        # This batch contains one independently checked new link (TFF match report).
        assert old['id']=='wd-Q1354960'
        merged={**old,'clubs':list(dict.fromkeys(old['clubs']+[c['clubName'] for c in p['clubs']]))}
        merged['source']='https://www.tff.org/Resources/Tamsaha/262/66-67/'
    else:
        assert not any(norm(p['name'])==norm(n) for x in existing.values() for n in [x['name']]+x.get('aliases',[]))
        merged=dict(id='research-'+p['id']+'-batch4',name=p['name'],aliases=p.get('aliases',[]),clubs=[c['clubName'] for c in p['clubs']],source=p['clubs'][0]['evidence'][0]['url'])
    assert all(c in pool['supportedClubs'] for c in merged['clubs'])
    existing[merged['id']]=merged;changes.append(merged)

trails=load(root/'src/lib/career-trails.json')
new_trails=[]
for r in delta['careerRoutes']['accepted']:
    identity=r['existingPlayerId'] or 'research-'+r['id']+'-career4'
    if identity not in existing:
        # Make the player selectable, without converting secondary career evidence
        # into officially sourced two-club links.
        p=dict(id=identity,name=r['playerName'],aliases=[r['playerName']],clubs=[],source=r['source'])
        existing[identity]=p;changes.append(p)
    player=existing[identity]
    assert identity not in {t['id'] for t in trails+new_trails}
    for i,s in enumerate(r['stages']):
        assert isinstance(s['startYear'],int) and isinstance(s['endYear'],int)
        assert s['startYear']<=s['endYear']
        if i: assert s['startYear']>=r['stages'][i-1]['startYear']
    # No inferred retirement claim: display sourced senior spells as of review.
    new_trails.append(dict(id=identity,playerName=player['name'],aliases=list(dict.fromkeys([player['name'],r['playerName']]+player.get('aliases',[]))),stages=r['stages'],source=r['source'],sourceType='secondary',reviewedAt='2026-11-19',note='19 Kasım 2026 incelemesinde kaynakta yer alan A takım dönemleri. Wikipedia kaynaklıdır; kiralık dönemlerde yıllar örtüşebilir.'))

words=load(root/'src/lib/solo-anagrams.json');word_keys={norm(w['word']) for w in words};new_words=[]
for a in anagrams['accepted']:
    w=a['normalizedAnswer'];assert w.isascii() and w.isalpha() and w==w.upper()
    assert norm(w) not in word_keys;word_keys.add(norm(w))
    new_words.append(dict(word=w,playerName=a['name'],difficulty=a['difficulty']))

question_map={q['id']:q for q in old_questions['questions']}
player_names={p['id']:p['name'] for p in old_questions['players']+more['players']}
runtime=load(root/'src/lib/more-less-questions.json');runtime_ids={q['id'] for q in runtime}
new_questions=[]
for q in more['auditOfBatch1']:
    original=question_map[q['originalQuestionId']]
    assert (q['valueA'],q['valueB'])==(original['valueA'],original['valueB'])
    assert q['scope']['endDate']=='2026-05-30'
    assert q['originalQuestionId'] not in runtime_ids
    new_questions.append(dict(id=q['originalQuestionId'],prompt=q['recommendedPrompt'],playerA=player_names[q['playerAId']],playerB=player_names[q['playerBId']],valueA=q['valueA'],valueB=q['valueB'],correctAnswer=q['correctAnswer'],unit=original['unit'],period='30 Mayıs 2026 itibarıyla',source=q['evidence'][0]['url'],sources=list(dict.fromkeys(e['url'] for e in q['evidence'])),scope=q['scope'],verification='researcher-reviewed-official-tables'))
for q in more['accepted']:
    assert q['correctAnswer']==('A' if q['valueA']>q['valueB'] else 'B' if q['valueA']<q['valueB'] else 'equal')
    new_questions.append(dict(id=q['id'],prompt=q['prompt'].replace("'nde",' turnuvasında'),playerA=player_names[q['playerAId']],playerB=player_names[q['playerBId']],valueA=q['valueA'],valueB=q['valueB'],correctAnswer=q['correctAnswer'],unit=q['unit'],period=q['scope']['season'] or q['scope']['edition'],source=q['evidence'][0]['url'],sources=list(dict.fromkeys(e['url'] for e in q['evidence'])),scope=q['scope'],verification='researcher-reviewed-official-tables'))
assert len({q['id'] for q in runtime+new_questions})==160
sql=['-- Additive research import; no rooms, profiles or results modified.','begin;']
sql.append('insert into public.game_players(id,name,clubs) values\n'+',\n'.join('('+quote(p['id'])+','+quote(p['name'])+',array['+','.join(map(quote,p['clubs']))+']::text[])' for p in changes)+'\non conflict(id) do update set name=excluded.name,clubs=excluded.clubs;')
sql.append('insert into public.game_anagrams(word,player_name,difficulty) values\n'+',\n'.join('('+','.join(quote(w[k]) for k in ['word','playerName','difficulty'])+')' for w in new_words)+';')
for table,rows in [('game_careers',new_trails),('game_more_less_questions',new_questions)]:
    sql.append('insert into public.'+table+'(id,data) values\n'+',\n'.join('('+quote(r['id'])+','+quote(json.dumps(r,ensure_ascii=False))+')' for r in rows)+';')
sql+=['notify pgrst,\'reload schema\';','commit;']
migration.write_text('\n'.join(sql)+'\n',encoding='utf-8')
save(root/'football-analyzer-mobile/game/batch-four-players.json',changes)
save(root/'src/lib/career-trails.json',trails+new_trails)
save(root/'src/lib/solo-anagrams.json',words+new_words)
save(root/'src/lib/more-less-questions.json',runtime+new_questions)
save(folder/'admission.json',dict(newPlayers=20,updatedPlayers=1,newAnagrams=len(new_words),newTrails=len(new_trails),newComparisonQuestions=len(new_questions),totals=dict(players=len(existing),anagrams=len(words+new_words),careerTrails=len(trails+new_trails),moreLess=len(runtime+new_questions)),sourcePolicy='Club and statistical evidence retains researcher attribution. Salah report independently checked. Career trails explicitly secondary; no retirement inference displayed.',deferredCareerRoutes=[r['playerName'] for r in delta['careerRoutes']['needsReview']],careerOnlyPlayers=['Nihat Kahveci','Tuncay Şanlı','Alex de Souza']))
print('Added 20 selectable players, 1 club update, 60 anagrams, 24 secondary-sourced trails, 140 comparison questions.')
