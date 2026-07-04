import { buildRecommendation } from "@/lib/workflows";

export async function POST(request) {
  const body = await request.json();
  const scenarioId = body?.scenarioId ?? "transit";
  const analysis = body?.analysis ?? null;
  const recommendation = buildRecommendation(scenarioId, analysis);

  return Response.json({
    ok: true,
    stage: "recommend",
    recommendation
  });
}

