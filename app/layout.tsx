import type { Metadata } from "next";
import "./globals.css";
import Track from "@/components/Track";
import { getFeed } from "@/lib/feed";

export async function generateMetadata(): Promise<Metadata> {
  const f = await getFeed();
  const b = f?.offer?.brand;
  return {
    title: b ? [b.name, b.sub].filter(Boolean).join(" ") || "Private Invitation" : "Private Invitation",
    description: b?.tagline || f?.offer?.headline || undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<Track /></body>
    </html>
  );
}
