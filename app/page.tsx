import OneSheetView from "@/components/OneSheetView";
import { getFeed } from "@/lib/feed";

export const revalidate = 60;

export default async function Home() {
  const f = await getFeed();
  if (f?.offer) return <OneSheetView s={f.offer} />;
  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0f] px-6 text-center text-white">
      <div className="max-w-md space-y-3">
        <div className="text-4xl">🧾</div>
        <h1 className="text-2xl font-extrabold">Your site is live</h1>
        <p className="text-white/70">{process.env.SITE_FEED ? "Publish your one-sheeter in Offer GPS and it shows up here within a minute." : "This site isn't connected yet. In Vercel, add SITE_FEED (your link from Offer GPS → One-Sheeter → Put it on your own site) and redeploy."}</p>
      </div>
    </main>
  );
}
