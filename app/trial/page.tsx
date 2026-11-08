import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrialPageView from "@/components/TrialPageView";
import { getFeed } from "@/lib/feed";

// Your 7-day paid trial page. Turn it on in Offer GPS → Use it → Paid Trial → "Put it on my site".
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getFeed())?.trial;
  return { title: t?.program || t?.page.headline || "7-Day Trial", description: t?.page.sub || undefined };
}

export default async function Trial() {
  const t = (await getFeed())?.trial;
  if (!t) notFound();
  return <TrialPageView p={t.page} m={{ checkout: t.checkout, spots: t.spots, starts: t.starts }} />;
}
