import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceMono = localFont({
  src: [
    { path: "../public/fonts/SpaceMono-Regular.ttf", weight: "400" },
    { path: "../public/fonts/SpaceMono-Bold.ttf", weight: "700" },
  ],
  variable: "--font-space-mono",
});

const outfit = localFont({
  src: "../public/fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mixle.fun"),
  title: "Mixle — Free Daily Word Puzzle | Scrabble Meets Wordle",
  description:
    "Play Mixle, a free daily word game. Get 9 letters, build your best word, and carry unused letters forward. Scrabble-style scoring, 3 rounds, one new puzzle every day.",
  keywords: [
    "daily word game",
    "games like Wordle",
    "free word puzzle",
    "daily puzzle game",
    "Scrabble online",
    "word game no app",
    "daily brain game",
    "Wordle alternative",
    "letter arrangement game",
    "word puzzle free",
  ],
  openGraph: {
    title: "Mixle — A Free Daily Word Puzzle",
    description:
      "9 letters. Build your best word. Unused letters carry over. One new puzzle every day. Free, no login.",
    url: "https://www.mixle.fun",
    siteName: "Mixle",
    type: "website",
    images: [
      {
        url: "https://www.mixle.fun/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mixle — Daily Word Puzzle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mixle — Free Daily Word Puzzle",
    description:
      "9 letters, 3 rounds, Scrabble-style scoring. One new puzzle every day.",
    images: ["https://www.mixle.fun/og-image.png"],
  },
  alternates: {
    canonical: "https://www.mixle.fun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${outfit.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Mixle",
              url: "https://www.mixle.fun",
              description:
                "A free daily word puzzle where players get 9 letters, build words for Scrabble-style points, and carry unused letters forward across 3 rounds.",
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              browserRequirements: "Requires a modern web browser",
              creator: {
                "@type": "Organization",
                name: "Paper Napkin Projects",
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
