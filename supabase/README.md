# Oyun hesapları ve kalıcı skorlar

`migrations/202611150001_game_accounts.sql` Supabase SQL Editor'de bir kez çalıştırılır.
2026-11-15 tarihinde `football_data` projesinde uygulandı. Futbol maçları tablosunu değiştirmez.
Yeni kurulumda dosyanın tamamı tek işlem olarak uygulanmalıdır.

## Giriş

- Supabase Auth: e-posta + şifre, e-posta doğrulaması açık.
- Site URL: `https://football-analyzer-chi.vercel.app/oyna`.
- Yerel geliştirmede doğrulama/şifre yenileme denenirse ilgili `/oyna` adresini Auth → URL Configuration → Redirect URLs listesine ekleyin.
- Auth → Emails → SMTP Settings altında gönderim hizmeti gerekir. Varsayılan Supabase göndericisi proje ekibi dışına e-posta göndermez.
- Kullanıcı adı doğrulanmış oturumdan sonra `game_set_username` ile kesinleştirilir; küçük harfli, benzersiz ve 3–20 karakterdir. E-posta sıralamada görünmez.
- SMTP anahtarı yalnızca Supabase ayarlarında saklanır; web projesine veya `NEXT_PUBLIC_` değişkenlerine eklenmez.

## Oyun kuralları

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
- Oyuncu havuzu hâlâ prototipteki 5 kişidir. Liste büyütülürken `game_players` ve istemcinin `football-analyzer-mobile/game/data.ts` havuzu birlikte güncellenmelidir.
- Oyun cevapları sunucuda doğrulanır, ancak bu küçük ve açık oyuncu havuzu otomatik cevap veren istemcilere karşı rekabetçi bir hile önleme sistemi değildir.

## Doğrulama

```
npm install --prefix node_modules/.cache/game-tests @electric-sql/pglite
node scripts/test-game-db.mjs
npm run build
```

Test ayrı, geçici PostgreSQL motorunda çalışır; canlı projeye veya ağ bağlantısına ihtiyaç duymaz.
Kimlik doğrulama, tablo erişimi, oda üyeliği, gizli seçim, geri sayım, yanlış cevap, tekrar istekleri,
tek kazanan, iptal, pes etme, süre aşımı, skorlar ve galibiyet serisini kapsar.
Gerçek e-posta teslimi ve iki fiziksel cihazda son kontrol ayrıca yapılmalıdır.
