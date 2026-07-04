import { analyzeScenario } from "@/lib/analytics";
import { buildDecisionEngine } from "@/lib/decision-engine";
import { enrichWithProviders } from "@/lib/provider-client";
import { fetchScenarioBaseline } from "@/lib/gcp-client";

export async function POST(request) {
  const body = await request.json();
  const scenarioId = body?.scenarioId ?? "transit";
  const question = body?.question ?? "Why is this ward flagged?";
  const analysis = analyzeScenario({ scenarioId, question });
  const decision = buildDecisionEngine({ scenarioId, question });
  const gcp = {
    bigquery: await fetchScenarioBaseline(scenarioId)
  };
  const provider = await enrichWithProviders({
    scenario: decision.scenario,
    question,
    analysis,
    recommendation: decision.recommendation
  });

  if (provider.narrative) {
    analysis.providerNarrative = provider.narrative;
    analysis.providerSource = provider.source;
  }

  if (gcp.bigquery?.row) {
    analysis.gcpBaseline = gcp.bigquery.row;
  }

  analysis.gcp = gcp;

  return Response.json({
    ok: true,
    stage: "analyze",
    analysis,
    decision,
    provider,
    gcp
  });
}
