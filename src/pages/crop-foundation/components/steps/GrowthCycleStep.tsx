import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Sprout, Trash } from "lucide-react";

import { stageOptions } from "../../data/mocks";
import type { CreateCropFoundationForm, GrowthCycleDetail } from "../../types/types";

interface GrowthCycleStepProps {
  formData: CreateCropFoundationForm;
  handleAddGrowthCycle: () => void;
  handleRemoveGrowthCycle: (id: string) => void;
  handleUpdateGrowthCycle: (id: string, updates: Partial<GrowthCycleDetail>) => void;
}

export function GrowthCycleStep({
  formData,
  handleAddGrowthCycle,
  handleRemoveGrowthCycle,
  handleUpdateGrowthCycle,
}: GrowthCycleStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Chu kỳ sinh trưởng</h3>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập lộ trình và các giai đoạn phát triển tiêu chuẩn của cây
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {formData.growthCycles.map((cycle, index) => (
          <Card
            key={cycle.id}
            className="group relative border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Thông tin chu kỳ</h4>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => handleRemoveGrowthCycle(cycle.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tên chu kỳ <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={cycle.name}
                    onValueChange={(v) => handleUpdateGrowthCycle(cycle.id, { name: v })}
                  >
                    <SelectTrigger className="font-medium">
                      <SelectValue placeholder="Chọn chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kiến thiết cơ bản">Kiến thiết cơ bản</SelectItem>
                      <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Thời gian (ngày) <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      className="font-medium pr-12"
                      value={cycle.estimatedDays}
                      onChange={(e) =>
                        handleUpdateGrowthCycle(cycle.id, {
                          estimatedDays: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Giai đoạn chi tiết
                  </Label>
                  <MultiSelect
                    options={stageOptions}
                    placeholder="Chọn các giai đoạn phát triển..."
                    value={cycle.stages}
                    onChange={(v) => handleUpdateGrowthCycle(cycle.id, { stages: v })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          className="w-full h-12 border-dashed border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 font-bold rounded-xl transition-all gap-2"
          onClick={handleAddGrowthCycle}
        >
          <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-white">
            <Plus className="w-3 h-3" />
          </div>
          Thêm chu kỳ sinh trưởng mới
        </Button>
      </div>
    </div>
  );
}
