# CyVix

CyVix is a civic decision intelligence platform for the Google Cloud hackathon brief. It turns fragmented city signals into an explainable decision packet that helps public teams detect issues early, understand why they matter, and trigger the next action.

Live demo:

- [Cloud Run deployment](https://cyvix-895728166282.asia-south1.run.app)

## Pitch Summary

CyVix turns civic data into a decision engine.

The app is designed for city operations, public service, and community resilience teams that need to understand what is happening, why it matters, and what to do next. It combines real cloud-backed data reads, live model reasoning, an explainable workflow trace, and a decision workspace that feels like a real SaaS product instead of a one-screen demo.

### One-line pitch

**CyVix is an AI civic decision intelligence platform that helps cities detect risk early, explain it clearly, and act faster.**

### Why this submission is strong

- It addresses a real workflow bottleneck, not a fictional AI use case.
- It has a live app on Cloud Run, not only screenshots or mockups.
- It includes a working BigQuery baseline, Vertex-backed analysis, and signed-session auth.
- It shows the full decision loop: ingest, analyze, explain, recommend, and act.
- It documents the architecture and evidence clearly in the repo.

### What makes it feel like a product

- Multi-section SaaS layout with navigation
- Live operations panel and Looker-style reporting surface
- Scenario switching, question input, and response trace
- Auth, rate limiting, and brief model caching
- Clear distinction between live features and scaffolded evidence

## Live Stack Status

The demo is explicit about what is live today versus what is represented as product architecture.

| Service | Current Status | Notes |
| --- | --- | --- |
| Cloud Run | Live | Hosts the deployed app and API routes |
| BigQuery | Live | Used for scenario baseline reads when configured |
| Cloud Storage | Live | Writes ingest batches when configured |
| Looker | Scaffolded evidence | Faux enterprise dashboard artifact and UI panel are included in the repo |
| Managed Service for Apache Spark | Scaffolded evidence | Demo job artifact is included for batch-processing storytelling |
| Google Kubernetes Engine | Scaffolded evidence | Deployment manifest is included and referenced from the README |
| Gemini Enterprise Agent Platform | Scaffolded evidence | Agent YAML artifact and trace files are included in the repo |

The broader Google Cloud narrative in the UI and README also maps to:

- `Vertex AI` for prediction and scoring language
- `Gemini` for explanation synthesis language
- `AlloyDB` for retrieval and incident memory language
- `Cloud Functions` for workflow automation language
- `Agent Development Kit (ADK)` for orchestration language

Those layers are represented by the decision engine, agent trace, and UI copy today, while BigQuery, Cloud Storage, and Cloud Run are the live cloud-backed pieces. The remaining Google services now have explicit scaffold files so the architecture reads like a production-ready plan instead of a flat mockup.

## Google Stack Evidence

The repository now includes concrete artifacts for the services referenced in the demo:

- [Looker dashboard artifact](./integrations/looker/cyvix-dashboard.json)
- [GKE deployment manifest](./k8s/gke/cyvix.yaml)
- [Gemini Enterprise Agent Platform artifact](./integrations/gemini-enterprise-agent-platform/cyvix-agent.yaml)
- [Managed Service for Apache Spark job](./integrations/spark/cyvix-spark-job.py)
- [ADK lifecycle trace](./integrations/adk/cyvix-adk-trace.json)

These files are intentionally lightweight, but they make the submission auditable and easy to extend into live Google Cloud integrations.

## 1. How We Approached The Problem Statement

We translated the broad problem statement into a focused product: a civic operations layer that can ingest structured and unstructured data, score risk, retrieve similar incidents, explain outcomes in natural language, and trigger follow-up workflows.

The solution maps directly to the Google Cloud ecosystem:

- `BigQuery` stores the city baseline and scenario history. The app now queries it when dataset and table env vars are configured.
- `Vertex AI` performs risk scoring and prediction in the product narrative.
- `Gemini` turns outputs into plain-language explanations in the product narrative.
- `AlloyDB` stores and retrieves similar incidents and playbooks in the product narrative.
- `Cloud Run` serves the app shell and decision APIs live.
- `Cloud Functions` handles automated follow-up actions in the product narrative.
- `Agent Development Kit (ADK)` orchestrates the observe -> reason -> retrieve -> explain -> act loop in the product narrative.
- `Looker` represents the leadership and operations dashboard layer in the product narrative.
- `Cloud Storage` and `Dataflow` are used in the data-ingest story. The app now writes ingest batches to a bucket when configured.

The current build is fully demoable with local mock data and deterministic decision logic. It does not require live Google keys to run locally, but the code and documentation are structured so those services can be swapped in cleanly.

Live cloud-backed behavior now works for:

- BigQuery reads for scenario baseline context
- Cloud Storage writes for ingest batches
- Cloud Run deployment for the live demo URL

Those features fall back to local demo mode if the cloud env vars are missing.

If you add provider keys in `.env.local`, the app will enrich the civic summaries with live LLM output:

- `MODEL_ROUTING` controls provider priority, for example `vertex,gemini,groq,nim,local`
- `VERTEX_PROJECT_ID`
- `VERTEX_LOCATION`
- `VERTEX_MODEL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `NVIDIA_NIM_API_KEY`
- `NVIDIA_NIM_BASE_URL`
- `NVIDIA_NIM_MODEL`
- `GOOGLE_CLOUD_PROJECT`
- `GCP_PROJECT_ID`
- `BIGQUERY_DATASET`
- `BIGQUERY_TABLE`
- `BIGQUERY_LOCATION`
- `GCS_BUCKET`

Use Cloud Run environment variables or Secret Manager for anything sensitive. Do not hardcode API keys in the repo if you want the submission to stay secure.

## 2. Real-World Problem And Practical Impact

Modern communities generate data from transit, utilities, weather, wellness signals, citizen feedback, and service logs. The hard part is not collecting data. The hard part is turning it into a decision that a city team can trust quickly.

CyVix helps with:

- Faster detection of service failures and neighborhood risk.
- Better prioritization for city operations teams.
- Clearer resident communication through explainable summaries.
- Better response coordination across departments.
- A single view for individual, organizational, and civic decision-making.

Example use cases:

- Transit delay escalation
- Water pressure drift
- Heat resilience and wellness risk
- Citizen service triage
- Emergency preparedness and recovery

## 3. Core Architecture And Workflow

CyVix follows a decision-intelligence pipeline rather than a static dashboard:

1. Ingest multi-source city data.
2. Normalize and baseline the signals.
3. Score anomaly and likely impact.
4. Retrieve similar incidents and playbooks.
5. Generate a civic explanation.
6. Propose the next best action.
7. Trigger automation and publish the decision trace.

```mermaid
flowchart LR
  A[City signals<br/>Transit, weather, wellness, feedback] --> B[Cloud Storage / Dataflow]
  B --> C[BigQuery baseline store]
  C --> D[Vertex AI risk scoring]
  D --> E[AlloyDB similar incident retrieval]
  E --> F[Gemini explanation synthesis]
  F --> G[ADK orchestration]
  G --> H[Cloud Run app + API]
  G --> I[Cloud Functions automation]
  H --> J[Looker decision view]
  I --> J
```

### Decision Engine In The Repo

The current repo uses a local, deterministic decision engine so the demo works without external credentials:

- `lib/analytics.js` scores the scenario and builds the explanation.
- `lib/workflows.js` converts analysis into a recommendation packet.
- `lib/adk.js` builds the agent lifecycle trace.
- `lib/decision-engine.js` fuses the above into one decision object.
- `app/api/*` exposes the ingest, analyze, recommend, agent, and decision routes.

This gives the app a real backend shape now, while keeping it ready for a live Google Cloud swap later.

## 4. Opportunity And USP

CyVix is different from a generic civic dashboard because it does not stop at visualization.

USP:

- It produces a decision packet, not just charts.
- It shows the evidence trail, confidence, and counterfactual.
- It combines structured data, text signals, and historical memory.
- It makes the ADK lifecycle visible.
- It can be extended into live Google Cloud workflows without redesigning the product.

Why it stands out:

- Most hackathon apps show data.
- CyVix shows what to do next and why.
- Most apps are one-page demos.
- CyVix is structured like a real SaaS with navigation, product sections, and operational views.

## 5. Features

- Multi-scenario civic risk demo
- Natural-language query box
- Rolling agent trace and tool-call view
- Google Cloud service mapping
- Looker-style embed shell with filters and drill-down tabs
- Signal fabric and baseline scoring
- Similar incident retrieval
- Civic explanation generation
- Recommendation and automation packet
- Counterfactual preview if the city delays action
- Sidebar navigation and multi-section SaaS layout
- Accessible buttons, semantic sections, and keyboard-friendly anchors

## 6. Process Flow Diagram

```mermaid
flowchart TD
  U[User asks a civic question] --> I[Ingest scenario data]
  I --> B[Build baseline and signals]
  B --> S[Score risk and predict impact]
  S --> R[Retrieve similar incidents]
  R --> E[Explain in civic language]
  E --> A[Recommend next best action]
  A --> X[Trigger workflow / notify / update view]
```

### Use-Case View

```mermaid
flowchart LR
  P[Public user] --> Q[Ask a question]
  O[Operations team] --> V[View decision packet]
  C[Civic leadership] --> L[Review Looker-style summary]
  S[Service automation] --> T[Cloud Functions trigger]
  Q --> E[CyVix engine]
  E --> V
  E --> L
  E --> T
```

## 7. Architecture Diagram

```mermaid
flowchart TB
  subgraph Client["Client / Frontend"]
    UI["Next.js + React + Tailwind + Framer Motion"]
  end

  subgraph API["App Router API Layer"]
    INGEST["/api/ingest"]
    ANALYZE["/api/analyze"]
    RECOMMEND["/api/recommend"]
    AGENT["/api/agent"]
    DECISION["/api/decision"]
    PLATFORM["/api/platform"]
    DEMO["/api/demo"]
  end

  subgraph Engine["Decision Engine"]
    ANALYTICS["analytics.js"]
    WORKFLOWS["workflows.js"]
    ADK["adk.js"]
    FUSION["decision-engine.js"]
  end

  subgraph Data["Data And Memory"]
    MOCK["mock-data.js"]
    BIGQUERY["BigQuery baseline"]
    ALLOY["AlloyDB retrieval"]
    STORAGE["Cloud Storage / Dataflow"]
  end

  subgraph Google["Google Cloud Services"]
    VERTEX["Vertex AI"]
    GEMINI["Gemini"]
    CLOUDRUN["Cloud Run"]
    CLOUDFUN["Cloud Functions"]
    LOOKER["Looker"]
    ADKGS["Agent Development Kit"]
  end

  UI --> API
  UI --> PLATFORM
  UI --> DEMO
  API --> FUSION
  FUSION --> ANALYTICS
  FUSION --> WORKFLOWS
  FUSION --> ADK
  ANALYTICS --> MOCK
  WORKFLOWS --> MOCK
  ADK --> MOCK
  FUSION -. maps to .-> VERTEX
  FUSION -. maps to .-> GEMINI
  FUSION -. maps to .-> BIGQUERY
  FUSION -. maps to .-> ALLOY
  FUSION -. maps to .-> CLOUDRUN
  FUSION -. maps to .-> CLOUDFUN
  FUSION -. maps to .-> LOOKER
  FUSION -. maps to .-> ADKGS
  STORAGE -. ingest story .-> BIGQUERY
```

## 8. Technologies / Google / NVIDIA Services Used

### Frontend And App Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Framer Motion
- Lucide React

### Google Cloud Services Represented In The Solution

| Service | Role In CyVix | Status |
| --- | --- | --- |
| Cloud Storage | Raw city feed landing zone | Live ingest writes when `GCS_BUCKET` is configured |
| Dataflow | Stream normalization and joins | Modeled in the ingest story |
| BigQuery | Historical baseline and feature layer | Live reads when dataset and table env vars are configured |
| Vertex AI | Risk scoring and prediction | Represented in analysis and decision packets |
| Gemini | Natural-language explanation layer | Represented in the agent story |
| AlloyDB | Similar-incident retrieval and memory | Represented in retrieval flow |
| Cloud Run | API hosting and app shell | Live deployment URL is published above |
| Cloud Functions | Workflow automation and alerts | Represented in recommendation flow |
| Looker | Leadership dashboard and drill-down | Scaffolded in repo and surfaced in the UI |
| Agent Development Kit (ADK) | Multi-step orchestration | Visible in the agent trace |
| Managed Service for Apache Spark | Batch processing layer | Scaffolded in repo as a demo job artifact |
| Google Kubernetes Engine | Container orchestration layer | Scaffolded in repo as a deployment manifest |
| Gemini Enterprise Agent Platform | Managed agent platform | Scaffolded in repo as an agent artifact and trace |

### Live LLM Routing

The backend routes model requests in this order:

1. Vertex AI, when `VERTEX_PROJECT_ID`, `VERTEX_LOCATION`, and `VERTEX_MODEL` are set.
2. Gemini API, when `GEMINI_API_KEY` is set.
3. Groq, when `GROQ_API_KEY` is set.
4. NVIDIA NIM, when `NVIDIA_NIM_API_KEY` is set.
5. Local deterministic fallback, when no model key is configured.

That routing is controlled by `MODEL_ROUTING`, and the app caches model output briefly to avoid repeated calls for the same prompt.

In the live Cloud Run deployment, Vertex AI is configured as the first route with `VERTEX_LOCATION=us-central1` and `VERTEX_MODEL=gemini-2.5-flash`, which returns real generated output for the analysis endpoint.

### NVIDIA Services

The current submission does not depend on NVIDIA services. The architecture is centered on the Google Cloud stack requested in the brief. If needed later, GPU-accelerated inference or NVIDIA tooling can be added as an optional runtime layer, but it is not part of the current demo.

## 9. Code Quality, Security, Efficiency, And Accessibility Checks

### Code Quality

- Semantic sections and structured components
- Clear separation between UI, API, analytics, workflows, and agent orchestration
- Reusable mock-data and decision-engine layers
- Build verification completed successfully

### Security

- No secrets committed to the repo
- Demo runs locally without API keys
- External integrations are isolated behind API routes
- Sensitive production credentials are intended to live in environment variables
- API routes validate request methods, sanitize inputs, and apply a simple per-client rate limit
- Middleware sets security headers and disables caching for API responses
- Provider responses are cached briefly to reduce repeated model calls and lower latency
- Signed-session auth is available through `/api/auth/signup`, `/api/auth/me`, and `/api/auth/logout`

### Efficiency

- Deterministic local scoring for fast demo response
- Small API payloads and reusable scenario data
- SVG-based charts instead of heavyweight chart libraries
- Client-side motion without unnecessary state churn
- Reduced-motion support keeps animations from overwhelming sensitive users

### Accessibility

- Semantic HTML sections and landmarks
- Keyboard-friendly navigation anchors
- High-contrast text and visible interactive states
- `cursor-none` is paired with a custom cursor, not a hidden pointer
- Content remains readable and responsive on smaller screens
- `:focus-visible` styling is present for interactive controls
- Animations respect `prefers-reduced-motion`

## 10. Why This Maps To The Hackathon Rubric

This section is the fastest way to understand why CyVix is a strong submission.

### Real-World User

- City operations staff
- Emergency coordinators
- Public works teams
- Civic leadership reviewing ward-level risk

### Real-World Problem

- Fragmented city data creates slow, manual decision-making.
- Teams need a fast way to identify risk, compare neighborhoods, and pick the next action.

### Data-Driven Workflow

1. Collect city signals and scenario data.
2. Normalize the data into a baseline.
3. Score the risk and confidence.
4. Compare against similar incidents and other wards.
5. Generate a recommendation and counterfactual.
6. Surface the result in a workspace a team can act on immediately.

### Useful Output

- Risk score
- Projected impact
- Recommendation
- Counterfactual if action is delayed
- Trend and comparison view
- Report-style workspace for decision review

### Acceleration Benefit

- Faster time-to-insight
- Less manual interpretation of raw logs
- Better ward comparison at a glance
- Faster handoff from signal to action
- More responsive operations during service issues

### Google Cloud Coverage

- `BigQuery` for baseline reads and history
- `Cloud Storage` for ingest bundles and demo artifacts
- `Cloud Run` for the live application
- `Looker` for the reporting artifact and workspace story
- `Google Kubernetes Engine` for the deployment manifest
- `Managed Service for Apache Spark` for the batch-processing artifact
- `Gemini Enterprise Agent Platform` for the agent artifact and trace

## 11. Demo Script

Use this if you want to present the app in under two minutes.

1. Open the live app and show the hero.
2. Switch between workspace modes.
3. Pick a different ward card.
4. Enter a question like "Why is this ward flagged?"
5. Show the risk score, recommendation, and counterfactual.
6. Open the operations/report panel.
7. Point to the evidence files in the README.

## 12. Repo Tour

- [`app/page.js`](/Users/souvikchakraborty/Decision_Intel/app/page.js) contains the interactive workspace and scenario flow.
- [`app/api/*`](/Users/souvikchakraborty/Decision_Intel/app/api) contains the scoring, recommendation, ingestion, and demo endpoints.
- [`components/looker-workspace.jsx`](/Users/souvikchakraborty/Decision_Intel/components/looker-workspace.jsx) contains the workspace/report panel.
- [`lib/decision-engine.js`](/Users/souvikchakraborty/Decision_Intel/lib/decision-engine.js) fuses analysis, workflow, and agent trace data.
- [`integrations/`](/Users/souvikchakraborty/Decision_Intel/integrations) contains the evidence artifacts for the Google stack.
- [`k8s/gke/cyvix.yaml`](/Users/souvikchakraborty/Decision_Intel/k8s/gke/cyvix.yaml) contains the container deployment manifest.

## Environment Keys For Production Integration

The current demo works without keys. For live Google Cloud integration, wire the following through environment variables or secret managers:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `NVIDIA_NIM_API_KEY`
- `NVIDIA_NIM_BASE_URL`
- `NVIDIA_NIM_MODEL`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GOOGLE_CLOUD_PROJECT`
- `BIGQUERY_DATASET`
- `BIGQUERY_TABLE`
- `BIGQUERY_LOCATION`
- `GCS_BUCKET`
- `VERTEX_LOCATION`
- `ALLOYDB_CONNECTION_URL`
- `GEMINI_API_KEY` or service-account based Gemini access
- `LOOKER_DASHBOARD_TITLE`
- `LOOKER_DASHBOARD_URL`
- `LOOKER_EMBED_URL`
- `LOOKER_INSTANCE_URL`
- `LOOKER_CLIENT_ID`
- `LOOKER_CLIENT_SECRET`
- `GKE_CLUSTER_NAME`
- `GKE_LOCATION`
- `GKE_NAMESPACE`
- `GKE_IMAGE`
- `AUTH_SECRET`
- `AUTH_INVITE_CODE`
- `AUTH_REQUIRED`

### What Is Actually Live Today

- `BigQuery`: yes, used by the live app for scenario baseline reads when the dataset and table env vars are set.
- `Cloud Storage`: yes, used by the live app for ingest batch writes when `GCS_BUCKET` is set.
- `Cloud Run`: yes, the demo is deployed and reachable at the live URL above.
- `Vertex AI`: yes, live model routing is enabled in Cloud Run and the analysis route returns generated output.
- `Signed-session auth`: yes, `/api/auth/signup` creates a secure cookie-backed session in the deployed app.
- `Looker`: scaffolded in the repo as a dashboard artifact and represented in the UI.
- `Managed Service for Apache Spark`: scaffolded in the repo as a demo batch job artifact.
- `Google Kubernetes Engine`: scaffolded in the repo as a deployment manifest.
- `Gemini Enterprise Agent Platform`: scaffolded in the repo as an agent artifact and trace.
- `Gemini`, `AlloyDB`, `Cloud Functions`, `ADK`: represented in the architecture, trace, and copy, with a path to wire them into live Google APIs later.

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

### Google Cloud Setup For Live Data

If you want the real BigQuery and Cloud Storage paths to run locally, authenticate the Google Cloud CLI first:

```text
gcloud auth application-default login
gcloud config set project gcp-apac-501407
```

Expected BigQuery table shape for baseline reads:

- `scenario_id`
- `risk_score`
- `confidence`
- `summary`
- `updated_at`

Expected Cloud Storage bucket behavior:

- The ingest route writes JSON batches to `gs://$GCS_BUCKET/cyvix/ingest/...`

### BigQuery Seed Script

Use this when you want the scenario baseline table populated immediately:

```bash
npm run seed:bigquery
```

What it does:

- Seeds the `cyvix_demo.scenario_baselines` table from the local scenario catalog.
- Creates the dataset and table if they do not already exist.
- Inserts flattened scenario rows with risk, confidence, summaries, and trace fields.

Expected environment:

- `GCP_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT`
- `BIGQUERY_DATASET`
- `BIGQUERY_TABLE`
- `BIGQUERY_LOCATION` or `GCP_REGION`

### Demo Initializer

Use this when you want the full demo bundle initialized in one pass:

```bash
npm run demo:init
```

What it does:

- Seeds BigQuery with the scenario baseline rows.
- Writes a demo manifest and seed bundle to Cloud Storage when `GCS_BUCKET` is configured.
- Mirrors the status information that the in-app demo panel shows through `/api/demo`.

### GKE Deployment Path

The app is also container-ready for GKE:

- `Dockerfile` builds the Next.js app into a production container.
- `k8s/gke/cyvix.yaml` contains the namespace, deployment, and service.

Suggested path:

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/cyvix:latest .
kubectl apply -f k8s/gke/cyvix.yaml
kubectl -n cyvix rollout status deployment/cyvix
```

## Demo Notes

