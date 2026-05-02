"use client";

import { AlertTriangle, KeyRound } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  hint?: string;
}

export default function ErrorBanner({ message, hint }: ErrorBannerProps) {
  const isKeyError = message.toLowerCase().includes("key") || message.toLowerCase().includes("api");

  return (
    <div className="card-glow border-neon-red/30 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {isKeyError ? (
            <KeyRound size={18} className="text-neon-red" />
          ) : (
            <AlertTriangle size={18} className="text-neon-red" />
          )}
        </div>
        <div>
          <p className="font-bold text-sm text-neon-red">{message}</p>
          {hint && (
            <p className="text-xs text-zinc-400 font-mono mt-1">{hint}</p>
          )}
        </div>
      </div>

      {isKeyError && (
        <div className="bg-pitch-dark border border-pitch-border rounded p-3 font-mono text-xs text-zinc-400 space-y-1">
          <p className="text-neon-yellow font-bold">Quick Setup:</p>
          <p>1. Copy <span className="text-white">.env.example</span> → <span className="text-white">.env.local</span></p>
          <p>2. Add your key: <span className="text-white">RAPIDAPI_KEY=your_key_here</span></p>
          <p>3. Get a free key at <span className="text-neon-cyan">rapidapi.com/api-sports/api/api-football</span></p>
          <p>4. Restart the dev server: <span className="text-white">npm run dev</span></p>
        </div>
      )}
    </div>
  );
}
