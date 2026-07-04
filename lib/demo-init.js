import { BigQuery } from "@google-cloud/bigquery";
import { Storage } from "@google-cloud/storage";

import { buildForecast } from "./analytics.js";
import { scenarios } from "./mock-data.js";

function getProjectId() {
  return (
    process.env.GCP_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    ""
  );
}

function getBigQueryTarget() {
  const projectId = getProjectId();
  const datasetId = process.env.BIGQUERY_DATASET || "cyvix_demo";
  const tableId = process.env.BIGQUERY_TABLE || "scenario_baselines";

  return projectId
    ? { projectId, datasetId, tableId }
    : null;
}

function getStorageTarget() {
  const projectId = getProjectId();
  const bucketName = process.env.GCS_BUCKET || "";

  return projectId && bucketName ? { projectId, bucketName } : null;
}

function buildSeedRow(scenario, createdAt) {
  const forecast = buildForecast(scenario);

  return {
    scenario_id: scenario.id,
    title: scenario.title,
    tag: scenario.tag,
    ward: scenario.ward,
    domain: scenario.domain,
    source_theme: scenario.sourceTheme,
    risk_score: scenario.riskScore,
    confidence: scenario.confidence,
    summary: scenario.summary,
    primary_signal: scenario.primarySignal,
    action: scenario.action,
    response_window: scenario.responseWindow,
    forecast_window_hours: scenario.forecastWindowHours,
    next_failure: forecast.nextFailure,
    evidence_technical: scenario.evidence.technical,
    evidence_civic: scenario.evidence.civic,
    trace_json: JSON.stringify(scenario.trace),
    signals_json: JSON.stringify(scenario.signals),
    workflow_json: JSON.stringify(scenario.workflow),
    chart_json: JSON.stringify(scenario.chart),
    updated_at: createdAt.toISOString()
  };
}

export function buildDemoSeedRows(createdAt = new Date()) {
  return scenarios.map((scenario) => buildSeedRow(scenario, createdAt));
}

export function buildDemoManifest() {
  const projectId = getProjectId() || "demo-project";
  const now = new Date();
  const bigquery = getBigQueryTarget();
  const storage = getStorageTarget();
  const lookerDashboardUrl =
    process.env.LOOKER_EMBED_URL ||
    process.env.LOOKER_DASHBOARD_URL ||
    process.env.LOOKER_INSTANCE_URL ||
    "";
  const gkeClusterName = process.env.GKE_CLUSTER_NAME || "";
  const gkeLocation = process.env.GKE_LOCATION || process.env.GCP_REGION || "asia-south1";

  return {
    generatedAt: now.toISOString(),
    projectId,
    scenarioCount: scenarios.length,
    demoMode: true,
    bigquery: {
      live: Boolean(bigquery),
      datasetId: bigquery?.datasetId || "cyvix_demo",
      tableId: bigquery?.tableId || "scenario_baselines"
    },
    storage: {
      live: Boolean(storage),
      bucketName: storage?.bucketName || "",
      objectPrefix: "cyvix/demo"
    },
    looker: {
      live: Boolean(lookerDashboardUrl),
      title: process.env.LOOKER_DASHBOARD_TITLE || "Civic operations review",
      dashboardUrl: lookerDashboardUrl || null,
      embedUrl: process.env.LOOKER_EMBED_URL || null,
      status: lookerDashboardUrl ? "connected" : "preview"
    },
    gke: {
      live: Boolean(gkeClusterName),
      clusterName: gkeClusterName || "cyvix-gke",
      location: gkeLocation,
      namespace: process.env.GKE_NAMESPACE || "cyvix",
      image: process.env.GKE_IMAGE || `gcr.io/${projectId}/cyvix:latest`,
      manifestPath: "k8s/gke/cyvix.yaml",
      status: gkeClusterName ? "ready" : "path-ready",
      commands: [
        `gcloud container clusters get-credentials ${gkeClusterName || "<cluster-name>"} --region ${gkeLocation} --project ${projectId}`,
        `kubectl apply -f k8s/gke/cyvix.yaml`,
        `kubectl -n ${process.env.GKE_NAMESPACE || "cyvix"} rollout status deployment/cyvix`
      ]
    },
    scripts: {
      seedBigQuery: "npm run seed:bigquery",
      demoInit: "npm run demo:init"
    }
  };
}

export function buildDemoStatus() {
  const manifest = buildDemoManifest();
  return {
    live: {
      cloudRun: true,
      bigquery: manifest.bigquery.live,
      storage: manifest.storage.live,
      looker: manifest.looker.live,
      gke: manifest.gke.live
    },
    manifest
  };
}

const schema = [
  { name: "scenario_id", type: "STRING" },
  { name: "title", type: "STRING" },
  { name: "tag", type: "STRING" },
  { name: "ward", type: "STRING" },
  { name: "domain", type: "STRING" },
  { name: "source_theme", type: "STRING" },
  { name: "risk_score", type: "INTEGER" },
  { name: "confidence", type: "FLOAT" },
  { name: "summary", type: "STRING" },
  { name: "primary_signal", type: "STRING" },
  { name: "action", type: "STRING" },
  { name: "response_window", type: "STRING" },
  { name: "forecast_window_hours", type: "INTEGER" },
  { name: "next_failure", type: "STRING" },
  { name: "evidence_technical", type: "STRING" },
  { name: "evidence_civic", type: "STRING" },
  { name: "trace_json", type: "STRING" },
  { name: "signals_json", type: "STRING" },
  { name: "workflow_json", type: "STRING" },
  { name: "chart_json", type: "STRING" },
  { name: "updated_at", type: "TIMESTAMP" }
];

async function seedBigQuery(rows) {
  const target = getBigQueryTarget();
  if (!target) {
    return {
      connected: false,
      source: "local-fallback"
    };
  }

  const client = new BigQuery({ projectId: target.projectId });
  const dataset = client.dataset(target.datasetId);
  const table = dataset.table(target.tableId);
  const location = process.env.BIGQUERY_LOCATION || process.env.GCP_REGION || "asia-south1";

  const [datasetExists] = await dataset.exists();
  if (!datasetExists) {
    await dataset.create({ location });
  }

  const [tableExists] = await table.exists();
  if (!tableExists) {
    await table.create({ schema, location });
  }

  await table.insert(rows, {
    ignoreUnknownValues: true,
    skipInvalidRows: true
  });

  return {
    connected: true,
    source: "bigquery",
    projectId: target.projectId,
    datasetId: target.datasetId,
    tableId: target.tableId,
    rowsInserted: rows.length
  };
}

async function writeManifestBundle(manifest, rows) {
  const target = getStorageTarget();
  if (!target) {
    return {
      connected: false,
      source: "local-fallback"
    };
  }

  const client = new Storage({ projectId: target.projectId });
  const stamp = manifest.generatedAt.replace(/[:.]/g, "-");
  const manifestPath = `cyvix/demo/${stamp}-manifest.json`;
  const seedPath = `cyvix/demo/${stamp}-seed.json`;

  await client.bucket(target.bucketName).file(manifestPath).save(JSON.stringify(manifest, null, 2), {
    contentType: "application/json",
    resumable: false,
    metadata: { cacheControl: "no-store" }
  });

  await client.bucket(target.bucketName).file(seedPath).save(JSON.stringify(rows, null, 2), {
    contentType: "application/json",
    resumable: false,
    metadata: { cacheControl: "no-store" }
  });

  return {
    connected: true,
    source: "storage",
    bucket: target.bucketName,
    manifestPath,
    seedPath,
    manifestUri: `gs://${target.bucketName}/${manifestPath}`,
    seedUri: `gs://${target.bucketName}/${seedPath}`
  };
}

export async function seedDemoData({ seedBigQueryRows = true, writeStorageBundle = true } = {}) {
  const manifest = buildDemoManifest();
  const rows = buildDemoSeedRows(new Date(manifest.generatedAt));

  const bigquery = seedBigQueryRows ? await seedBigQuery(rows) : { connected: false, source: "skipped" };
  const storage = writeStorageBundle ? await writeManifestBundle(manifest, rows) : { connected: false, source: "skipped" };

  return {
    manifest,
    rows,
    bigquery,
    storage
  };
}

export function buildGkeDeploymentPath() {
  const manifest = buildDemoManifest();
  return {
    ...manifest.gke,
    dockerfile: "Dockerfile",
    buildCommand: `gcloud builds submit --tag ${manifest.gke.image} .`,
    note: "Use a dedicated node pool if you want stronger isolation for the civic workload."
  };
}
