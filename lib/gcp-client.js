import { BigQuery } from "@google-cloud/bigquery";
import { Storage } from "@google-cloud/storage";

let bigQueryClient;
let storageClient;

function getProjectId() {
  return (
    process.env.GCP_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    ""
  );
}

function getBigQueryClient() {
  const projectId = getProjectId();
  const dataset = process.env.BIGQUERY_DATASET;
  const table = process.env.BIGQUERY_TABLE;

  if (!projectId || !dataset || !table) {
    return null;
  }

  if (!bigQueryClient) {
    bigQueryClient = new BigQuery({ projectId });
  }

  return { client: bigQueryClient, projectId, dataset, table };
}

function getStorageClient() {
  const projectId = getProjectId();
  const bucketName = process.env.GCS_BUCKET;

  if (!projectId || !bucketName) {
    return null;
  }

  if (!storageClient) {
    storageClient = new Storage({ projectId });
  }

  return { client: storageClient, bucketName, projectId };
}

function safeFileName(value) {
  return value.replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function getGcpConfig() {
  return {
    projectId: getProjectId() || null,
    bigquery: Boolean(process.env.BIGQUERY_DATASET && process.env.BIGQUERY_TABLE),
    storage: Boolean(process.env.GCS_BUCKET)
  };
}

export async function fetchScenarioBaseline(scenarioId) {
  const config = getBigQueryClient();
  if (!config) {
    return {
      connected: false,
      source: "local-fallback"
    };
  }

  const { client, dataset, table, projectId } = config;
  const query = `
    SELECT *
    FROM \`${projectId}.${dataset}.${table}\`
    WHERE scenario_id = @scenarioId
    ORDER BY updated_at DESC
    LIMIT 1
  `;

  try {
    const [rows] = await client.query({
      query,
      params: { scenarioId },
      location: process.env.BIGQUERY_LOCATION || process.env.GCP_REGION || undefined
    });

    return {
      connected: true,
      source: "bigquery",
      query,
      row: rows[0] ?? null
    };
  } catch (error) {
    return {
      connected: false,
      source: "bigquery",
      error: error instanceof Error ? error.message : "BigQuery query failed"
    };
  }
}

export async function persistIngestBatch({ scenarioId, batch }) {
  const config = getStorageClient();
  if (!config) {
    return {
      connected: false,
      source: "local-fallback"
    };
  }

  const { client, bucketName } = config;
  const now = new Date().toISOString();
  const path = `cyvix/ingest/${safeFileName(scenarioId)}/${now.replace(/[:.]/g, "-")}.json`;

  try {
    await client.bucket(bucketName).file(path).save(JSON.stringify(batch, null, 2), {
      contentType: "application/json",
      resumable: false,
      metadata: {
        cacheControl: "no-store"
      }
    });

    return {
      connected: true,
      source: "storage",
      bucket: bucketName,
      path,
      uri: `gs://${bucketName}/${path}`
    };
  } catch (error) {
    return {
      connected: false,
      source: "storage",
      error: error instanceof Error ? error.message : "Cloud Storage write failed"
    };
  }
}

