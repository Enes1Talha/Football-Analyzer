import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Football Analyzer | Data & Form",
  description:
    "Cinematic football data dashboard — compare team form, midfield stats, and match results powered by API-Football.",
  keywords: ["football", "soccer", "analytics", "form", "stats", "API-Football"],
  openGraph: {
    title: "Football Analyzer",
    description: "Real-time football data & form comparison dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased film-grain min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
