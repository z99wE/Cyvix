import { buildDemoStatus, buildGkeDeploymentPath } from "@/lib/demo-init";
import { getGcpConfig } from "@/lib/gcp-client";

export async function GET() {
  const status = buildDemoStatus();
  const gcp = getGcpConfig();
  const gke = buildGkeDeploymentPath();

  return Response.json({
    ok: true,
    stage: "platform",
    gcp,
    status,
    looker: status.manifest.looker,
    gke,
    liveServices: {
      cloudRun: true,
      bigquery: status.manifest.bigquery.live,
      storage: status.manifest.storage.live
    }
  });
}

