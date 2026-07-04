# AetherPulse

Decision intelligence demo for the hackathon problem statement.

## What this app includes

- Next.js App Router structure
- API routes for ingest, analyze, and recommend
- Mock city data ingestion
- Deterministic anomaly scoring and retrieval
- Google Cloud architecture cards
- A demo dashboard with chat, charts, and automation flows

## Key files

- `app/page.js`
- `components/DashboardClient.js`
- `app/api/ingest/route.js`
- `app/api/analyze/route.js`
- `app/api/recommend/route.js`
- `lib/mock-data.js`
- `lib/analytics.js`
- `lib/workflows.js`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Demo flow

1. Switch between transit, water, and heat scenarios.
2. Ask a natural-language question.
3. Inspect the engineering log and civic explanation.
4. Show the workflow automation and Google Cloud stack.

