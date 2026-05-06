-- Run this in Supabase SQL Editor before seeding

CREATE TABLE IF NOT EXISTS matches (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  div         TEXT    NOT NULL,          -- 'E0' = Premier League
  season      TEXT    NOT NULL,          -- '2024/25'
  date        DATE    NOT NULL,
  home_team   TEXT    NOT NULL,
  away_team   TEXT    NOT NULL,
  fthg        INT,                       -- Full Time Home Goals
  ftag        INT,                       -- Full Time Away Goals
  ftr         CHAR(1),                   -- Full Time Result: H / D / A
  hthg        INT,                       -- Half Time Home Goals
  htag        INT,                       -- Half Time Away Goals
  htr         CHAR(1),                   -- Half Time Result
  hs          INT,                       -- Home Shots
  aws         INT,                       -- Away Shots  (AS is reserved)
  hst         INT,                       -- Home Shots on Target
  ast         INT,                       -- Away Shots on Target
  hf          INT,                       -- Home Fouls
  af          INT,                       -- Away Fouls
  hc          INT,                       -- Home Corners
  ac          INT,                       -- Away Corners
  hy          INT,                       -- Home Yellow Cards
  ay          INT,                       -- Away Yellow Cards
  hr          INT,                       -- Home Red Cards
  ar          INT,                       -- Away Red Cards
  b365h       NUMERIC(7,2),              -- Bet365 Home Win Odds
  b365d       NUMERIC(7,2),              -- Bet365 Draw Odds
  b365a       NUMERIC(7,2),             -- Bet365 Away Win Odds
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast team lookups
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team);
CREATE INDEX IF NOT EXISTS idx_matches_date      ON matches(date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_season    ON matches(season);
CREATE INDEX IF NOT EXISTS idx_matches_div       ON matches(div);

-- Composite index: team form queries (home OR away, ordered by date)
CREATE INDEX IF NOT EXISTS idx_matches_team_date
  ON matches(home_team, away_team, date DESC);
