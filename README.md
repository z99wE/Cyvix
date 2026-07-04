# CyVix

CyVix is a civic decision intelligence platform for the Google Cloud hackathon brief. It turns fragmented city signals into an explainable decision packet that helps public teams detect issues early, understand why they matter, and trigger the next action.

## 1. How We Approached The Problem Statement

We translated the broad problem statement into a focused product: a civic operations layer that can ingest structured and unstructured data, score risk, retrieve similar incidents, explain outcomes in natural language, and trigger follow-up workflows.

The solution maps directly to the Google Cloud ecosystem:

- `BigQuery` stores the city baseline and scenario history. The app now queries it when dataset and table env vars are configured.
- `Vertex AI` performs risk scoring and prediction.
- `Gemini` turns outputs into plain-language explanations.
- `AlloyDB` stores and retrieves similar incidents and playbooks.
- `Cloud Run` serves the app shell and decision APIs.
- `Cloud Functions` handles automated follow-up actions.
- `Agent Development Kit (ADK)` orchestrates the observe -> reason -> retrieve -> explain -> act loop.
- `Looker` represents the leadership and operations dashboard layer.
- `Cloud Storage` and `Dataflow` are used in the data-ingest story. The app now writes ingest batches to a bucket when configured.

The current build is fully demoable with local mock data and deterministic decision logic. It does not require live Google keys to run locally, but the code and documentation are structured so those services can be swapped in cleanly.

Live cloud-backed behavior now works for:

- BigQuery reads for scenario baseline context
- Cloud Storage writes for ingest batches

Those features fall back to local demo mode if the cloud env vars are missing.

If you add provider keys in `.env.local`, the app will enrich the civic summaries with live LLM output:

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
| Cloud Run | API hosting and app shell | Represented as the service shell |
| Cloud Functions | Workflow automation and alerts | Represented in recommendation flow |
| Looker | Leadership dashboard and drill-down | Represented in product/storyboard layer |
| Agent Development Kit (ADK) | Multi-step orchestration | Visible in the agent trace |

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

### Efficiency

- Deterministic local scoring for fast demo response
- Small API payloads and reusable scenario data
- SVG-based charts instead of heavyweight chart libraries
- Client-side motion without unnecessary state churn

### Accessibility

- Semantic HTML sections and landmarks
- Keyboard-friendly navigation anchors
- High-contrast text and visible interactive states
- `cursor-none` is paired with a custom cursor, not a hidden pointer
- Content remains readable and responsive on smaller screens

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
- `LOOKER_INSTANCE_URL`
- `LOOKER_CLIENT_ID`
- `LOOKER_CLIENT_SECRET`

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

## Demo Notes

- Switch between scenarios to show different city conditions.
- Ask a natural-language question to trigger the decision engine.
- Use the sidebar to jump between product sections.
- Show the agent trace, tool calls, and counterfactual to explain how the system works.
- Point to the Google Cloud mapping to demonstrate that the solution is grounded in real platform primitives.
