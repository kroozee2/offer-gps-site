import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JoinPageView from "@/components/JoinPageView";
import { getFeed } from "@/lib/feed";

// Your free Skool community's join page. Turn it on in Offer GPS → Use it → Skool → "Put it on my site".
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const j = (await getFeed())?.join;
  return { title: j?.name ? `Join ${j.name}` : "Join the community", description: j?.sub || j?.headline || undefined };
}

export default async function JoinPage() {
  const j = (await getFeed())?.join;
  if (!j) notFound();
  return <JoinPageView j={j} />;
}
