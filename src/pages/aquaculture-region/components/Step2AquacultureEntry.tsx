import React from "react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Sprout, Upload } from "lucide-react";
import { PlantCard } from "./AquacultureEntryCard";
import { type PlantEntry } from "./types";

interface Step2PlantEntryProps {
  plants: PlantEntry[];
  addPlant: () => void;
  removePlant: (id: string) => void;
  updatePlant: (id: string, partial: Partial<PlantEntry>) => void;
  initialData: any;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
}

export const Step2PlantEntry: React.FC<Step2PlantEntryProps> = ({
  plants,
  addPlant,
  removePlant,
  updatePlant,
  initialData,
  setIsImportOpen,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50 p-5 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: icon + title + description */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-base font-bold text-blue-900">
                  Danh sách đối tượng nuôi
                </h3>
                <span className="shrink-0 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {plants.length} mục
                </span>
              </div>
              <p className="text-sm text-blue-700/80">
                Mỗi đối tượng nuôi có thể thuộc một lô/vị trí khác nhau trong
                vùng nuôi trồng.
              </p>
            </div>
          </div>

          {/* Right: import button */}
          {!initialData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200 sm:w-auto shrink-0"
            >
              <Upload className="w-4 h-4 mr-2" /> Nhập từ Excel
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-4">
        {plants.map((plant, idx) => (
          <PlantCard
            key={plant.entryId}
            plant={plant}
            index={idx}
            onUpdate={(partial) => updatePlant(plant.entryId, partial)}
            onRemove={() => removePlant(plant.entryId)}
            canRemove
          />
        ))}

        {!initialData && (
          <button
            type="button"
            onClick={addPlant}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:border-primary/60 hover:bg-primary/5 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm đối tượng nuôi
          </button>
        )}
      </div>
    </div>
  );
};
