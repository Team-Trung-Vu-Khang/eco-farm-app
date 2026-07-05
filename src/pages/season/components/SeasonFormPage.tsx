import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import type { GrowthCycle } from "../../growth-cycle/types/types";
import type { SeasonFormData } from "../types/types";
import { GrowthCycleSelectDialog } from "./GrowthCycleSelectDialog";
import { SeasonBasicInfoCard } from "./SeasonBasicInfoCard";
import { SeasonDocumentsCard } from "./SeasonDocumentsCard";
import { SeasonGrowthCyclesCard } from "./SeasonGrowthCyclesCard";

interface SeasonFormPageProps {
  description: string;
  dialogOpen: boolean;
  formData: SeasonFormData;
  growthCycles: GrowthCycle[];
  onBack: () => void;
  onCycleConfirm: (
    growthCycleId: string,
    selectedStages: Record<string, Record<string, string>>,
  ) => void;
  onDialogOpenChange: (open: boolean) => void;
  onFormChange: (formData: SeasonFormData) => void;
  onRemoveCycle: (cycleId: string) => void;
  onSubmit: () => void;
  showStatusField?: boolean;
  submitLabel: string;
  title: string;
  varieties: { id: string; crop: string; varietyName: string }[];
}

export function SeasonFormPage({
  description,
  dialogOpen,
  formData,
  growthCycles,
  onBack,
  onCycleConfirm,
  onDialogOpenChange,
  onFormChange,
  onRemoveCycle,
  onSubmit,
  showStatusField = false,
  submitLabel,
  title,
  varieties,
}: SeasonFormPageProps) {
  const selectedCycles = growthCycles.filter((cycle) =>
    formData.growthCycleIds.includes(cycle.id),
  );

  return (
    <AdminLayout title={title} description={description}>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SeasonBasicInfoCard
            formData={formData}
            onChange={onFormChange}
            showStatusField={showStatusField}
            varieties={varieties}
          />

          <SeasonGrowthCyclesCard
            growthCycleIds={formData.growthCycleIds}
            onAddCycle={() => onDialogOpenChange(true)}
            onRemoveCycle={onRemoveCycle}
            selectedCycles={selectedCycles}
            selectedStages={formData.selectedStages}
          />
        </div>

        <SeasonDocumentsCard
          documents={formData.documents}
          onDocumentsChange={(documents) =>
            onFormChange({
              ...formData,
              documents,
            })
          }
          onSubmit={onSubmit}
          submitLabel={submitLabel}
        />
      </div>

      <GrowthCycleSelectDialog
        open={dialogOpen}
        onOpenChange={onDialogOpenChange}
        scope={formData.scope}
        cropId={formData.cropId}
        varietyId={formData.varietyId}
        selectedId={formData.growthCycleIds[0] || ""}
        selectedStages={formData.selectedStages}
        onConfirm={onCycleConfirm}
      />
    </AdminLayout>
  );
}
