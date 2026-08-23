import PlanGrowthPage from "../plan-growth/PlanGrowthPage";
import { useAnimalGrowthWorkflowDraftStore } from "./hooks/useAnimalGrowthWorkflowDraftStore";

interface PlanAnimalGrowthPageProps {
  basePath?: string;
}

/** Reuses the crop plan-management UI while keeping the livestock API domain. */
export default function PlanAnimalGrowthPage({
  basePath = "/plan-animal-growth",
}: PlanAnimalGrowthPageProps) {
  const resetDraft = useAnimalGrowthWorkflowDraftStore(
    (state) => state.resetDraft,
  );

  return (
    <PlanGrowthPage
      basePath={basePath}
      domainCode="LIVESTOCK"
      title="Quản lý chăn nuôi"
      description="Lập và quản lý kế hoạch chăn nuôi theo lứa nuôi"
      searchPlaceholder="Tìm kiếm sơ đồ quy trình chăn nuôi..."
      resetDraft={resetDraft}
    />
  );
}
