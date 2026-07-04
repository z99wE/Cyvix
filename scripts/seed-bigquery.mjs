import { seedDemoData } from "../lib/demo-init.js";

async function main() {
  const result = await seedDemoData({
    seedBigQueryRows: true,
    writeStorageBundle: false
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "bigquery-seed",
        rowsInserted: result.bigquery?.rowsInserted ?? 0,
        projectId: result.bigquery?.projectId ?? null,
        datasetId: result.bigquery?.datasetId ?? null,
        tableId: result.bigquery?.tableId ?? null
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

