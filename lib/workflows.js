import { getScenario } from "./mock-data.js";

export function buildRecommendation(scenarioId, analysis = null) {
  const scenario = getScenario(scenarioId);
  const title = scenario.action;
  const checklist = scenario.workflow.map((item) => item.step);

  return {
    scenarioId: scenario.id,
    title,
    owner: scenario.domain === "transportation" ? "Transit operations" : scenario.domain === "utilities" ? "Utilities crew" : "Community outreach",
    summary:
      analysis?.answer ??
      `${scenario.title} requires immediate intervention and a clear resident-facing update.`,
    responseWindow: scenario.responseWindow,
    riskIfIgnored: scenario.riskIfIgnored,
    actions: scenario.workflow,
    checklist,
    automation: [
      "Create incident packet in Cloud Run",
      "Push notification via Cloud Functions",
      "Update decision dashboard in Looker",
      "Schedule follow-up check through ADK"
    ]
  };
}

