import {
  Button,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { BadgePlus, X } from "lucide-react";
import {
  mockTreatmentMethods,
  treatmentPlanIntensityOptions,
  treatmentPlanPriorityOptions,
} from "../data/soilAmendmentTreatmentData";
import type { TreatmentPlan, TreatmentPlanFormData } from "../types/treatment";

interface SoilTreatmentPlanFormDialogProps {
  formData: TreatmentPlanFormData;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  setFormData: React.Dispatch<React.SetStateAction<TreatmentPlanFormData>>;
  selectedItem: TreatmentPlan | null;
}

export function SoilTreatmentPlanFormDialog({
  formData,
  onOpenChange,
  onSubmit,
  open,
  setFormData,
  selectedItem,
}: SoilTreatmentPlanFormDialogProps) {
  const objectives = formData.objectives || [];
  const methods = formData.selectedMethods || [];

  const addObjective = () => {
    setFormData((current) => ({
      ...current,
      objectives: [...(current.objectives || []), ""],
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData((current) => ({
      ...current,
      objectives: (current.objectives || []).map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const removeObjective = (index: number) => {
    setFormData((current) => ({
      ...current,
      objectives: (current.objectives || []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const toggleMethod = (methodId: number) => {
    setFormData((current) => ({
      ...current,
      selectedMethods: (current.selectedMethods || []).includes(methodId)
        ? (current.selectedMethods || []).filter((item) => item !== methodId)
        : [...(current.selectedMethods || []), methodId],
    }));
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={selectedItem ? "Cập nhật phác đồ" : "Thêm phác đồ mới"}
      onSubmit={onSubmit}
      size="xl"
    >
      <div className="max-h-[calc(100vh-220px)] space-y-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mã phác đồ</Label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData((current) => ({ ...current, code: e.target.value }))
              }
              placeholder="VD: PD-004"
            />
          </div>
          <div className="space-y-2">
            <Label>Tên phác đồ</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((current) => ({ ...current, name: e.target.value }))
              }
              placeholder="Tên phác đồ cải tạo"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Khu vực</Label>
            <Input
              value={formData.zone}
              onChange={(e) =>
                setFormData((current) => ({ ...current, zone: e.target.value }))
              }
              placeholder="VD: Vùng A - Cà Mau"
            />
          </div>
          <div className="space-y-2">
            <Label>Loại cây trồng</Label>
            <Input
              value={formData.cropType}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  cropType: e.target.value,
                }))
              }
              placeholder="VD: Rau màu"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vấn đề đất</Label>
            <Textarea
              value={formData.soilIssue}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  soilIssue: e.target.value,
                }))
              }
              placeholder="Mô tả hiện trạng đất cần xử lý"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Kỹ thuật viên phụ trách</Label>
            <Input
              value={formData.technician}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  technician: e.target.value,
                }))
              }
              placeholder="Tên kỹ thuật viên"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Thời lượng</Label>
            <Input
              value={formData.duration}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  duration: e.target.value,
                }))
              }
              placeholder="VD: 12 tháng"
            />
          </div>
          <div className="space-y-2">
            <Label>Cường độ</Label>
            <Select
              value={formData.intensity}
              onValueChange={(value: TreatmentPlan["intensity"]) =>
                setFormData((current) => ({ ...current, intensity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {treatmentPlanIntensityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ưu tiên</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: TreatmentPlan["priority"]) =>
                setFormData((current) => ({ ...current, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {treatmentPlanPriorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Diện tích (ha)</Label>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  area: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ngày bắt đầu</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  startDate: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ngày kết thúc</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  endDate: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ngân sách (triệu đồng)</Label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                budget: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Mục tiêu</Label>
            <Button type="button" variant="outline" size="sm" onClick={addObjective}>
              <BadgePlus className="mr-2 h-4 w-4" />
              Thêm mục tiêu
            </Button>
          </div>
          <div className="space-y-2">
            {objectives.length > 0 ? (
              objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Mục tiêu ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Chưa có mục tiêu nào</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Phương pháp áp dụng</Label>
          <div className="grid grid-cols-2 gap-2">
            {mockTreatmentMethods.map((method) => {
              const selected = methods.includes(method.id);
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => toggleMethod(method.id)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    selected
                      ? "border-green-200 bg-green-50 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {method.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
