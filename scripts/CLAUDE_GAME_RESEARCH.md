# Claude için veri araştırması

Football Analyzer için yalnızca futbolcu verisi araştır. Kod değiştirme ve canlı veritabanına yazma; sonuçları Codex inceleyecek.

İki oyun var: iki kulüpte de oynamış futbolcuyu bulma ve karışık harflerden futbolcu adı bulma.

İlk parti 50 futbolcu. Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor ile Avrupa'nın büyük kulüpleri arasındaki bağlantılara öncelik ver. Mevcut `football-analyzer-mobile/game/imported-players.json` ve `game/data.ts` kayıtlarına erişimin varsa mükerrerleri çıkar.

Her oyuncu için JSON alanları:
- fullName, commonName, aliases
- clubs: [{ name, evidenceUrl, evidenceNote }]
- anagramName, difficulty (easy/medium/hard), difficultyReason

Kulüpte A takım resmi maçına çıkmış olmalı. Kiralık olup oynayanlar kabul; yalnız altyapı, hiç maça çıkmamış transfer ve teknik direktörlük bağlantısı kabul edilmez. Kulüp, federasyon, UEFA/FIFA kaynaklarını tercih et. Wikidata aday bulmaya yardımcı olabilir ama kulüp üyeliğini tek başına maça çıkma kanıtı sayma. Her kulüp için kaynak bağlantısı ekle. Makale metinlerini kopyalama; olguları ve kaynakları ver. Emin olmadığın kayıtları ayrı listele, tahminle doldurma.

Anagram için kısa ve tanınabilir isim/soyadı seç. Önerilen zorluklar: kolay kısa/tanınan (5 saniye), orta daha uzun (10 saniye), zor uzun/yazımı zor (20 saniye). İsim benzerliklerini ve belirsizlikleri belirt. Harfleri karıştırman gerekmez; bunu oyun yapıyor.
