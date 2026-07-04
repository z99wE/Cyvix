import DashboardClient from "@/components/DashboardClient";
import { googleStack, pipelineStages, scenarios } from "@/lib/mock-data";

export default function Page() {
  return <DashboardClient scenarios={scenarios} pipelineStages={pipelineStages} stack={googleStack} />;
}
