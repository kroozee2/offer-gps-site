import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Page views and button clicks, saved to your own Supabase (table site_events).
// Open Supabase → Table Editor → site_events to see who visited and clicked.
export async function POST(req: Request) {
  const d = db();
  if (!d) return NextResponse.json({ ok: false });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const t = (v: unknown, n = 300) => (typeof v === "string" ? v.slice(0, n) : null);
  const event = t(b.event, 40);
  if (!event || !/^(view|click)$/.test(event)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    await d.ready;
    await d.sql`insert into site_events (event, page, target, referrer, utm_source, utm_campaign)
      values (${event}, ${t(b.page)}, ${t(b.target, 500)}, ${t(b.referrer, 500)}, ${t(b.utm_source, 100)}, ${t(b.utm_campaign, 100)})`;
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false }); }
}
