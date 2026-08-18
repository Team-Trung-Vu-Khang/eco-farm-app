import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GripVertical, Plus, Trash2, Layers, Calendar } from "lucide-react";
import type { SeasonStage } from "../types/types";
import { createEmptyStage } from "../utils/utils";

interface SeasonStagesCardProps {
  stages: SeasonStage[];
  onChange: (stages: SeasonStage[]) => void;
  totalDuration: number;
}

export function SeasonStagesCard({
  stages,
  onChange,
  totalDuration,
}: SeasonStagesCardProps) {
  const handleAddStage = () => {
    onChange([...stages, createEmptyStage(stages.length)]);
  };

  const handleRemoveStage = (index: number) => {
    onChange(stages.filter((_, i) => i !== index));
  };

  const handleUpdateStage = (
    index: number,
    field: keyof SeasonStage,
    value: SeasonStage[keyof SeasonStage],
  ) => {
    const updated = stages.map((stage, i) =>
      i === index ? { ...stage, [field]: value } : stage,
    );
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-100 p-2 text-green-700">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle>Các giai đoạn</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-auto">
              {stages.length} giai đoạn
            </Badge>
            {totalDuration > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                {totalDuration} ngày
              </Badge>
            )}
            <Button size="sm" className="h-8 font-bold" onClick={handleAddStage}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Thêm
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {stages.length > 0 ? (
            stages.map((stage, index) => (
              <div
                key={index}
                className="group flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-green-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Tên giai đoạn <span className="text-destructive">*</span>
                        </label>
                        <Input
                          placeholder="VD: Giai đoạn 1 - Ương giống"
                          value={stage.name}
                          onChange={(e) =>
                            handleUpdateStage(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Thời gian (ngày)
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={stage.durationDays || ""}
                          onChange={(e) =>
                            handleUpdateStage(
                              index,
                              "durationDays",
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Mô tả
                      </label>
                      <Textarea
                        placeholder="Mô tả về giai đoạn này..."
                        rows={2}
                        value={stage.description || ""}
                        onChange={(e) =>
                          handleUpdateStage(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/5 hover:text-destructive"
                    onClick={() => handleRemoveStage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed bg-muted/20 py-10 text-center">
              <Layers className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">
                Chưa có giai đoạn nào.
              </p>
              <Button
                variant="link"
                className="mt-2 font-bold text-green-700"
                onClick={handleAddStage}
              >
                + Thêm giai đoạn đầu tiên
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
