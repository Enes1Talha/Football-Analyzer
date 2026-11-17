# Oyun hesapları ve kalıcı skorlar

`migrations/202611150001_game_accounts.sql` Supabase SQL Editor'de bir kez çalıştırılır.
2026-11-15 tarihinde `football_data` projesinde uygulandı. Futbol maçları tablosunu değiştirmez.
Yeni kurulumda dosyanın tamamı tek işlem olarak uygulanmalıdır.
`migrations/202611160001_expand_game_players.sql` 2026-11-16 tarihinde aynı projede uygulandı; canlı havuz 12 oyuncu olarak doğrulandı.
`migrations/202611160002_player_profiles.sql` 2026-11-16 tarihinde uygulandı. Profil düzenleme yayını bu migration'dan sonra yapılmalıdır.

## Profil düzenleme

- `game_profile` yalnızca oturum sahibinin kullanıcı adı, görünen adı, biyografisi, fotoğrafı ve katılma tarihini döndürür.
- `game_update_profile` kullanıcı kimliğini istekten almaz; `auth.uid()` ile günceller. Kullanıcı adı benzersizdir; değişiklikler oyun sonuçlarına dokunmaz.
- Görünen ad 40, biyografi 160 karakterle sınırlıdır. Sıralama/rakip ekranları kullanıcı adını göstermeye devam eder. Fotoğraf ve biyografi için herkese açık profil sayfası henüz yoktur.
- Fotoğraf JPG/PNG/WebP ve en fazla 5 MB olarak seçilir; tarayıcı ortadan kare kırpıp 256×256 JPEG'e dönüştürür. Orijinal dosya ve EXIF bilgisi saklanmaz. Sunucu JPEG data URL biçimi ve 180 KB sınırını denetler; dış URL ve SVG kabul etmez. Küçük avatar yalnızca profil sorgusunda gelir, sıralama yanıtını büyütmez.
- E-posta Supabase Auth oturumundan yalnızca hesap sahibine gösterilir. Şifre yenileme kullanıcının düğmeye basmasıyla mevcut doğrulama akışını kullanır.

## Giriş

- Supabase Auth: e-posta + şifre, e-posta doğrulaması açık.
- Site URL: `https://football-analyzer-chi.vercel.app/oyna`.
- Yerel geliştirmede doğrulama/şifre yenileme denenirse ilgili `/oyna` adresini Auth → URL Configuration → Redirect URLs listesine ekleyin.
- Auth → Emails → SMTP Settings altında gönderim hizmeti gerekir. Varsayılan Supabase göndericisi proje ekibi dışına e-posta göndermez.
- Kullanıcı adı doğrulanmış oturumdan sonra `game_set_username` ile kesinleştirilir; küçük harfli, benzersiz ve 3–20 karakterdir. E-posta sıralamada görünmez.
- SMTP anahtarı yalnızca Supabase ayarlarında saklanır; web projesine veya `NEXT_PUBLIC_` değişkenlerine eklenmez.

## Oyun kuralları

### Karışık Harfler

`202611170003_anagram.sql` 2026-11-17 tarihinde canlı projeye uygulandı. İlk havuz 20 sözcük: kolay 6, orta 8, zor 6. Sözcüklerin futbolcuları mevcut kaynaklı oyuncu havuzunda bulunur; zorluklar editoryal seçimdir.

- Oda açan kolay/orta/zor seçer: 5/10/20 saniye. İki ayrı hesap hazır olduğunda sunucu 3 saniyelik geri sayımı başlatır.
- Karışık harfler sunucuda bir kez üretilir. Geri sayım öncesi istemciye gönderilmez. Doğru cevap bitişe kadar gizlidir; soru tablosuna doğrudan istemci erişimi yoktur.
- Ekrandaki harflerden türeyen kullanılan isim/soyadı kabul edilir; rastgele farklı bir tam ad değil. Büyük/küçük harf, boşluk, noktalama ve yaygın Latin/Türkçe aksanlar normalize edilir. İstemci futbolcu önerisi sunmaz.
- İlk geçerli sunucu isteği satır kilidi altında kazanır. Son tarihten sonraki cevap kabul edilmez. Yanlış cevaplar arasında 500 ms bekleme vardır.
- Süre aşımı puansız kapanır ve cevabı gösterir. Başlamadan ayrılma puansız; başladıktan sonra pes etme mağlubiyettir. Tamamlanan oyunlar ortak toplamda, ayrıca oyun türü bazında sayılır.
- Aynı rakiple tekrar oyna, bir kez oluşturulan yeni oda kodunu iki oyuncuya da verir. Yeni turda ikisinin yeniden hazır olması gerekir.
- Ekran sunucu saatinden yerel sayaç üretir; durum 250 ms aralıkla alınır. Ağ gecikmesi nedeniyle iki ekranda aynı milisaniyede çizim garantisi yoktur. Süre/puan açısından sunucu karar verir. Gerçek iki cihaz testi ayrıca yapılmalıdır.
- Eski kulüp oyunu uygulaması ve temel dashboard yardımcıları doğrudan authenticated/anon erişimine kapatıldı; sadece yeni, yetki kontrollü RPC içinden çağrılır.

### İki Kulüp, Bir İsim

- Her oda bir turdur. İki ayrı hesap; sunucunun verdiği 8 karakterlik kod.
- Takımlar kilitlendikten sonra sunucuda 3 saniye sayılır. Rakibin seçimi bu süre bitene kadar yanıt içinde bulunmaz.
- İlk geçerli cevap kazanır; +1 galibiyet / +3 puan. Rakibe +1 mağlubiyet.
- Kazanan, satır kilidi altında tek işlemde belirlenir. Tekrarlanan istekler puanı artırmaz.
- Aynı takım veya doğrulanmış ortak oyuncusu olmayan eşleşme puansız kapanır.
- Oyun başladıktan sonra pes etmek mağlubiyet; önce çıkmak iptaldir.
- Bağlantı kopması tek başına mağlubiyet değildir. Kodla odaya dönülebilir. Tamamlanmayan odalar 24 saat sonra erişildiğinde puansız kapanır.
- Seviye 1–10 toplam galibiyet eşikleri: 0, 1, 3, 5, 10, 20, 35, 50, 75, 100.
- Sıralama: galibiyet azalan, mağlubiyet artan, kullanıcı adı. İlk 50 gösterilir.
- Arkadaş rekabeti, birlikte tamamlanan oyunlardan oluşur; ayrı arkadaşlık isteği sistemi yoktur.
- Oyuncu havuzu 403 kişidir; 29 kulüp ve dört büyüklerin bağlantıları dahildir. 2026-11-17 tarihinde `202611170001_game_coverage_message.sql` ve `202611170002_game_catalog.sql` canlıya uygulandı. Wikidata'dan pozitif maç sayısı içeren bağlantılar alınır; tüm kayıtların bağımsız olarak elle doğrulandığı veya eksiksiz olduğu iddia edilmez.
- İçe aktarma ve kaynak inceleme adımları: `scripts/GAME_DATA.md`. Kaynak kanıtları `scripts/game-wikidata-candidates.json`, küçük istemci havuzu `football-analyzer-mobile/game/imported-players.json` içindedir. Önceden eklenen oyuncuların kimlikleri korunur.
- Kaynak havuz `football-analyzer-mobile/game/data.ts` dosyasıdır. Yeni veri için `npx tsx scripts/generate-game-catalog.ts supabase/migrations/TIMESTAMP_name.sql` ile yeni bir migration oluşturun. Uygulanmış migration dosyalarını değiştirmeyin. Sunucu güncellemesini istemci yayınından önce uygulayın; test, sunucu ve istemci havuzlarının birebir aynı olduğunu denetler.
- Oyun cevapları sunucuda doğrulanır, ancak bu küçük ve açık oyuncu havuzu otomatik cevap veren istemcilere karşı rekabetçi bir hile önleme sistemi değildir.

## Doğrulama

```
npm install --prefix node_modules/.cache/game-tests @electric-sql/pglite
npx tsx scripts/test-game-db.mjs
npx tsx scripts/test-game-state.ts
npm run build
```

Test ayrı, geçici PostgreSQL motorunda çalışır; canlı projeye veya ağ bağlantısına ihtiyaç duymaz.
Kimlik doğrulama, tablo erişimi, oda üyeliği, gizli seçim, geri sayım, yanlış cevap, tekrar istekleri,
tek kazanan, iptal, pes etme, süre aşımı, skorlar ve galibiyet serisini kapsar.
Gerçek e-posta teslimi ve iki fiziksel cihazda son kontrol ayrıca yapılmalıdır.
