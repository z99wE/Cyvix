import { analyzeScenario } from "@/lib/analytics";

export async function POST(request) {
  const body = await request.json();
  const scenarioId = body?.scenarioId ?? "transit";
  const question = body?.question ?? "Why is this ward flagged?";
  const analysis = analyzeScenario({ scenarioId, question });

  return Response.json({
    ok: true,
    stage: "analyze",
    analysis
  });
}

