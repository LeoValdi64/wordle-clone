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
  title: "Wordle Clone - Free Word Guessing Puzzle Game",
  description:
    "Play Wordle Clone, a free word guessing puzzle game. Guess the hidden 5-letter word in 6 tries with color-coded hints. Built with Next.js.",
  openGraph: {
    title: "Wordle Clone - Free Word Guessing Puzzle Game",
    description:
      "Play Wordle Clone, a free word guessing puzzle game. Guess the hidden 5-letter word in 6 tries with color-coded hints. Built with Next.js.",
    images: ["/og-image.png"],
    url: "https://wordle-clone-psi-ten.vercel.app",
  },
  alternates: {
    canonical: "https://wordle-clone-psi-ten.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Wordle Clone",
              description:
                "A free word guessing puzzle game. Guess the hidden 5-letter word in 6 tries with color-coded hints.",
              url: "https://wordle-clone-psi-ten.vercel.app",
              applicationCategory: "Game",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
