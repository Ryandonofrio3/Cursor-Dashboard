import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";


export const metadata: Metadata = {
  title: "Cursor Sentiment Dashboard",
  description: "A dashboard for sentiment analysis of Cursor Forum posts",
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`antialiased bg-black font-sans`}>
        {children}
      </body>
    </html>
  );
}
