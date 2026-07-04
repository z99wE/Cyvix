import { buildDemoStatus, seedDemoData } from "@/lib/demo-init";

export async function GET() {
  const status = buildDemoStatus();

  return Response.json({
    ok: true,
    stage: "demo",
    mode: "preview",
    status
  });
}

export async function POST() {
  const result = await seedDemoData({
    seedBigQueryRows: true,
    writeStorageBundle: true
  });

  return Response.json({
    ok: true,
    stage: "demo",
    mode: "initialized",
    result
  });
}

