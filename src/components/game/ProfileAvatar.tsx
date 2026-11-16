import { UserRound } from "lucide-react";

export default function ProfileAvatar({ photo, large = false }: { photo?: string; large?: boolean }) {
  return <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-neon-green/40 bg-neon-green/5 text-neon-green ${large ? "h-24 w-24" : "h-12 w-12"}`}>
    {/* The image is a bounded, re-encoded local JPEG, not a remote URL. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {photo ? <img src={photo} alt="Profil fotoğrafın" className="h-full w-full object-cover" /> : <UserRound aria-hidden="true" size={large ? 40 : 24} />}
  </span>;
}
