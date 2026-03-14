import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "Mixle — Daily Word Game",
  description:
    "Get 9 letters, make your best word. Unused letters carry over. 3 rounds, daily leaderboard!",
  openGraph: {
    title: "Mixle — Daily Word Game",
    description:
      "Get 9 letters, make your best word. Unused letters carry over. 3 rounds, daily leaderboard!",
    type: "website",
    url: "https://www.mixle.fun",
  },
  twitter: {
    card: "summary_large_image",
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
        {children}
      </body>
    </html>
  );
}
