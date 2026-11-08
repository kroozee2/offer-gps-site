# Offer GPS Site

Your offer pages on your own website, built from your **Offer GPS** in the 7-Figure CEO AI Mastermind portal.

- **Your Vercel**: the site runs on your own free Vercel account.
- **Your Supabase**: page views and button clicks are saved in your own database (`site_events`).
- **Your Stripe or calendar**: every button goes to your Stripe payment link, or your booking calendar.

## Set it up (about 3 minutes)

Do it from the portal: **Offer GPS → Use it → One-Sheeter → Put it on your own site**. That button fills in your private link for you.

1. Click **Deploy to my Vercel + Supabase**.
2. Sign in to Vercel with GitHub. Press **Create**, then **Deploy**. Vercel makes your Supabase database on the way.
3. Copy your live link back into the portal.

That's it. Edit and publish in Offer GPS and this site updates within a minute.

## Your pages

| Page | Turn it on in Offer GPS |
| --- | --- |
| `/` One-sheeter | Use it → One-Sheeter → Publish |
| `/trial` 7-day paid trial | Use it → Paid Trial → Put it on my site |

## Settings

| Setting | What it is |
| --- | --- |
| `SITE_FEED` | Your private Offer GPS link. Filled in by the portal. |
| `POSTGRES_URL` | Your Supabase database. Filled in by Vercel's Supabase setup. |

## Your own domain

Vercel → your project → **Settings → Domains** → add your domain and follow the two DNS steps.

## See your visitors

Supabase → **Table Editor → site_events**: every page view and every click on your buttons, with where people came from.
