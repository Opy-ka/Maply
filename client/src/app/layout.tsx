import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maply — Cognitive AI Concept Mapping | FILKOM UB",
  description: "Neo-Brutalist Concept Mapping & Evaluation for ICONFEST 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

