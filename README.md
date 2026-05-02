# Football Data & Form Analyzer

A cinematic, dark-themed football analytics dashboard built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **recharts**. It connects to the **API-Football** REST API (via RapidAPI) to display real-time team form data and midfield performance comparisons.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![API-Football](https://img.shields.io/badge/API--Football-RapidAPI-orange)

---

## Features

| Feature | Description |
|---------|-------------|
| **Team Form Panel** | Last 5 match results shown as W / D / L badges with full fixture log |
| **Midfield Radar Chart** | Recharts `RadarChart` comparing pass accuracy, tackles, interceptions, key passes, duels won, and dribbles for No. 6 / 8 / 10 profiles |
| **Head-to-Head Stat Bars** | Side-by-side metric bars for instant visual comparison |
| **Live API Integration** | All data fetched from API-Football (no hardcoded mock data) |
| **Dark Cinematic UI** | Film-grain overlay, neon accents, deep black palette |
| **Configurable Match-up** | Input any Team ID, League ID, and Season directly in the dashboard |

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) — App Router, Server Components, Route Handlers
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom neon color palette
- **Charts**: [Recharts](https://recharts.org/) — Radar chart for midfield metrics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data**: [API-Football](https://www.api-football.com/) via [RapidAPI](https://rapidapi.com/api-sports/api/api-football)
- **Language**: TypeScript (strict mode)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [RapidAPI](https://rapidapi.com/) account with access to **API-Football**

### 1 — Clone the repository

```bash
git clone https://github.com/your-username/football-analyzer.git
cd football-analyzer
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder with your key:

```env
RAPIDAPI_KEY=your_actual_rapidapi_key_here
```

> **How to get your key:**
> 1. Go to [rapidapi.com/api-sports/api/api-football](https://rapidapi.com/api-sports/api/api-football)
> 2. Click **Subscribe to Test** (free tier available)
> 3. Copy the `X-RapidAPI-Key` value shown in the code snippet panel
> 4. Paste it into `.env.local`

### 4 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAPIDAPI_KEY` | **Yes** | Your RapidAPI key for API-Football |
| `NEXT_PUBLIC_DEFAULT_TEAM_A` | No | Default Team A ID (default: `50` — Man City) |
| `NEXT_PUBLIC_DEFAULT_TEAM_B` | No | Default Team B ID (default: `42` — Arsenal) |
| `NEXT_PUBLIC_DEFAULT_LEAGUE` | No | Default League ID (default: `39` — Premier League) |
| `NEXT_PUBLIC_DEFAULT_SEASON` | No | Default season year (default: `2023`) |

> **Security:** Never commit `.env.local` to version control. It is listed in `.gitignore`.

---

## Common Team & League IDs

| Team | ID |
|------|----|
| Manchester City | 50 |
| Arsenal | 42 |
| Liverpool | 40 |
| Chelsea | 49 |
| Real Madrid | 541 |
| FC Barcelona | 529 |
| Bayern Munich | 157 |

| League | ID |
|--------|----|
| Premier League | 39 |
| La Liga | 140 |
| Bundesliga | 78 |
| Serie A | 135 |
| Ligue 1 | 61 |
| Champions League | 2 |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── football/
│   │       └── comparison/
│   │           └── route.ts      # API route — proxies RapidAPI calls
│   ├── globals.css               # Tailwind + film grain + neon styles
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx         # Root client component & state
│   │   ├── TeamFormPanel.tsx     # W/D/L badges + fixture log
│   │   ├── MidfieldRadar.tsx     # Recharts RadarChart + stat bars
│   │   ├── TeamSelector.tsx      # Search form (team/league/season IDs)
│   │   └── ErrorBanner.tsx       # API key setup guidance
│   └── ui/
│       ├── ResultBadge.tsx       # W/D/L pill component
│       ├── StatBar.tsx           # Dual-sided progress bar
│       └── Spinner.tsx           # Neon loading spinner
├── lib/
│   └── api-football.ts           # API-Football fetch helpers
└── types/
    └── football.ts               # Full TypeScript type definitions
```

---

## API Rate Limits

The free tier of API-Football allows **100 requests/day**. The app caches responses for 5 minutes (`Cache-Control: s-maxage=300`) to minimize API calls during development.

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/). After connecting your repository:

1. Go to **Settings → Environment Variables**
2. Add `RAPIDAPI_KEY` with your key value
3. Deploy

---

## License

MIT
