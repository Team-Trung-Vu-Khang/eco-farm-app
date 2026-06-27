import {
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
import { PLAN_TYPE_STATUS_OPTIONS } from "../data/constants";
import type {
  PlanGroupOption,
  PlanTypeFormData,
} from "../types/types";

interface PlanTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: PlanTypeFormData;
  setFormData: (data: PlanTypeFormData) => void;
  planGroupOptions: PlanGroupOption[];
  onSubmit: () => void;
}

export function PlanTypeFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  planGroupOptions,
  onSubmit,
}: PlanTypeFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa loại kế hoạch" : "Thêm loại kế hoạch mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="code"
              className="after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Mã loại
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="VD: KHCT"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Tên loại kế hoạch
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Kế hoạch canh tác"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="planGroupId" required>
              Nhóm kế hoạch
            </Label>
            <Select
              value={formData.planGroupId}
              onValueChange={(value) =>
                setFormData({ ...formData, planGroupId: value })
              }
            >
              <SelectTrigger id="planGroupId">
                <SelectValue placeholder="Chọn nhóm kế hoạch" />
              </SelectTrigger>
              <SelectContent>
                {planGroupOptions.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name} ({option.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Màu nhận diện</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="h-10 w-12 cursor-pointer p-1"
              />
              <Input
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="#10b981"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {isEdit ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status" required>
                Trạng thái
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as PlanTypeFormData["status"],
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả chi tiết</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả mục đích và phạm vi áp dụng của loại kế hoạch này..."
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
}
