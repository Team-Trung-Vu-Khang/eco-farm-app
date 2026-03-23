import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import type { GrowthStage } from "../../types/types";
import { GrowthStageCard } from "../GrowthStageCard";

interface GrowthCycleStagesStepProps {
  stages: GrowthStage[];
  onAddStage: () => void;
  onRemoveStage: (id: string) => void;
  onUpdateStage: (id: string, updates: Partial<GrowthStage>) => void;
}

export function GrowthCycleStagesStep({
  stages,
  onAddStage,
  onRemoveStage,
  onUpdateStage,
}: GrowthCycleStagesStepProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="space-y-6">
        {stages.map((stage, index) => (
          <GrowthStageCard
            key={stage.id}
            stage={stage}
            index={index}
            onRemove={onRemoveStage}
            onUpdate={onUpdateStage}
          />
        ))}

        <Button
          variant="outline"
          onClick={onAddStage}
          className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
        >
          <Plus className="h-4 w-4" />
          Thêm giai đoạn
        </Button>
      </div>
    </div>
  );
}
