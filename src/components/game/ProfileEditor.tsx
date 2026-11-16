"use client";
import { useRef, useState } from "react";
import { Camera, Check, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { gameError, type PlayerDetails } from "@/lib/game";
import { prepareProfilePhoto } from "@/lib/profile-photo";
import ProfileAvatar from "./ProfileAvatar";

const input = "w-full rounded-lg border border-pitch-border bg-pitch-dark p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-green disabled:opacity-60";
export default function ProfileEditor({ details, email, onSaved }: { details: PlayerDetails; email?: string; onSaved: (profile: PlayerDetails) => void }) {
  const [draft, setDraft] = useState(details);
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const changed = draft.username !== details.username || draft.display_name !== details.display_name || draft.bio !== details.bio || draft.avatar !== details.avatar;
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const { data, error: failure } = await supabase.rpc("game_update_profile", { p_username: draft.username, p_display_name: draft.display_name, p_bio: draft.bio, p_avatar: draft.avatar });
      if (failure) throw failure;
      setDraft(data as PlayerDetails); onSaved(data as PlayerDetails); setMessage("Profilin kaydedildi.");
    } catch (e) { setError(gameError(e as Error)); }
    finally { setBusy(false); }
  }
  return <section className="card-glow p-5 sm:p-6 space-y-6">
    <div><h2 className="text-xl font-bold">Profilim</h2><p className="mt-1 text-sm text-zinc-400">Sahada kendi tarzını göster.</p></div>
    <form onSubmit={save} className="space-y-5">
      <fieldset disabled={busy || processing} className="space-y-5 disabled:opacity-70">
        <div className="flex flex-wrap items-center gap-5">
          <ProfileAvatar photo={draft.avatar} large />
          <div className="space-y-2">
            <button type="button" onClick={() => fileInput.current?.click()} className="flex items-center gap-2 rounded-lg border border-neon-cyan/40 px-4 py-2 text-sm text-neon-cyan"><Camera size={16} aria-hidden="true" />{processing ? "Fotoğraf hazırlanıyor…" : "Fotoğraf değiştir"}</button>
            {draft.avatar && <button type="button" onClick={() => { setDraft({ ...draft, avatar: "" }); setMessage(""); }} className="block text-xs text-zinc-400 underline">Fotoğrafı kaldır</button>}
            <p className="text-xs text-zinc-500">JPG, PNG veya WebP · En fazla 5 MB<br />Fotoğraf ortasından kare olarak kırpılır.</p>
          </div>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Profil fotoğrafı seç" className="sr-only" onChange={async (event) => {
            const file = event.target.files?.[0]; event.target.value = "";
            if (!file) return;
            setProcessing(true); setError(""); setMessage("");
            try { const avatar = await prepareProfilePhoto(file); setDraft((previous) => ({ ...previous, avatar })); }
            catch (e) { setError((e as Error).message); }
            finally { setProcessing(false); }
          }} />
        </div>
        <label className="block space-y-2 text-sm"><span>Görünen ad</span><input className={input} maxLength={40} autoComplete="nickname" placeholder="Sana nasıl hitap edelim?" value={draft.display_name} onChange={(e) => { setDraft({ ...draft, display_name: e.target.value }); setMessage(""); }} /><span className="block text-xs text-zinc-500">Gerçek adını kullanmak zorunda değilsin.</span></label>
        <label className="block space-y-2 text-sm"><span>Kullanıcı adı</span><input className={input} required minLength={3} maxLength={20} pattern="[a-z0-9_]{3,20}" autoComplete="username" value={draft.username} onChange={(e) => { setDraft({ ...draft, username: e.target.value.toLowerCase() }); setMessage(""); }} /><span className="block text-xs text-zinc-500">3–20 karakter: a-z, rakam veya alt çizgi. Sıralamada ve rakiplerinin karşısında bu ad görünür. Değiştirmek puanını ve geçmişini etkilemez.</span></label>
        <label className="block space-y-2 text-sm"><span>Kısa biyografi</span><textarea className={`${input} resize-y min-h-24`} maxLength={160} rows={3} placeholder="Futbol senin için ne demek?" value={draft.bio} onChange={(e) => { setDraft({ ...draft, bio: e.target.value }); setMessage(""); }} /><span className="block text-right text-xs text-zinc-500">{draft.bio.length}/160</span></label>
      </fieldset>
      {error && <p role="alert" className="text-sm text-neon-yellow">{error}</p>}
      {message && <p role="status" className="flex items-center gap-2 text-sm text-neon-cyan"><Check size={16} />{message}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button disabled={!changed || busy || processing} className="flex items-center gap-2 rounded-lg bg-neon-green px-5 py-3 font-bold text-black disabled:opacity-40"><Save size={16} aria-hidden="true" />{busy ? "Kaydediliyor…" : "Değişiklikleri kaydet"}</button>
        {changed && <button type="button" disabled={busy || processing} onClick={() => { setDraft(details); setError(""); setMessage(""); }} className="text-sm text-zinc-400">Vazgeç</button>}
      </div>
      {changed && <p className="text-xs text-zinc-500">Henüz kaydedilmemiş değişikliklerin var.</p>}
    </form>
    <div className="border-t border-pitch-border pt-5 space-y-2 text-sm">
      <h3 className="font-bold">Hesap bilgileri</h3>
      <p className="break-all text-zinc-400">{email}</p><p className="text-xs text-zinc-500">E-posta adresin diğer oyunculara gösterilmez.</p>
      <p className="text-xs text-zinc-500">Katılma tarihi: {new Date(details.created_at).toLocaleDateString("tr-TR")}</p>
      <button type="button" disabled={busy || !email} className="pt-2 text-sm text-neon-cyan disabled:opacity-40" onClick={async () => {
        if (!email) return;
        setBusy(true); setError(""); setMessage("");
        try {
          const { error: failure } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/oyna" });
          if (failure) throw failure;
          setMessage("Şifre yenileme bağlantısı e-posta adresine gönderildi.");
        } catch (e) { setError(gameError(e as Error)); }
        finally { setBusy(false); }
      }}>Şifre yenileme bağlantısı gönder</button>
    </div>
  </section>;
}
