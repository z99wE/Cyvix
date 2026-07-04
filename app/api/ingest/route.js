import { getScenario } from "@/lib/mock-data";

function buildIngestBatch(scenario) {
  const now = new Date();
  return {
    sourceTheme: scenario.sourceTheme,
    ward: scenario.ward,
    domain: scenario.domain,
    receivedAt: now.toISOString(),
    streams: scenario.feeds.map((feed, index) => ({
      id: `${scenario.id}-${index + 1}`,
      source: feed.source,
      detail: feed.detail,
      timestamp: new Date(now.getTime() - index * 900000).toISOString()
    })),
    signalVector: scenario.signals.map((signal) => ({
      name: signal.name,
      value: signal.value,
      note: signal.note
    })),
    chart: scenario.chart
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scenarioId = searchParams.get("scenarioId") ?? "transit";
  const scenario = getScenario(scenarioId);

  return Response.json({
    ok: true,
    stage: "ingest",
    pipeline: [
      "Cloud Storage",
      "Dataflow",
      "BigQuery"
    ],
    batch: buildIngestBatch(scenario)
  });
}

