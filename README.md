# Email Sender — Next.js version

Full conversion of the Express + vanilla JS app to Next.js (React + API routes).
All 7 pages and 25 backend routes are ported with the same functionality.

## Pages
- `/` — connect via Google, or log in with email+password
- `/connected` — add/edit your Google Sheet
- `/campaign` — compose and send a campaign (rich text editor, Cc/Bcc, attachments)
- `/set-password` — set or change your password
- `/profile` — account dashboard, usage stats, disconnect
- `/upgrade` — plan comparison + bank-transfer upgrade request
- `/admin` — approve/reject pending upgrade requests

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your real values
3. **Important:** your Google Cloud OAuth redirect URI must now be:
   `http://localhost:3000/api/oauth/callback` (note `/api/` — Next.js requires API routes to live there)
4. `npm run dev` → open http://localhost:3000

## Deploying
- `npm run build` then `npm start` on any always-on Node host (Render, a VPS, etc.) — works exactly like the original.
- **Client data storage (`data/clients.json`) — required on Render:** Render's Free web services have no durable disk at all — the filesystem resets on every redeploy, crash-restart, and inactivity spin-down/spin-up, which wipes profiles, plans, and trial timers. `lib/store.js` now stores clients in **Upstash Redis** (free tier) instead:
  1. Create a free Redis database at https://console.upstash.com
  2. Copy its **REST URL** and **REST Token** from the database's details page
  3. Add these env vars on your Render service: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  4. Redeploy.
  - Without those env vars set, `lib/store.js` falls back to the old local JSON file — fine for local dev, but it will keep resetting on Render (Free or otherwise, unless you separately attach a paid Persistent Disk and set `DATA_DIR`).
  - `readClients`/`saveClients`/`touchLastSeen` are now `async` — every call site in `pages/api/*` and `lib/*` awaits them.
- **If deploying to a serverless platform (Vercel):** the campaign-status tracker and login-attempt throttle live in server memory (same design as the original Express app). Serverless instances are short-lived, so this in-memory state can be lost between requests. Swap `campaignStatus`/`loginAttempts` in `lib/plans.js` and `pages/api/login.js` for something external (e.g. Upstash Redis) if you deploy there. Everything else works unchanged.

## What changed structurally vs. the Express version
- Routes moved from `/auth/google`, `/oauth/callback` etc. to `/api/auth/google`, `/api/oauth/callback` (Next.js requirement)
- Each `.html` page is now a React component in `pages/`, using the same visual design and (mostly) the same DOM-driven logic as before — the rich text editor, drag-and-drop attachments, and live polling still work exactly as they did
- `clients.json` still lives in `data/clients.json` — same simple JSON-file storage as before
