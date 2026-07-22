import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { GrowthStageCard } from "../GrowthStageCard";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { AnimalGrowthCycleFormValues } from "../../schemas/animalGrowthCycleSchema";

export function AnimalGrowthCycleStagesStep() {
  const { control } = useFormContext<AnimalGrowthCycleFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  });
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="space-y-6">
        {fields.map((field, index) => (
          <GrowthStageCard
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}

        <Button
          variant="outline"
          onClick={() =>
            append({
              id: `new-${fields.length + 1}`,
              name: `Giai đoạn ${fields.length + 1}`,
              duration: "",
              usePdf: false,
              content: "",
            })
          }
          className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
        >
          <Plus className="h-4 w-4" />
          Thêm giai đoạn
        </Button>
      </div>
    </div>
  );
}
