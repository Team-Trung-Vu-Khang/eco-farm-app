import {
  Badge,
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
import { Package, Plus, X } from "lucide-react";
import type { AmendmentTask } from "../../stores/useAmendmentTaskStore";
import {
  MATERIAL_OPTIONS,
  MATERIAL_TYPES,
  MATERIAL_UNITS,
  mockAmendmentMethods,
  mockAmendmentPlans,
  mockPersonnel,
  mockRegions,
  mockTeams,
} from "../data/amendmentTaskData";

type NewMaterialState = {
  type: "fertilizer" | "pesticide" | "tool" | "other";
  name: string;
  quantity: string;
  unit: string;
};

interface AmendmentTaskFormDialogProps {
  formData: Partial<AmendmentTask>;
  handleAddMaterial: () => void;
  handleRemoveMaterial: (id: number) => void;
  handleSubmit: () => void;
  newMaterial: NewMaterialState;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedItem: AmendmentTask | null;
  selectedRegion: string;
  setFormData: React.Dispatch<React.SetStateAction<Partial<AmendmentTask>>>;
  setNewMaterial: React.Dispatch<React.SetStateAction<NewMaterialState>>;
  setSelectedRegion: (region: string) => void;
}

export function AmendmentTaskFormDialog({
  formData,
  handleAddMaterial,
  handleRemoveMaterial,
  handleSubmit,
  newMaterial,
  onOpenChange,
  open,
  selectedItem,
  selectedRegion,
  setFormData,
  setNewMaterial,
  setSelectedRegion,
}: AmendmentTaskFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={selectedItem ? "Cập nhật công việc" : "Tạo công việc mới"}
      onSubmit={handleSubmit}
      size="xl"
    >
      <div className="max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <h4 className="border-b pb-1 text-sm font-semibold text-slate-900">
            Thông tin cơ bản
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Mã công việc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData((current) => ({ ...current, code: e.target.value }))
                }
                placeholder="VD: NVCT-001"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Tên công việc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((current) => ({ ...current, name: e.target.value }))
                }
                placeholder="VD: Rải vôi bột khử chua"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Kế hoạch cải tạo</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => {
                  const plan = mockAmendmentPlans.find((item) => item.name === value);
                  setFormData((current) => ({
                    ...current,
                    plan: value,
                    zone: plan?.zone || "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kế hoạch" />
                </SelectTrigger>
                <SelectContent>
                  {mockAmendmentPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Phương pháp cải tạo</Label>
              <Select
                value={formData.method}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, method: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương pháp" />
                </SelectTrigger>
                <SelectContent>
                  {mockAmendmentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Vùng</Label>
              <Select
                value={selectedRegion}
                onValueChange={(value) => {
                  setSelectedRegion(value);
                  setFormData((current) => ({ ...current, zone: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vùng" />
                </SelectTrigger>
                <SelectContent>
                  {mockRegions.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Khu vực thực hiện</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, zone: value }))
                }
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={selectedRegion ? "Chọn khu vực" : "Chọn vùng trước"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedRegion &&
                    mockRegions
                      .find((region) => region.name === selectedRegion)
                      ?.zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.name}>
                          {zone.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="border-b pb-1 text-sm font-semibold text-slate-900">
            Phân công thực hiện
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Loại phân công</Label>
              <Select
                value={formData.assignedType}
                onValueChange={(value: "individual" | "team") =>
                  setFormData((current) => ({
                    ...current,
                    assignedType: value,
                    assignedTo: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                  <SelectItem value="team">Đội nhóm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Người/Đội thực hiện</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, assignedTo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người/đội" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.assignedType === "team" ? mockTeams : mockPersonnel).map(
                    (item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="border-b pb-1 text-sm font-semibold text-slate-900">
            Tiến độ & Ưu tiên
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AmendmentTask["status"]) =>
                  setFormData((current) => ({ ...current, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ thực hiện</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: AmendmentTask["priority"]) =>
                  setFormData((current) => ({ ...current, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Diện tích mục tiêu (ha)</Label>
            <Input
              type="number"
              value={formData.targetArea}
              min={0}
              step={0.1}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  targetArea: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="border-b pb-1 text-sm font-semibold text-slate-900">
            Ghi chú kỹ thuật
          </h4>
          <div className="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((current) => ({ ...current, notes: e.target.value }))
              }
              placeholder="Liều lượng, quy trình, lưu ý kỹ thuật..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Package className="h-4 w-4 text-slate-500" />
            Nguồn lực & Vật tư
          </h3>

          <div className="space-y-2">
            {formData.materials?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded border bg-slate-50 p-2"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {MATERIAL_TYPES.find((type) => type.id === item.type)?.label}
                  </Badge>
                  <Badge variant="outline">
                    {item.quantity} {item.unit}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!formData.materials || formData.materials.length === 0) && (
              <p className="py-2 text-center text-sm italic text-slate-400">
                Chưa có vật tư nào
              </p>
            )}
          </div>

          <div className="mb-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            {MATERIAL_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = newMaterial.type === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() =>
                    setNewMaterial((current) => ({
                      ...current,
                      type: type.id,
                      name: "",
                      unit: MATERIAL_UNITS[type.id][0],
                    }))
                  }
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                    isSelected
                      ? `${type.bg} ${type.border} border-2`
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isSelected ? type.color : "text-slate-500"}`}
                  />
                  <span
                    className={`text-xs font-medium ${isSelected ? type.color : "text-slate-600"}`}
                  >
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Tên {MATERIAL_TYPES.find((type) => type.id === newMaterial.type)?.label}
              </Label>
              <Select
                value={newMaterial.name}
                onValueChange={(value) => {
                  const option = MATERIAL_OPTIONS[newMaterial.type].find(
                    (item) => item.value === value,
                  );
                  setNewMaterial((current) => ({
                    ...current,
                    name: value,
                    unit: option?.unit || "kg",
                  }));
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn..." />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_OPTIONS[newMaterial.type].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Số lượng</Label>
              <Input
                type="number"
                className="h-9"
                value={newMaterial.quantity}
                onChange={(e) =>
                  setNewMaterial((current) => ({
                    ...current,
                    quantity: e.target.value,
                  }))
                }
                placeholder="0"
              />
            </div>
            <div className="w-24 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Đơn vị</Label>
              <Select
                value={newMaterial.unit}
                onValueChange={(value) =>
                  setNewMaterial((current) => ({ ...current, unit: value }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_UNITS[newMaterial.type].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleAddMaterial} className="mb-px h-9 w-9 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
