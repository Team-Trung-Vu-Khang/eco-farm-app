import PlanGrowthWorkflowPlansPage from "../plan-growth/PlanGrowthWorkflowPlansPage";

interface PlanAnimalGrowthWorkflowPlansPageProps {
  basePath?: string;
}

/** Shared workflow-plan UI; the workflow API remains scoped to livestock. */
export default function PlanAnimalGrowthWorkflowPlansPage({
  basePath = "/plan-animal-growth",
}: PlanAnimalGrowthWorkflowPlansPageProps) {
  return (
    <PlanGrowthWorkflowPlansPage
      basePath={basePath}
      domainCode="LIVESTOCK"
      planSearchPlaceholder="Tìm kiếm kế hoạch chăn nuôi..."
    />
  );
}
