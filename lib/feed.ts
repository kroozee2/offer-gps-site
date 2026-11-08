import type { OneSheet } from "./one-sheet";
import { cleanSheet } from "./one-sheet";
import { cleanTrialPage, type TrialPage } from "./trial-page";

// Everything on this site comes from your Offer GPS, through your private feed link
// (the SITE_FEED setting Vercel filled in when you deployed). Edit and publish in
// Offer GPS and this site shows it within a minute. No redeploy.

export type Trial = { page: TrialPage; checkout: string; spots: string; starts: string; program: string };
export type Feed = { links: { stripe: string; calendar: string }; offer: OneSheet | null; trial: Trial | null; updatedAt: string };

export async function getFeed(): Promise<Feed | null> {
  const url = process.env.SITE_FEED;
  if (!url) return null;
  try {
    const r = await fetch(url, { next: { revalidate: 60 } });
    if (!r.ok) return null;
    const j = (await r.json()) as { links?: Feed["links"]; offer?: unknown; trial?: Partial<Trial> | null; updatedAt?: string };
    const t = j.trial;
    return {
      links: { stripe: j.links?.stripe ?? "", calendar: j.links?.calendar ?? "" },
      offer: j.offer ? cleanSheet(j.offer) : null,
      trial: t?.page ? { page: cleanTrialPage(t.page), checkout: String(t.checkout ?? ""), spots: String(t.spots ?? ""), starts: String(t.starts ?? ""), program: String(t.program ?? "") } : null,
      updatedAt: j.updatedAt ?? "",
    };
  } catch { return null; }
}
