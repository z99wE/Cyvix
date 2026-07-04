import { seedDemoData } from "../lib/demo-init.js";

async function main() {
  const result = await seedDemoData({
    seedBigQueryRows: true,
    writeStorageBundle: true
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "demo-init",
        scenarioCount: result.manifest.scenarioCount,
        bigquery: result.bigquery,
        storage: result.storage,
        looker: result.manifest.looker,
        gke: result.manifest.gke
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

