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
import { CATEGORY_LABELS } from "../data/constants";
import type { PlanTypeCategory, PlanTypeFormData } from "../types/types";

interface PlanTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: PlanTypeFormData;
  setFormData: (data: PlanTypeFormData) => void;
  onSubmit: () => void;
}

export function PlanTypeFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
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
        <div className="grid grid-cols-2 gap-4">
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
              placeholder="VD: KHCT, BVTV..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Nhóm phân loại</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  category: value as PlanTypeCategory,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Kế hoạch vụ Đông Xuân..."
          />
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
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

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
