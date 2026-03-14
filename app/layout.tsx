import type { Metadata } from "next";
import { Space_Mono, Outfit } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Mixle — Daily Word Game",
  description:
    "Pick letters, rearrange them, and build the highest-scoring word. New puzzle every day!",
  openGraph: {
    title: "Mixle — Daily Word Game",
    description:
      "Pick letters, rearrange them, and build the highest-scoring word. New puzzle every day!",
    type: "website",
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
