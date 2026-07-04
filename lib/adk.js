import { getScenario } from "./mock-data.js";

export function buildAgentRun({ scenarioId, analysis = null }) {
  const scenario = getScenario(scenarioId);
  const title = scenario.action;
  const confidence = analysis?.metrics?.confidence ?? Math.round(scenario.confidence * 100);

  return {
    agent: "AetherOps Agent",
    framework: "Google ADK",
    objective: `Resolve ${scenario.ward} service risk`,
    confidence,
    state: confidence >= 90 ? "execute" : "review",
    memory: [
      "Observed stream anomalies and public complaints",
      "Retrieved similar incidents from AlloyDB / pgvector",
      "Prepared a city-safe recommendation with plain-language explanation"
    ],
    tools: [
      "BigQuery signal query",
      "Vertex AI reasoning",
      "Gemini response synthesis",
      "AlloyDB retrieval",
      "Looker context overlay",
      "Cloud Run notification",
      "Cloud Functions workflow"
    ],
    toolCalls: [
      {
        service: "BigQuery",
        action: "Query neighborhood baseline",
        detail: "Pulled ward-level trend history and seasonal variance."
      },
      {
        service: "Vertex AI",
        action: "Score anomaly",
        detail: "Calculated probability of service degradation from combined signals."
      },
      {
        service: "Gemini",
        action: "Draft explanation",
        detail: "Turned model output into civic language for residents and operators."
      },
      {
        service: "AlloyDB",
        action: "Retrieve similar incidents",
        detail: "Matched the current pattern against prior city events and playbooks."
      },
      {
        service: "Looker",
        action: "Surface decision context",
        detail: "Prepared a ward-level executive view for operational review."
      },
      {
        service: "Cloud Functions",
        action: "Trigger workflow",
        detail: "Prepared alert and ticket automation for the response team."
      },
      {
        service: "Cloud Run",
        action: "Serve update",
        detail: "Published the resident-facing incident summary and next steps."
      }
    ],
    lifecycle: [
      {
        stage: "Observe",
        service: "BigQuery",
        note: "Ingest structured and unstructured ward signals."
      },
      {
        stage: "Reason",
        service: "Vertex AI",
        note: "Combine telemetry, complaints, and forecasts into a risk score."
      },
      {
        stage: "Retrieve",
        service: "AlloyDB",
        note: "Find similar incidents and the most relevant playbook."
      },
      {
        stage: "Explain",
        service: "Gemini",
        note: "Produce a civic summary and a technical trace side by side."
      },
      {
        stage: "Act",
        service: "Cloud Run",
        note: "Trigger notifications, update the dashboard, and create tickets."
      },
      {
        stage: "Follow up",
        service: "Cloud Functions",
        note: "Recheck the ward and escalate if the signal persists."
      }
    ],
    plan: [
      { step: "Observe", detail: "Ingest structured and unstructured data from the ward." },
      { step: "Reason", detail: `Use Vertex AI to compare the signal against neighborhood baselines.` },
      { step: "Retrieve", detail: "Pull similar incidents and playbooks with pgvector." },
      { step: "Recommend", detail: `Present ${title.toLowerCase()} as the next best action.` },
      { step: "Act", detail: "Trigger notifications, tickets, and a follow-up check." }
    ],
    guardrails: [
      "No raw private data is shown to the client.",
      "Every action is explainable in civic language.",
      "Follow-up checks prevent one-shot decisions."
    ]
  };
}
