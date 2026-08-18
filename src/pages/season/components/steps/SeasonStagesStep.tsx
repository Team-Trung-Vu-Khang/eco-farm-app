import React from "react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { SeasonStageCard } from "../SeasonStageCard";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { SeasonFormValues } from "../../schemas/seasonFormSchema";

export function SeasonStagesStep() {
  const { control } = useFormContext<SeasonFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div className="space-y-6">
        {fields.map((field, index) => (
          <SeasonStageCard
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: `Giai đoạn ${fields.length + 1}`,
              description: "",
              durationDays: 0,
              displayOrder: fields.length,
              documents: [],
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
